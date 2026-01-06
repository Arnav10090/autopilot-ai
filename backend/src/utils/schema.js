//Define Schemas

export const requirementsSchema = {
  type: "object",
  required: [
    "functional_requirements",
    "non_functional_requirements",
    "assumptions",
    "missing_information"
  ],
  properties: {
    functional_requirements: { type: "array", items: { type: "string" } },
    non_functional_requirements: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    missing_information: { type: "array", items: { type: "string" } }
  }
};

export const techStackSchema = {
  type: "object",
  required: ["frontend", "backend", "database", "deployment"],
  properties: {
    frontend: { type: "object", required: ["choice", "reason"] },
    backend: { type: "object", required: ["choice", "reason"] },
    database: { type: "object", required: ["choice", "reason"] },
    deployment: { type: "object", required: ["choice", "reason"] }
  }
};

export const taskPlanSchema = {
  type: "object",
  required: ["modules"],
  properties: {
    modules: {
      type: "array",
      items: {
        type: "object",
        required: ["module_name", "tasks"],
        properties: {
          module_name: { type: "string" },
          tasks: {
            type: "array",
            items: {
              type: "object",
              required: ["task_name", "estimate_days", "depends_on"],
              properties: {
                task_name: { type: "string" },
                estimate_days: { type: "number" },
                depends_on: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  }
};

export const riskSchema = {
  type: "object",
  required: ["risks"],
  properties: {
    risks: {
      type: "array",
      items: {
        type: "object",
        required: ["risk", "severity", "mitigation"],
        properties: {
          risk: { type: "string" },
          severity: { enum: ["Low", "Medium", "High"] },
          mitigation: { type: "string" }
        }
      }
    }
  }
};
