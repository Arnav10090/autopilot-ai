import { callGemini } from "../utils/geminiClient.js";
import { executeWithGuards } from "../utils/executeWithGuards.js";
import { taskPlanSchema } from "../utils/schema.js";
import { taskPlanFallback } from "../utils/fallbacks.js";

export async function runTaskPlannerAgent(requirements, techStack, deadline) {
  return executeWithGuards({
    agentName: "taskPlanner",
    schema: taskPlanSchema,
    fallback: taskPlanFallback,
    runAgent: async () => {
      const prompt = `
You are a technical project manager.

Rules:
- Break work into modules and tasks.
- Each task must have estimate_days.
- Define dependencies clearly.
- Output ONLY valid JSON.

Requirements:
${JSON.stringify(requirements, null, 2)}

Tech Stack:
${JSON.stringify(techStack, null, 2)}

Deadline:
${deadline}

Output JSON:
{
  "modules": [
    {
      "module_name": "",
      "tasks": [
        {
          "task_name": "",
          "estimate_days": 0,
          "depends_on": []
        }
      ]
    }
  ]
}
`;

      const raw = await callGemini(prompt);
      return JSON.parse(raw.replace(/```json|```/g, "").trim());
    }
  });
}
