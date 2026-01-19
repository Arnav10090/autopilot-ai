import { runRequirementAgent } from "./requirementAgent.js";
import { runTechStackAgent } from "./techStackAgent.js";
import { runTaskPlannerAgent } from "./taskPlannerAgent.js";
import { runRiskAssessmentAgent } from "./riskAssessmentAgent.js";

export async function runFullAnalysis(input) {
  // Step 1: Run requirement agent first (needed by others)
  // Step 1: Run requirement agent first
  const requirements = await runRequirementAgent(input);
  await new Promise(r => setTimeout(r, 2000)); // Rate limit cooldown

  // Step 2: Run tech stack agent
  const techStack = await runTechStackAgent(requirements, input);
  await new Promise(r => setTimeout(r, 2000)); // Rate limit cooldown

  // Step 3: Run task planner
  const taskPlan = await runTaskPlannerAgent(
    requirements,
    techStack,
    input.deadline
  );
  await new Promise(r => setTimeout(r, 2000)); // Rate limit cooldown

  // Step 4: Run risk assessment
  const risks = await runRiskAssessmentAgent(
    requirements,
    techStack,
    taskPlan
  );

  // Status is 'Completed' because the AI generation finished successfully.
  // Missing info labels can still be shown in the UI, but the project generation itself is complete.
  const status = "Completed";

  return {
    status,
    requirements,
    tech_stack: techStack,
    task_plan: taskPlan,
    risks
  };
}