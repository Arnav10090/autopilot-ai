/**
 * Prompt Manager
 * Handles versioned system prompts and request logging.
 * Prompts are stored in separate files, never inline in routes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, '../prompts');

// Prompt cache
const promptCache = new Map();

/**
 * Load a versioned system prompt
 * @param {string} version - e.g., 'v1'
 * @returns {string} - The system prompt text
 */
export function loadPrompt(version = 'v1') {
  const cacheKey = version;
  if (promptCache.has(cacheKey)) {
    return promptCache.get(cacheKey);
  }

  const filePath = path.join(PROMPTS_DIR, `${version}.system.txt`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt version ${version} not found at ${filePath}`);
  }

  const prompt = fs.readFileSync(filePath, 'utf-8');
  promptCache.set(cacheKey, prompt);
  return prompt;
}

/**
 * Get current prompt version
 */
export function getCurrentVersion() {
  return process.env.PROMPT_VERSION || 'v1';
}

/**
 * Log request metrics
 */
export function logRequest({ promptVersion, model, latencyMs, tokensUsed, error }) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    promptVersion,
    model: model || process.env.LLM_PROVIDER || 'gemini',
    latencyMs,
    tokensUsed,
    error: error || null,
  };
  
  // For now, log to console. In production, send to logging service.
  console.log('[CHAT_METRICS]', JSON.stringify(logEntry));
}

export default {
  loadPrompt,
  getCurrentVersion,
  logRequest,
};
