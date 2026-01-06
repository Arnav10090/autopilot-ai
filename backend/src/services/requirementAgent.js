import { callGemini } from "../utils/geminiClient.js";
import { executeWithGuards } from "../utils/executeWithGuards.js";
import { requirementsSchema } from "../utils/schema.js";
import { requirementsFallback } from "../utils/fallbacks.js";

export async function runRequirementAgent(input) {
  return executeWithGuards({
    agentName: "requirements",
    schema: requirementsSchema,
    fallback: requirementsFallback,
    runAgent: async () => {
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

Output JSON:
{
  "functional_requirements": [],
  "non_functional_requirements": [],
  "assumptions": [],
  "missing_information": []
}
`;

      const raw = await callGemini(prompt);
      return JSON.parse(raw.replace(/```json|```/g, "").trim());
    }
  });
}
