/**
 * Gemini LLM Provider
 * Implements LLMInterface using Google's Generative AI SDK
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import LLMInterface from './llm.interface.js';
import crypto from 'crypto';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

class GeminiProvider extends LLMInterface {
  constructor() {
    super();
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Build context string for injection into prompt
   */
  _buildContextPrefix(context) {
    return `
[CURRENT CONTEXT]
- Page: ${context.page}
- User Role: ${context.userRole}
- Module: ${context.module}
- Permissions: ${context.permissions.join(', ') || 'none'}
- Account Tier: ${context.accountTier}
- Recent Actions: ${context.recentActions.join(', ') || 'none'}
[END CONTEXT]
`.trim();
  }

  /**
   * Convert history to Gemini format
   */
  _formatHistory(history) {
    return history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
  }

  async sendMessage(systemPrompt, history, userMessage, context) {
    const contextPrefix = this._buildContextPrefix(context);
    const fullSystemPrompt = `${systemPrompt}\n\n${contextPrefix}`;

    const chat = this.model.startChat({
      history: this._formatHistory(history),
      systemInstruction: fullSystemPrompt,
    });

    const startTime = Date.now();
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return {
      reply: text,
      responseId: crypto.randomUUID(),
      tokensUsed: response.usageMetadata?.totalTokenCount || 0,
      suggestedActions: this._extractSuggestions(text),
    };
  }

  async *streamResponse(systemPrompt, history, userMessage, context) {
    const contextPrefix = this._buildContextPrefix(context);
    const fullSystemPrompt = `${systemPrompt}\n\n${contextPrefix}`;

    const chat = this.model.startChat({
      history: this._formatHistory(history),
      systemInstruction: fullSystemPrompt,
    });

    const result = await chat.sendMessageStream(userMessage);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  }

  async summarize(messages) {
    const content = messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const prompt = `Summarize this conversation concisely in 2-3 sentences. Focus on the user's questions and key information discussed. Do not include assumptions about user intent:\n\n${content}`;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Extract suggested actions from response (if any)
   */
  _extractSuggestions(text) {
    // Look for patterns like [Action: text] or bullet points at end
    const suggestions = [];
    const actionPattern = /\[Action:\s*([^\]]+)\]/g;
    let match;
    while ((match = actionPattern.exec(text)) !== null) {
      suggestions.push(match[1].trim());
    }
    return suggestions.slice(0, 3);
  }
}

export default GeminiProvider;
