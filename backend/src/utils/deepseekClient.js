import fetch from "node-fetch";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  console.warn("Warning: DEEPSEEK_API_KEY is not set. DeepSeek calls will fail.");
}

/**
 * Call DeepSeek API for LLM completions
 * Uses DeepSeek Chat model with 128K context window
 * Free tier available with generous limits
 */
async function callDeepSeek(prompt) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is missing from environment variables");
  }

  // Using DeepSeek Chat - fast and capable
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`DeepSeek API error: ${res.status} ${res.statusText} - ${text}`);
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

  if (!text) throw new Error("Empty DeepSeek response");
  return text;
}

export { callDeepSeek };
