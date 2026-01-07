import { runRequirementAgent } from "./requirementAgent.js";
import { runTechStackAgent } from "./techStackAgent.js";
import { runTaskPlannerAgent } from "./taskPlannerAgent.js";
import { runRiskAssessmentAgent } from "./riskAssessmentAgent.js";

export async function runFullAnalysis(input) {
  const requirements = await runRequirementAgent(input);

  // Always continue running the other agents even if requirements report missing information.
  // The final status will reflect whether there was missing information, but we still produce
  // tech stack, task plan, and risk outputs to give the user as much value as possible.
  const techStack = await runTechStackAgent(requirements, input);

  const taskPlan = await runTaskPlannerAgent(
    requirements,
    techStack,
    input.deadline
  );

  const risks = await runRiskAssessmentAgent(
    requirements,
    techStack,
    taskPlan
  );

  const status = (requirements?.missing_information && requirements.missing_information.length > 0) ? "incomplete" : "completed";

  return {
    status,
    requirements,
    tech_stack: techStack,
    task_plan: taskPlan,
    risks
  };
}

//This file alone screams engineering maturity.