import fetch from "node-fetch";

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;

if (!GROQ_API_KEY) {
  console.warn("Warning: GROQ_API_KEY (or GROK_API_KEY) is not set. Groq calls will fail.");
}

/**
 * Sleep helper for rate limit handling
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call Groq API for LLM completions
 * Uses Llama 3.3 70B model with 128K context window
 * Free tier: 14,400 requests/day
 * Includes automatic rate limit handling with retry
 */
async function callGroq(prompt, retryCount = 0) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY (or GROK_API_KEY) is missing from environment variables");
  }

  const MAX_RETRIES = 3;
  // Using Llama 3.1 8B - much faster and higher rate limits
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  // Handle rate limits with automatic retry
  if (res.status === 429 && retryCount < MAX_RETRIES) {
    const retryAfter = parseRetryAfter(await res.text());
    const waitTime = retryAfter ? (retryAfter * 1000) + 500 : 30000; // Add 500ms buffer
    console.log(`Rate limited. Waiting ${(waitTime/1000).toFixed(1)}s before retry ${retryCount + 1}/${MAX_RETRIES}...`);
    await sleep(waitTime);
    return callGroq(prompt, retryCount + 1);
  }

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Groq API error: ${res.status} ${res.statusText} - ${text}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();

  let text = "";
  if (data.choices && data.choices[0]) {
    const message = data.choices[0].message;
    if (typeof message === "string") text = message;
    else if (message?.content) text = message.content;
  }

  if (!text) throw new Error("Empty Groq response");
  return text;
}

/**
 * Parse retry-after time from Groq error message
 */
function parseRetryAfter(errorText) {
  try {
    const match = errorText.match(/try again in ([\d.]+)s/i);
    if (match) return parseFloat(match[1]);
  } catch (e) {}
  return null;
}

export { callGroq };
