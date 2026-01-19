/**
 * Memory Manager
 * Handles conversation memory with rolling window and summarization.
 * Summaries are NON-AUTHORITATIVE hints, discarded on context change.
 */

import { getLLMProvider } from './llm/llm.factory.js';

const MAX_RECENT_MESSAGES = 8;

/**
 * Session memory store (in-memory, non-durable)
 * Key: sessionId, Value: { messages: [], summary: string, lastContext: { page, module } }
 */
const memoryStore = new Map();

/**
 * Get or create session memory
 */
function getSession(sessionId) {
  if (!memoryStore.has(sessionId)) {
    memoryStore.set(sessionId, {
      messages: [],
      summary: null,
      lastContext: { page: null, module: null },
    });
  }
  return memoryStore.get(sessionId);
}

/**
 * Check if context has changed significantly
 */
function hasContextChanged(session, currentContext) {
  const { lastContext } = session;
  return (
    lastContext.page !== currentContext.page ||
    lastContext.module !== currentContext.module
  );
}

/**
 * Build context window for LLM call
 * @param {string} sessionId - Session identifier
 * @param {Object} context - Current validated context
 * @returns {Promise<{ recentMessages: Array, summaryPrefix: string }>}
 */
export async function buildContextWindow(sessionId, context) {
  const session = getSession(sessionId);

  // Invalidate summary if context changed
  if (hasContextChanged(session, context)) {
    session.summary = null;
    session.lastContext = { page: context.page, module: context.module };
  }

  const { messages, summary } = session;

  // If we have more than MAX_RECENT_MESSAGES and no summary, generate one
  if (messages.length > MAX_RECENT_MESSAGES && !summary) {
    try {
      const llm = getLLMProvider();
      const oldMessages = messages.slice(0, messages.length - MAX_RECENT_MESSAGES);
      session.summary = await llm.summarize(oldMessages);
    } catch (e) {
      console.warn('Failed to generate summary:', e.message);
    }
  }

  // Return recent messages and summary prefix
  const recentMessages = messages.slice(-MAX_RECENT_MESSAGES);
  const summaryPrefix = session.summary
    ? `[Previous conversation summary (hint only, not factual): ${session.summary}]`
    : '';

  return { recentMessages, summaryPrefix };
}

/**
 * Add message to session history
 */
export function addMessage(sessionId, role, content) {
  const session = getSession(sessionId);
  session.messages.push({ role, content, timestamp: Date.now() });
}

/**
 * Clear session memory
 */
export function clearSession(sessionId) {
  memoryStore.delete(sessionId);
}

/**
 * Get session stats (for debugging)
 */
export function getSessionStats(sessionId) {
  const session = memoryStore.get(sessionId);
  if (!session) return null;
  return {
    messageCount: session.messages.length,
    hasSummary: !!session.summary,
    lastContext: session.lastContext,
  };
}

export default {
  buildContextWindow,
  addMessage,
  clearSession,
  getSessionStats,
};
