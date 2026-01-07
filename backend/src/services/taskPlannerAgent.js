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
      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const prompt = `
You are an experienced technical project manager responsible for producing a detailed execution plan.

Rules:
- Break the work into clear modules and tasks.
- For each module include a short description and a list of milestones.
- For each task include: task_name, estimate_days (integer), effort_hours (approx), role (e.g., Frontend Engineer), depends_on (array of task_name strings), priority (High/Medium/Low), and acceptance_criteria (short sentence).
- Provide start_day and end_day offsets relative to project start (e.g., day 0, day 3).
- Compute module_total_estimate_days for each module and overall_total_days.
- Output ONLY valid JSON. Do NOT include extra commentary.

Requirements:
${JSON.stringify(requirements, null, 2)}

Tech Stack:
${JSON.stringify(techStack, null, 2)}

Deadline:
${deadline}

Guidance:
- Provide at least 3 modules (common modules: Frontend, Backend, Database, Deployment, QA, Documentation). If a module is not applicable, still include it with an explanatory milestone.
- Provide at least 3 tasks per module where possible.
- Keep tasks actionable and specific (e.g., "Implement project creation API" not just "Backend work").

Output JSON schema example:
{
  "modules": [
    {
      "module_name": "Frontend Development",
      "description": "",
      "milestones": [""],
      "module_total_estimate_days": 0,
      "tasks": [
        {
          "task_name": "",
          "estimate_days": 0,
          "effort_hours": 0,
          "role": "",
          "depends_on": [],
          "priority": "",
          "acceptance_criteria": "",
          "start_day": 0,
          "end_day": 0
        }
      ]
    }
  ],
  "overall_total_days": 0
}

Attempt: ${attempt} of ${maxAttempts}
`;

        const raw = await callGemini(prompt);

        let parsed;
        try {
          parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        } catch (err) {
          if (attempt === maxAttempts) throw err;
          continue;
        }

        const modules = parsed.modules || [];
        // basic validation: at least 3 modules and each with at least 2 tasks
        const modulesOk = modules.length >= 3 && modules.every(m => Array.isArray(m.tasks) && m.tasks.length >= 2);
        const tasksHaveFields = modules.every(m => m.tasks.every(t => t.task_name && typeof t.estimate_days === 'number' && t.role && t.acceptance_criteria));

        if (modulesOk && tasksHaveFields) {
          return parsed;
        }

        // If we've used all attempts and the model didn't produce sufficient detail,
        // fall back to a deterministic plan generator so the user always receives
        // a detailed execution plan.
        if (attempt === maxAttempts) {
          // deterministic generator
          function generateDeterministicPlan(requirements, techStack, deadline) {
            const modules = [];
            const todayStart = 0;
            let cursorDay = todayStart;

            // Helper to create a task
            const makeTask = (name, days, hours, role, depends = [], priority = "Medium", criteria = "Complete and tested") => {
              const start_day = cursorDay;
              const end_day = cursorDay + days;
              cursorDay = end_day; // schedule sequentially by default
              return {
                task_name: name,
                estimate_days: days,
                effort_hours: hours,
                role,
                depends_on: depends,
                priority,
                acceptance_criteria: criteria,
                start_day,
                end_day
              };
            };

            // Core Development module
            cursorDay = todayStart;
            const coreTasks = [];
            coreTasks.push(makeTask("Initial setup", 1, 6, "DevOps/Engineer", [], "High", "Repo initialized, dependencies installed, environment running"));
            coreTasks.push(makeTask("Project scaffolding and routing", 2, 12, "Frontend Engineer", ["Initial setup"], "High", "Basic pages and navigation implemented and buildable"));
            coreTasks.push(makeTask("API scaffold and health endpoints", 2, 12, "Backend Engineer", ["Initial setup"], "High", "API responds to health and basic endpoints documented"));
            const coreModuleDays = coreTasks.reduce((s, t) => s + t.estimate_days, 0);
            modules.push({ module_name: "Core Development", description: "Bootstrapping and initial wiring for frontend and backend.", milestones: ["Repository setup","Basic routing","API health endpoints"], module_total_estimate_days: coreModuleDays, tasks: coreTasks });

            // Feature Implementation module (derived from requirements if present)
            const featureTasks = [];
            const reqs = requirements?.functional_requirements || [];
            if (reqs.length === 0) {
              // provide default feature tasks
              cursorDay = todayStart + coreModuleDays;
              featureTasks.push(makeTask("Implement core CRUD endpoints", 3, 18, "Backend Engineer", [], "High", "CRUD endpoints implemented and unit tested"));
              featureTasks.push(makeTask("Build primary UI flows", 4, 24, "Frontend Engineer", ["Implement core CRUD endpoints"], "High", "Main user flows are functional and tested"));
              featureTasks.push(makeTask("Integrate frontend with API", 2, 12, "Fullstack Engineer", ["Implement core CRUD endpoints","Build primary UI flows"], "High", "End-to-end flow works in staging"));
            } else {
              cursorDay = todayStart + coreModuleDays;
              // create one task per functional requirement
              for (let i = 0; i < Math.min(reqs.length, 6); i++) {
                const name = `Implement: ${reqs[i]}`;
                featureTasks.push(makeTask(name, 2, 12, i % 2 === 0 ? "Backend Engineer" : "Frontend Engineer", [], "High", `Acceptance: ${reqs[i]} implemented and tested`));
              }
            }
            const featureModuleDays = featureTasks.reduce((s, t) => s + t.estimate_days, 0);
            modules.push({ module_name: "Feature Implementation", description: "Implement core product features derived from requirements.", milestones: ["Feature Completion","Integration Testing"], module_total_estimate_days: featureModuleDays, tasks: featureTasks });

            // Database & Infra module
            cursorDay = todayStart + coreModuleDays + featureModuleDays;
            const infraTasks = [];
            infraTasks.push(makeTask("Design database schema", 2, 12, "Backend Engineer", [], "Medium", "Schema reviewed and migration scripts prepared"));
            infraTasks.push(makeTask("Setup CI/CD and staging environment", 3, 18, "DevOps Engineer", ["Initial setup"], "High", "Automated deploys to staging and production pipeline configured"));
            const infraDays = infraTasks.reduce((s, t) => s + t.estimate_days, 0);
            modules.push({ module_name: "Database & Infrastructure", description: "DB design, migrations, and deployment pipelines.", milestones: ["Schema design","CI/CD configured"], module_total_estimate_days: infraDays, tasks: infraTasks });

            // QA & Documentation
            cursorDay = todayStart + coreModuleDays + featureModuleDays + infraDays;
            const qaTasks = [];
            qaTasks.push(makeTask("Write unit and integration tests", 3, 18, "QA Engineer", [], "High", "Coverage for core flows >= 70% and integration tests pass"));
            qaTasks.push(makeTask("Prepare user documentation and README", 2, 8, "Technical Writer", [], "Medium", "Documentation for setup and primary workflows"));
            const qaDays = qaTasks.reduce((s, t) => s + t.estimate_days, 0);
            modules.push({ module_name: "QA & Docs", description: "Testing and documentation to ensure quality and handover.", milestones: ["Test suite","Docs ready"], module_total_estimate_days: qaDays, tasks: qaTasks });

            const overall_total_days = modules.reduce((s, m) => s + (m.module_total_estimate_days || 0), 0);

            return { modules, overall_total_days };
          }

          return generateDeterministicPlan(requirements, techStack, deadline);
        }
      }
    }
  });
}
