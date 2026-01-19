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

//Agent 3 Fallback (Task Plan) - MORE COMPREHENSIVE
export const taskPlanFallback = {
  modules: [
    {
      module_name: "Project Setup",
      description: "Initial project setup and infrastructure",
      milestones: ["Repository initialized", "Dev environment ready"],
      module_total_estimate_days: 5,
      tasks: [
        {
          task_name: "Initialize Git repository with branching strategy",
          estimate_days: 1,
          effort_hours: 6,
          role: "Tech Lead",
          depends_on: [],
          priority: "High",
          acceptance_criteria: "Repository created with proper structure",
          start_day: 0,
          end_day: 1
        },
        {
          task_name: "Setup development environment",
          estimate_days: 2,
          effort_hours: 12,
          role: "DevOps Engineer",
          depends_on: ["Initialize Git repository with branching strategy"],
          priority: "High",
          acceptance_criteria: "All developers can run project locally",
          start_day: 1,
          end_day: 3
        },
        {
          task_name: "Configure CI/CD pipeline",
          estimate_days: 2,
          effort_hours: 14,
          role: "DevOps Engineer",
          depends_on: ["Setup development environment"],
          priority: "High",
          acceptance_criteria: "Automated builds and tests working",
          start_day: 3,
          end_day: 5
        }
      ]
    },
    {
      module_name: "Core Development",
      description: "Implementation of core features",
      milestones: ["Backend API ready", "Frontend components built"],
      module_total_estimate_days: 15,
      tasks: [
        {
          task_name: "Design and implement database schema",
          estimate_days: 3,
          effort_hours: 20,
          role: "Backend Engineer",
          depends_on: [],
          priority: "High",
          acceptance_criteria: "Database schema implemented with migrations",
          start_day: 5,
          end_day: 8
        },
        {
          task_name: "Implement authentication system",
          estimate_days: 4,
          effort_hours: 28,
          role: "Backend Engineer",
          depends_on: ["Design and implement database schema"],
          priority: "High",
          acceptance_criteria: "User authentication working with JWT",
          start_day: 8,
          end_day: 12
        },
        {
          task_name: "Build core API endpoints",
          estimate_days: 5,
          effort_hours: 35,
          role: "Backend Engineer",
          depends_on: ["Implement authentication system"],
          priority: "High",
          acceptance_criteria: "All CRUD operations functional",
          start_day: 12,
          end_day: 17
        },
        {
          task_name: "Create UI component library",
          estimate_days: 3,
          effort_hours: 20,
          role: "Frontend Engineer",
          depends_on: [],
          priority: "High",
          acceptance_criteria: "Reusable components documented",
          start_day: 5,
          end_day: 8
        }
      ]
    }
  ],
  overall_total_days: 20
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
