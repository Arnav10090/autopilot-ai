/**
 * LLM Factory
 * Returns the appropriate LLM provider based on environment configuration.
 * All routes must use this factory, never instantiate providers directly.
 */

import GeminiProvider from './gemini.provider.js';
import GroqProvider from './groq.provider.js';

const providers = {
  gemini: GeminiProvider,
  groq: GroqProvider,
  // Future providers:
  // openai: OpenAIProvider,
  // claude: ClaudeProvider,
};

let instance = null;

/**
 * Auto-detect which provider to use based on available API keys
 */
function detectProvider() {
  // Explicit override
  if (process.env.LLM_PROVIDER) {
    return process.env.LLM_PROVIDER;
  }
  // Auto-detect based on available keys
  if (process.env.GROQ_API_KEY) {
    return 'groq';
  }
  if (process.env.GEMINI_API_KEY) {
    return 'gemini';
  }
  return 'gemini'; // Default fallback
}

/**
 * Get LLM provider instance (singleton)
 * @returns {import('./llm.interface.js').default}
 */
export function getLLMProvider() {
  if (instance) return instance;

  const providerName = detectProvider();
  const Provider = providers[providerName];

  if (!Provider) {
    throw new Error(`Unknown LLM provider: ${providerName}. Available: ${Object.keys(providers).join(', ')}`);
  }

  console.log(`[LLM] Using provider: ${providerName}`);
  instance = new Provider();
  return instance;
}

/**
 * Reset provider instance (for testing)
 */
export function resetLLMProvider() {
  instance = null;
}
