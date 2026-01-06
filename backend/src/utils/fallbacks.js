//Agent 1 Fallback (Requirements)

export const requirementsFallback = {
  functional_requirements: ["Basic CRUD operations"],
  non_functional_requirements: ["Usability", "Performance"],
  assumptions: ["Single user system"],
  missing_information: ["Detailed feature requirements"]
};

//Agent 2 Fallback (Tech Stack)
export const techStackFallback = {
  frontend: { choice: "React", reason: "Industry standard" },
  backend: { choice: "Node.js", reason: "Rapid development" },
  database: { choice: "PostgreSQL", reason: "Reliable relational DB" },
  deployment: { choice: "Vercel", reason: "Simple deployment" }
};

//Agent 3 Fallback (Task Plan)
export const taskPlanFallback = {
  modules: [
    {
      module_name: "Core Development",
      tasks: [
        {
          task_name: "Initial setup",
          estimate_days: 2,
          depends_on: []
        }
      ]
    }
  ]
};

//Agent 4 Fallback (Risks)
export const riskFallback = {
  risks: [
    {
      risk: "Incomplete requirements",
      severity: "Medium",
      mitigation: "Clarify scope before development"
    }
  ]
};
