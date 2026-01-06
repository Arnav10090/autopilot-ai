import { runRequirementAgent } from "./requirementAgent.js";
import { runTechStackAgent } from "./techStackAgent.js";
import { runTaskPlannerAgent } from "./taskPlannerAgent.js";
import { runRiskAssessmentAgent } from "./riskAssessmentAgent.js";

export async function runFullAnalysis(input) {
  const requirements = await runRequirementAgent(input);

  // If info is missing, stop early
  if (requirements.missing_information.length > 0) {
    return {
      status: "incomplete",
      requirements
    };
  }

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

  return {
    status: "completed",
    requirements,
    tech_stack: techStack,
    task_plan: taskPlan,
    risks
  };
}

//This file alone screams engineering maturity.