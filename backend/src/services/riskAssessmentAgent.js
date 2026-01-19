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
You are a senior engineering lead performing a formal risk assessment for a real-world software project.

Your task is to identify potential risks that could negatively impact the successful delivery, security, scalability, or maintainability of the project.

// STRICT RULES:
// - Identify AT LEAST 3 distinct risks.
// - Risks MUST be concrete, realistic, and engineering-focused.
// - Cover key categories (Technical, Delivery, Security).
// - Output ONLY valid JSON.
//
// PROJECT CONTEXT:
// Requirements:
// ${JSON.stringify(requirements, null, 2)}
//
// Tech Stack:
// ${JSON.stringify(techStack, null, 2)}
//
// Execution Plan Summary (Modules):
// ${JSON.stringify(taskPlan.modules?.map(m => m.module_name) || [], null, 2)}

OUTPUT FORMAT (FOLLOW EXACTLY):

{
  "risks": [
    {
      "risk": "Clear description of a specific risk",
      "severity": "Low | Medium | High",
      "mitigation": "Concrete steps to reduce or eliminate the risk"
    }
  ]
}

QUALITY BAR:
- Imagine this risk assessment will be reviewed by a CTO.
- If a risk is severe, the mitigation must be equally strong.
- Avoid assumptions not supported by the provided context.
`;

      const raw = await callGemini(prompt);
      return JSON.parse(raw.replace(/```json|```/g, "").trim());
    }
  });
}
