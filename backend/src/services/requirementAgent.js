import { callGemini } from "../utils/geminiClient.js";
import { executeWithGuards } from "../utils/executeWithGuards.js";
import { requirementsSchema } from "../utils/schema.js";
import { requirementsFallback } from "../utils/fallbacks.js";

export async function runRequirementAgent(input) {
  return executeWithGuards({
    agentName: "requirements",
    schema: requirementsSchema,
    fallback: requirementsFallback,
    timeoutMs: 45000,
    runAgent: async () => {
      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const prompt = `
You are a senior software requirements analyst.

Rules:
- Do NOT suggest solutions.
- Do NOT add explanations.
- Output ONLY valid JSON.

Project Description:
${input.project_description}

Constraints:
Team Size: ${input.team_size}
Deadline: ${input.deadline}
Skill Level: ${input.skill_level}
Other Constraints: ${input.constraints}

Instruction:
Provide at least 5 functional requirements, 5 non-functional requirements, and 5 assumptions. If you cannot determine an item, list a short note in "missing_information" explaining what's missing.

Example format:
{
  "functional_requirements": ["User can create a project","..."],
  "non_functional_requirements": ["Response time < 2s","..."],
  "assumptions": ["Single admin user","..."],
  "missing_information": []
}

Attempt: ${attempt} of ${maxAttempts}
`;

        const raw = await callGemini(prompt);

        let parsed;
        try {
          parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        } catch (err) {
          // if last attempt, rethrow so executeWithGuards will fallback
          if (attempt === maxAttempts) throw err;
          continue;
        }

        const functional = parsed.functional_requirements || [];
        const nonFunctional = parsed.non_functional_requirements || [];
        const assumptions = parsed.assumptions || [];

        if (functional.length >= 5 && nonFunctional.length >= 5 && assumptions.length >= 5) {
          return parsed;
        }

        // otherwise retry with a stronger prompt on next loop
        if (attempt === maxAttempts) {
          throw new Error("Insufficient items in agent output after retries");
        }
      }
    }
  });
}
