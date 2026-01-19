/**
 * Groq LLM Provider
 * Implements LLMInterface using Groq SDK (fast inference for Llama/Mixtral)
 */

import Groq from 'groq-sdk';
import LLMInterface from './llm.interface.js';
import crypto from 'crypto';

class GroqProvider extends LLMInterface {
  constructor() {
    super();
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    this.model = 'llama-3.3-70b-versatile'; // Fast and capable
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
   * Convert history to Groq/OpenAI format
   */
  _formatHistory(history) {
    return history.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));
  }

  async sendMessage(systemPrompt, history, userMessage, context) {
    const contextPrefix = this._buildContextPrefix(context);
    const fullSystemPrompt = `${systemPrompt}\n\n${contextPrefix}`;

    const messages = [
      { role: 'system', content: fullSystemPrompt },
      ...this._formatHistory(history),
      { role: 'user', content: userMessage }
    ];

    const startTime = Date.now();
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content || '';

    return {
      reply: text,
      responseId: crypto.randomUUID(),
      tokensUsed: response.usage?.total_tokens || 0,
      suggestedActions: this._extractSuggestions(text),
    };
  }

  async *streamResponse(systemPrompt, history, userMessage, context) {
    const contextPrefix = this._buildContextPrefix(context);
    const fullSystemPrompt = `${systemPrompt}\n\n${contextPrefix}`;

    const messages = [
      { role: 'system', content: fullSystemPrompt },
      ...this._formatHistory(history),
      { role: 'user', content: userMessage }
    ];

    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
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

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.5,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * Extract suggested actions from response
   */
  _extractSuggestions(text) {
    const suggestions = [];
    const actionPattern = /\[Action:\s*([^\]]+)\]/g;
    let match;
    while ((match = actionPattern.exec(text)) !== null) {
      suggestions.push(match[1].trim());
    }
    return suggestions.slice(0, 3);
  }
}

export default GroqProvider;
