import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";

const OPENROUTER_KEY = process.env.OPENROUTER_KEY || process.env.OPENROUTER_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

function looksLikeOpenRouterKey(key) {
  return typeof key === "string" && key.startsWith("sk-or-");
}

const useOpenRouter = !!OPENROUTER_KEY || looksLikeOpenRouterKey(GEMINI_KEY);

let googleClient;
if (!useOpenRouter) {
  if (!GEMINI_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  googleClient = new GoogleGenerativeAI(GEMINI_KEY);
}

async function callOpenRouter(prompt) {
  const key = OPENROUTER_KEY || GEMINI_KEY;
  const model = process.env.OPENROUTER_MODEL || "gpt-4o-mini";

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`OpenRouter error: ${res.status} ${res.statusText} - ${text}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();

  let text = "";
  if (data.choices && data.choices[0]) {
    const message = data.choices[0].message;
    if (typeof message === "string") text = message;
    else if (message?.content) text = message.content;
    else if (message?.content?.parts) text = message.content.parts.join("");
  } else if (data.output?.[0]?.content?.[0]?.text) {
    text = data.output[0].content[0].text;
  }

  if (!text) throw new Error("Empty OpenRouter response");
  return text;
}

async function callGoogleGemini(prompt) {
  const model = googleClient.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  if (!text) throw new Error("Empty Gemini response");
  return text;
}

export async function callGemini(prompt) {
  if (useOpenRouter) {
    try {
      return await callOpenRouter(prompt);
    } catch (err) {
      // Detect network/DNS/TCP errors and HTTP 5xx as transient
      const isNetworkError = err?.code === "ENOTFOUND" || err?.code === "ECONNREFUSED" ||
        (err?.message && err.message.includes("getaddrinfo")) || err?.status === 0 || (err?.status && err.status >= 500);
      console.warn("OpenRouter call failed:", err?.message || err, "; networkError=", !!isNetworkError);
      if (!isNetworkError) throw err;
      if (!googleClient) throw err;
      console.warn("Falling back to Google Gemini client due to OpenRouter network error.");
      return callGoogleGemini(prompt);
    }
  }
  return callGoogleGemini(prompt);
}
