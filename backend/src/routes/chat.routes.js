/**
 * Chat Routes
 * Handles chat API endpoints with streaming support and fallback.
 * Uses LLM interface (never provider directly) for all AI operations.
 */

import express from 'express';
import crypto from 'crypto';
import { getLLMProvider } from '../services/llm/llm.factory.js';
import { validateContext } from '../services/context.validator.js';
import { buildContextWindow, addMessage, clearSession } from '../services/memory.manager.js';
import { loadPrompt, getCurrentVersion, logRequest } from '../services/prompt.manager.js';

const router = express.Router();

/**
 * Error taxonomy - user-friendly messages
 */
const ERROR_RESPONSES = {
  LLM_TIMEOUT: { status: 504, message: 'Response took too long. Please try again.' },
  RATE_LIMITED: { status: 429, message: 'Too many requests. Please wait a moment.' },
  INVALID_CONTEXT: { status: 400, message: 'Something went wrong. Please refresh and retry.' },
  MODEL_REFUSAL: { status: 422, message: "I can't help with that request." },
  INTERNAL_ERROR: { status: 500, message: 'An error occurred. Please try again.' },
};

/**
 * Classify errors into taxonomy
 */
function classifyError(error) {
  const message = error?.message?.toLowerCase() || '';
  
  if (message.includes('timeout') || message.includes('deadline')) {
    return 'LLM_TIMEOUT';
  }
  if (message.includes('rate') || message.includes('quota') || message.includes('429')) {
    return 'RATE_LIMITED';
  }
  if (message.includes('safety') || message.includes('blocked') || message.includes('refused')) {
    return 'MODEL_REFUSAL';
  }
  return 'INTERNAL_ERROR';
}

/**
 * In-memory feedback store (NON-DURABLE - for initial validation only)
 * DISCLAIMER: This data resets on server restart.
 */
const feedbackStore = new Map();
const unansweredQuestions = [];

/**
 * POST /api/chat - Non-streaming fallback endpoint
 */
router.post('/', async (req, res) => {
  const startTime = Date.now();
  const promptVersion = getCurrentVersion();
  
  try {
    const { message, sessionId, context: frontendContext, userId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required', type: 'INVALID_CONTEXT' });
    }

    // Validate context (server-derived permissions)
    const context = await validateContext(userId, frontendContext);

    // Build memory context
    const { recentMessages, summaryPrefix } = await buildContextWindow(sessionId || 'default', context);

    // Load system prompt
    const systemPrompt = loadPrompt(promptVersion);
    const fullPrompt = summaryPrefix ? `${systemPrompt}\n\n${summaryPrefix}` : systemPrompt;

    // Get LLM response
    const llm = getLLMProvider();
    const response = await llm.sendMessage(fullPrompt, recentMessages, message, context);

    // Store messages
    addMessage(sessionId || 'default', 'user', message);
    addMessage(sessionId || 'default', 'assistant', response.reply);

    // Log metrics
    logRequest({
      promptVersion,
      latencyMs: Date.now() - startTime,
      tokensUsed: response.tokensUsed,
    });

    res.json({
      reply: response.reply,
      responseId: response.responseId,
      suggestedActions: response.suggestedActions || [],
    });

  } catch (error) {
    const errorType = classifyError(error);
    const errorResponse = ERROR_RESPONSES[errorType];
    
    logRequest({
      promptVersion,
      latencyMs: Date.now() - startTime,
      error: errorType,
    });

    console.error('[CHAT_ERROR]', error);
    res.status(errorResponse.status).json({
      error: errorResponse.message,
      type: errorType,
      retryable: errorType !== 'MODEL_REFUSAL',
    });
  }
});

/**
 * POST /api/chat/stream - SSE streaming endpoint
 */
router.post('/stream', async (req, res) => {
  const startTime = Date.now();
  const promptVersion = getCurrentVersion();
  const responseId = crypto.randomUUID();

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const { message, sessionId, context: frontendContext, userId } = req.body;

    if (!message || typeof message !== 'string') {
      res.write(`data: ${JSON.stringify({ error: 'Message is required', type: 'INVALID_CONTEXT' })}\n\n`);
      res.end();
      return;
    }

    // Validate context
    const context = await validateContext(userId, frontendContext);

    // Build memory context
    const { recentMessages, summaryPrefix } = await buildContextWindow(sessionId || 'default', context);

    // Load system prompt
    const systemPrompt = loadPrompt(promptVersion);
    const fullPrompt = summaryPrefix ? `${systemPrompt}\n\n${summaryPrefix}` : systemPrompt;

    // Stream response
    const llm = getLLMProvider();
    let fullResponse = '';

    // Send responseId first
    res.write(`data: ${JSON.stringify({ responseId, type: 'start' })}\n\n`);

    for await (const chunk of llm.streamResponse(fullPrompt, recentMessages, message, context)) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk, type: 'chunk' })}\n\n`);
    }

    // Store messages
    addMessage(sessionId || 'default', 'user', message);
    addMessage(sessionId || 'default', 'assistant', fullResponse);

    // Send completion
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

    logRequest({
      promptVersion,
      latencyMs: Date.now() - startTime,
      tokensUsed: 0, // Token count not available in streaming
    });

  } catch (error) {
    const errorType = classifyError(error);
    const errorResponse = ERROR_RESPONSES[errorType];

    res.write(`data: ${JSON.stringify({ 
      error: errorResponse.message, 
      type: errorType,
      retryable: errorType !== 'MODEL_REFUSAL'
    })}\n\n`);
    res.end();

    logRequest({
      promptVersion,
      latencyMs: Date.now() - startTime,
      error: errorType,
    });

    console.error('[CHAT_STREAM_ERROR]', error);
  }
});

/**
 * POST /api/chat/feedback - Submit feedback for a response
 * NOTE: In-memory only, resets on restart. For initial validation.
 */
router.post('/feedback', (req, res) => {
  const { responseId, rating, comment } = req.body;

  if (!responseId || !['up', 'down'].includes(rating)) {
    return res.status(400).json({ error: 'Invalid feedback payload' });
  }

  feedbackStore.set(responseId, {
    rating,
    comment: comment?.substring(0, 500) || null,
    timestamp: Date.now(),
  });

  // Track for improvement
  if (rating === 'down') {
    unansweredQuestions.push({ responseId, timestamp: Date.now() });
  }

  res.json({ success: true });
});

/**
 * DELETE /api/chat/session - Clear session memory
 */
router.delete('/session/:sessionId', (req, res) => {
  clearSession(req.params.sessionId);
  res.json({ success: true });
});

export default router;
