import { callGroq } from "./groqClient.js";

/**
 * Main AI client export used by all agents
 * Now uses Groq API (Llama 3.3 70B) for fast, free AI responses
 * 
 * Groq features:
 * - 14,400 free requests/day
 * - 128K context window
 * - Extremely fast inference
 */
export async function callGemini(prompt) {
  return callGroq(prompt);
}
