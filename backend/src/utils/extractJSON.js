/**
 * Robustly extract a JSON object from a raw LLM response string.
 * Handles markdown fences, trailing text, and partial output.
 */
export function extractJSON(raw) {
  // Step 1: Strip markdown code fences
  let cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

  // Step 2: Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  // Step 3: Find the first '{' and use brace-matching to extract the JSON object
  const start = cleaned.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in response");

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        return JSON.parse(cleaned.substring(start, i + 1));
      }
    }
  }

  // If brace-matching didn't find a complete object, try parsing from start anyway
  throw new Error("Incomplete JSON object in response");
}
