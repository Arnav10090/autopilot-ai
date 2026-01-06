import { callGemini } from "../utils/geminiClient.js";
import { executeWithGuards } from "../utils/executeWithGuards.js";
import { techStackSchema } from "../utils/schema.js";
import { techStackFallback } from "../utils/fallbacks.js";

export async function runTechStackAgent(requirements, input) {
  return executeWithGuards({
    agentName: "techStack",
    schema: techStackSchema,
    fallback: techStackFallback,
    runAgent: async () => {
      const prompt = `
You are a senior software architect.

Rules:
- Recommend practical, production-ready technologies.
- Justify each choice briefly.
- Output ONLY valid JSON.

Requirements:
${JSON.stringify(requirements, null, 2)}

Constraints:
Team Size: ${input.team_size}
Deadline: ${input.deadline}
Skill Level: ${input.skill_level}

Output JSON:
{
  "frontend": { "choice": "", "reason": "" },
  "backend": { "choice": "", "reason": "" },
  "database": { "choice": "", "reason": "" },
  "deployment": { "choice": "", "reason": "" }
}
`;

      const raw = await callGemini(prompt);
      return JSON.parse(raw.replace(/```json|```/g, "").trim());
    }
  });
}
