import { callGemini } from "../utils/geminiClient.js";
import { executeWithGuards } from "../utils/executeWithGuards.js";
import { riskSchema } from "../utils/schema.js";
import { riskFallback } from "../utils/fallbacks.js";

export async function runRiskAssessmentAgent(
  requirements,
  techStack,
  taskPlan
) {
  return executeWithGuards({
    agentName: "riskAssessment",
    schema: riskSchema,
    fallback: riskFallback,
    runAgent: async () => {
      const prompt = `
You are a senior engineering lead.

Rules:
- Identify technical, timeline, and security risks.
- Severity must be Low, Medium, or High.
- Output ONLY valid JSON.

Requirements:
${JSON.stringify(requirements, null, 2)}

Tech Stack:
${JSON.stringify(techStack, null, 2)}

Execution Plan:
${JSON.stringify(taskPlan, null, 2)}

Output JSON:
{
  "risks": [
    {
      "risk": "",
      "severity": "",
      "mitigation": ""
    }
  ]
}
`;

      const raw = await callGemini(prompt);
      return JSON.parse(raw.replace(/```json|```/g, "").trim());
    }
  });
}
