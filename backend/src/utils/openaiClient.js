import fetch from "node-fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("Warning: OPENAI_API_KEY is not set. OpenAI calls will fail.");
}

/**
 * Call OpenAI API for LLM completions
 * Uses GPT-4o-mini by default (fast and affordable)
 */
async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing from environment variables");
  }

  // Using GPT-4o-mini - fast, capable, and cost-effective
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
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
    const err = new Error(`OpenAI API error: ${res.status} ${res.statusText} - ${text}`);
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

  if (!text) throw new Error("Empty OpenAI response");
  return text;
}

export { callOpenAI };
