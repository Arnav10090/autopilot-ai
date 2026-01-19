/**
 * LLM Interface - Abstract contract for all LLM providers
 * All providers must implement these methods to ensure swappability.
 */

/**
 * @typedef {Object} LLMMessage
 * @property {'user' | 'assistant' | 'system'} role
 * @property {string} content
 */

/**
 * @typedef {Object} LLMContext
 * @property {string} page - Current page/route
 * @property {string} userRole - Server-validated user role
 * @property {string} module - Feature/module identifier
 * @property {string[]} permissions - Server-derived permissions
 * @property {string} accountTier - Server-validated account tier
 * @property {string[]} recentActions - Sanitized recent actions
 */

/**
 * @typedef {Object} LLMResponse
 * @property {string} reply - The assistant's response
 * @property {string} responseId - Unique ID for feedback tracking
 * @property {number} tokensUsed - Token count for logging
 * @property {string[]} [suggestedActions] - Optional quick reply suggestions
 */

/**
 * LLM Provider Interface
 * @interface
 */
class LLMInterface {
  /**
   * Send a message and get a complete response
   * @param {string} systemPrompt - The system prompt
   * @param {LLMMessage[]} history - Conversation history
   * @param {string} userMessage - Current user message
   * @param {LLMContext} context - Validated context
   * @returns {Promise<LLMResponse>}
   */
  async sendMessage(systemPrompt, history, userMessage, context) {
    throw new Error('sendMessage must be implemented by provider');
  }

  /**
   * Stream a response chunk by chunk
   * @param {string} systemPrompt - The system prompt
   * @param {LLMMessage[]} history - Conversation history
   * @param {string} userMessage - Current user message
   * @param {LLMContext} context - Validated context
   * @returns {AsyncGenerator<string>} - Yields response chunks
   */
  async *streamResponse(systemPrompt, history, userMessage, context) {
    throw new Error('streamResponse must be implemented by provider');
  }

  /**
   * Generate a conversation summary
   * @param {LLMMessage[]} messages - Messages to summarize
   * @returns {Promise<string>} - Summary text
   */
  async summarize(messages) {
    throw new Error('summarize must be implemented by provider');
  }
}

export default LLMInterface;
