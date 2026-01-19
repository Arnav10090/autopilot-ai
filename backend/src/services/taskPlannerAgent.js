import { callGemini } from "../utils/geminiClient.js";
import { executeWithGuards } from "../utils/executeWithGuards.js";
import { taskPlanSchema } from "../utils/schema.js";
import { taskPlanFallback } from "../utils/fallbacks.js";

export async function runTaskPlannerAgent(requirements, techStack, deadline) {
  return executeWithGuards({
    agentName: "taskPlanner",
    schema: taskPlanSchema,
    fallback: taskPlanFallback,
    maxRetries: 3,
    timeoutMs: 90000,
    runAgent: async () => {
      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const prompt = `
You are an experienced technical project manager responsible for producing a comprehensive, detailed execution plan.

Rules:
- Break the work into 3 clear modules: Setup, Core Features, Deployment
- Each module MUST have at least 3 detailed tasks
- For each task include: task_name, estimate_days, effort_hours, role, depends_on, priority, acceptance_criteria
- Provide start_day and end_day offsets
- Compute module_total_estimate_days
- Output ONLY valid JSON

Requirements:
${JSON.stringify(requirements, null, 2)}

Tech Stack:
${JSON.stringify(techStack, null, 2)}

Deadline:
${deadline}

IMPORTANT REQUIREMENTS:
1. Minimum 3 modules
2. Minimum 3 tasks per module (Total ~10-15 tasks)
3. Focus ONLY on critical path tasks

Output JSON schema:
{
  "modules": [
    {
      "module_name": "Project Setup & Infrastructure",
      "description": "Initial project configuration and infrastructure setup",
      "milestones": ["Repository initialized", "CI/CD pipeline configured"],
      "module_total_estimate_days": 5,
      "tasks": [
        {
          "task_name": "Initialize Git repository and project structure",
          "estimate_days": 1,
          "effort_hours": 6,
          "role": "Tech Lead",
          "depends_on": [],
          "priority": "High",
          "acceptance_criteria": "Repository created with proper folder structure and README",
          "start_day": 0,
          "end_day": 1
        },
        {
          "task_name": "Setup development environment configuration",
          "estimate_days": 1,
          "effort_hours": 8,
          "role": "DevOps Engineer",
          "depends_on": ["Initialize Git repository and project structure"],
          "priority": "High",
          "acceptance_criteria": "Development environment runs on all team machines",
          "start_day": 1,
          "end_day": 2
        }
      ]
    }
  ],
  "overall_total_days": 30
}

Generate a DETAILED execution plan with at least 35-50 total tasks across all modules.
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

        // Validate we have sufficient detail
        const totalTasks = modules.reduce(
          (sum, m) => sum + (m.tasks?.length || 0),
          0
        );
        const modulesOk = modules.length >= 5;
        const tasksOk =
          totalTasks >= 35 && modules.every((m) => m.tasks?.length >= 5);
        const tasksHaveDetails = modules.every((m) =>
          m.tasks.every(
            (t) =>
              t.task_name &&
              typeof t.estimate_days === "number" &&
              t.role &&
              t.acceptance_criteria &&
              t.task_name.length > 20 // Ensure task names are descriptive
          )
        );

        if (modulesOk && tasksOk && tasksHaveDetails) {
          return parsed;
        }

        // If not enough detail, continue to next attempt
        if (attempt === maxAttempts) {
          // Use comprehensive deterministic fallback
          return generateComprehensiveExecutionPlan(
            requirements,
            techStack,
            deadline
          );
        }
      }
    },
  });
}

function generateComprehensiveExecutionPlan(requirements, techStack, deadline) {
  const modules = [];
  let cursorDay = 0;

  // Helper to create a task
  const makeTask = (
    name,
    days,
    hours,
    role,
    depends = [],
    priority = "Medium",
    criteria = "Complete and tested"
  ) => {
    const start_day = cursorDay;
    const end_day = cursorDay + days;
    cursorDay = end_day;
    return {
      task_name: name,
      estimate_days: days,
      effort_hours: hours,
      role,
      depends_on: depends,
      priority,
      acceptance_criteria: criteria,
      start_day,
      end_day,
    };
  };

  // Module 1: Project Setup & Infrastructure
  cursorDay = 0;
  const setupTasks = [];
  setupTasks.push(
    makeTask(
      "Initialize Git repository with proper branching strategy",
      1,
      4,
      "Tech Lead",
      [],
      "High",
      "Repository created with main, dev, and feature branch structure"
    )
  );
  setupTasks.push(
    makeTask(
      "Setup development environment with Docker containers",
      2,
      12,
      "DevOps Engineer",
      ["Initialize Git repository with proper branching strategy"],
      "High",
      "All developers can run project locally with docker-compose"
    )
  );
  setupTasks.push(
    makeTask(
      "Configure ESLint, Prettier, and code quality tools",
      1,
      6,
      "Senior Developer",
      ["Setup development environment with Docker containers"],
      "High",
      "Code quality tools integrated with pre-commit hooks"
    )
  );
  setupTasks.push(
    makeTask(
      "Setup CI/CD pipeline with automated testing",
      2,
      14,
      "DevOps Engineer",
      ["Configure ESLint, Prettier, and code quality tools"],
      "High",
      "Automated builds and tests run on every PR"
    )
  );
  setupTasks.push(
    makeTask(
      "Configure environment variables and secrets management",
      1,
      6,
      "DevOps Engineer",
      ["Setup CI/CD pipeline with automated testing"],
      "High",
      "Secure secrets management implemented for all environments"
    )
  );
  setupTasks.push(
    makeTask(
      "Setup logging and monitoring infrastructure",
      2,
      12,
      "DevOps Engineer",
      ["Setup CI/CD pipeline with automated testing"],
      "Medium",
      "Centralized logging and basic monitoring dashboards configured"
    )
  );
  setupTasks.push(
    makeTask(
      "Create project documentation structure and guidelines",
      1,
      6,
      "Technical Writer",
      [],
      "Medium",
      "Documentation structure created with contribution guidelines"
    )
  );

  modules.push({
    module_name: "Project Setup & Infrastructure",
    description:
      "Foundation setup including repository, development environment, CI/CD, and monitoring",
    milestones: [
      "Repository initialized",
      "Dev environment running",
      "CI/CD pipeline active",
    ],
    module_total_estimate_days: setupTasks.reduce(
      (s, t) => s + t.estimate_days,
      0
    ),
    tasks: setupTasks,
  });

  // Module 2: Database & Backend Architecture
  cursorDay += 2; // Small buffer
  const backendArchTasks = [];
  backendArchTasks.push(
    makeTask(
      "Design database schema with ER diagrams",
      2,
      14,
      "Database Architect",
      [],
      "High",
      "Complete ERdiagrams and schema documentation created"
    )
  );
  backendArchTasks.push(
    makeTask(
      "Setup database with migrations framework",
      2,
      12,
      "Backend Engineer",
      ["Design database schema with ER diagrams"],
      "High",
      "Database running with migration system configured"
    )
  );
  backendArchTasks.push(
    makeTask(
      "Implement database connection pooling and optimization",
      1,
      8,
      "Backend Engineer",
      ["Setup database with migrations framework"],
      "Medium",
      "Connection pooling configured with performance benchmarks"
    )
  );
  backendArchTasks.push(
    makeTask(
      "Create base API structure with routing framework",
      2,
      14,
      "Backend Engineer",
      ["Setup database with migrations framework"],
      "High",
      "API framework setup with health check endpoints"
    )
  );
  backendArchTasks.push(
    makeTask(
      "Implement authentication and authorization middleware",
      3,
      20,
      "Backend Engineer",
      ["Create base API structure with routing framework"],
      "High",
      "JWT-based auth working with role-based access control"
    )
  );
  backendArchTasks.push(
    makeTask(
      "Setup API documentation with OpenAPI/Swagger",
      1,
      8,
      "Backend Engineer",
      ["Create base API structure with routing framework"],
      "Medium",
      "Auto-generated API documentation accessible"
    )
  );
  backendArchTasks.push(
    makeTask(
      "Implement request validation and error handling",
      2,
      12,
      "Backend Engineer",
      ["Implement authentication and authorization middleware"],
      "High",
      "Comprehensive validation and standardized error responses"
    )
  );
  backendArchTasks.push(
    makeTask(
      "Setup database backup and recovery procedures",
      1,
      6,
      "DevOps Engineer",
      ["Setup database with migrations framework"],
      "Medium",
      "Automated daily backups configured with tested recovery process"
    )
  );

  modules.push({
    module_name: "Database & Backend Architecture",
    description:
      "Database design, API foundation, authentication, and core backend infrastructure",
    milestones: [
      "Database schema finalized",
      "API framework operational",
      "Authentication implemented",
    ],
    module_total_estimate_days: backendArchTasks.reduce(
      (s, t) => s + t.estimate_days,
      0
    ),
    tasks: backendArchTasks,
  });

  // Module 3: Core Backend Features
  const reqs = requirements?.functional_requirements || [];
  const backendFeatureTasks = [];

  if (reqs.length > 0) {
    // Create specific tasks based on requirements
    reqs.slice(0, 8).forEach((req, i) => {
      const taskName = `Implement API endpoint: ${req.substring(0, 60)}`;
      const deps =
        i === 0
          ? ["Implement request validation and error handling"]
          : [`Implement API endpoint: ${reqs[i - 1].substring(0, 60)}`];
      backendFeatureTasks.push(
        makeTask(
          taskName,
          3,
          20,
          "Backend Engineer",
          deps,
          "High",
          `${req} - fully implemented with tests`
        )
      );
    });
  } else {
    // Default backend feature tasks
    backendFeatureTasks.push(
      makeTask(
        "Implement user management CRUD operations",
        3,
        20,
        "Backend Engineer",
        ["Implement request validation and error handling"],
        "High",
        "Complete user CRUD with validation and tests"
      )
    );
    backendFeatureTasks.push(
      makeTask(
        "Implement data filtering and pagination logic",
        2,
        14,
        "Backend Engineer",
        ["Implement user management CRUD operations"],
        "High",
        "Efficient pagination working for all list endpoints"
      )
    );
    backendFeatureTasks.push(
      makeTask(
        "Implement file upload and storage functionality",
        3,
        18,
        "Backend Engineer",
        ["Implement data filtering and pagination logic"],
        "Medium",
        "File uploads working with cloud storage integration"
      )
    );
    backendFeatureTasks.push(
      makeTask(
        "Implement search functionality with full-text search",
        3,
        20,
        "Backend Engineer",
        ["Implement data filtering and pagination logic"],
        "Medium",
        "Fast search across main entities with relevance ranking"
      )
    );
    backendFeatureTasks.push(
      makeTask(
        "Implement notification system (email/push)",
        3,
        18,
        "Backend Engineer",
        ["Implement user management CRUD operations"],
        "Medium",
        "Email and push notifications sending reliably"
      )
    );
    backendFeatureTasks.push(
      makeTask(
        "Implement caching layer with Redis",
        2,
        14,
        "Backend Engineer",
        ["Implement search functionality with full-text search"],
        "Medium",
        "Cache implemented for frequently accessed data"
      )
    );
    backendFeatureTasks.push(
      makeTask(
        "Implement rate limiting and API throttling",
        2,
        12,
        "Backend Engineer",
        ["Implement caching layer with Redis"],
        "High",
        "Rate limiting active on all public endpoints"
      )
    );
    backendFeatureTasks.push(
      makeTask(
        "Implement audit logging for sensitive operations",
        2,
        12,
        "Backend Engineer",
        ["Implement request validation and error handling"],
        "High",
        "All sensitive operations logged with audit trail"
      )
    );
  }

  modules.push({
    module_name: "Core Backend Features",
    description: "Implementation of core business logic and API endpoints",
    milestones: [
      "CRUD operations complete",
      "Business logic implemented",
      "Integration points ready",
    ],
    module_total_estimate_days: backendFeatureTasks.reduce(
      (s, t) => s + t.estimate_days,
      0
    ),
    tasks: backendFeatureTasks,
  });

  // Module 4: Frontend Development
  const frontendTasks = [];
  frontendTasks.push(
    makeTask(
      "Setup frontend framework with routing and state management",
      2,
      14,
      "Frontend Engineer",
      [],
      "High",
      "Frontend app running with routing and global state configured"
    )
  );
  frontendTasks.push(
    makeTask(
      "Create UI component library and design system",
      3,
      20,
      "Frontend Engineer",
      ["Setup frontend framework with routing and state management"],
      "High",
      "Reusable component library with documented patterns"
    )
  );
  frontendTasks.push(
    makeTask(
      "Implement authentication UI and flows",
      3,
      18,
      "Frontend Engineer",
      ["Create UI component library and design system"],
      "High",
      "Login, signup, password reset flows working"
    )
  );
  frontendTasks.push(
    makeTask(
      "Implement main dashboard and navigation",
      3,
      20,
      "Frontend Engineer",
      ["Implement authentication UI and flows"],
      "High",
      "Dashboard showing key metrics with working navigation"
    )
  );
  frontendTasks.push(
    makeTask(
      "Implement data listing pages with pagination",
      3,
      18,
      "Frontend Engineer",
      ["Implement main dashboard and navigation"],
      "High",
      "List views with sorting, filtering, and pagination"
    )
  );
  frontendTasks.push(
    makeTask(
      "Implement form components with validation",
      3,
      20,
      "Frontend Engineer",
      ["Implement data listing pages with pagination"],
      "High",
      "Forms with client-side validation and error handling"
    )
  );
  frontendTasks.push(
    makeTask(
      "Implement detail and edit views",
      3,
      18,
      "Frontend Engineer",
      ["Implement form components with validation"],
      "High",
      "CRUD operations working from UI"
    )
  );
  frontendTasks.push(
    makeTask(
      "Implement real-time updates with WebSocket",
      2,
      14,
      "Frontend Engineer",
      ["Implement main dashboard and navigation"],
      "Medium",
      "Live updates reflected in UI without refresh"
    )
  );
  frontendTasks.push(
    makeTask(
      "Implement responsive design for mobile devices",
      2,
      14,
      "Frontend Engineer",
      ["Create UI component library and design system"],
      "High",
      "App fully functional on mobile and tablet"
    )
  );
  frontendTasks.push(
    makeTask(
      "Implement loading states and error boundaries",
      2,
      12,
      "Frontend Engineer",
      ["Implement form components with validation"],
      "High",
      "Graceful loading and error handling throughout app"
    )
  );

  modules.push({
    module_name: "Frontend Development",
    description:
      "Complete user interface implementation with responsive design",
    milestones: [
      "Component library ready",
      "Core flows implemented",
      "Responsive design complete",
    ],
    module_total_estimate_days: frontendTasks.reduce(
      (s, t) => s + t.estimate_days,
      0
    ),
    tasks: frontendTasks,
  });

  // Module 5: Testing & Quality Assurance
  const testingTasks = [];
  testingTasks.push(
    makeTask(
      "Setup testing framework and test infrastructure",
      2,
      12,
      "QA Engineer",
      [],
      "High",
      "Testing framework configured with example tests"
    )
  );
  testingTasks.push(
    makeTask(
      "Write unit tests for backend business logic",
      3,
      24,
      "Backend Engineer",
      ["Setup testing framework and test infrastructure"],
      "High",
      "70%+ code coverage for backend"
    )
  );
  testingTasks.push(
    makeTask(
      "Write integration tests for API endpoints",
      3,
      24,
      "QA Engineer",
      ["Write unit tests for backend business logic"],
      "High",
      "All critical endpoints have integration tests"
    )
  );
  testingTasks.push(
    makeTask(
      "Write frontend component tests",
      3,
      20,
      "Frontend Engineer",
      ["Setup testing framework and test infrastructure"],
      "High",
      "Key components have unit tests"
    )
  );
  testingTasks.push(
    makeTask(
      "Write end-to-end tests for critical user flows",
      4,
      28,
      "QA Engineer",
      ["Write frontend component tests"],
      "High",
      "Main user journeys covered by E2E tests"
    )
  );
  testingTasks.push(
    makeTask(
      "Perform manual exploratory testing",
      3,
      24,
      "QA Engineer",
      ["Write end-to-end tests for critical user flows"],
      "High",
      "All features manually tested with bug reports filed"
    )
  );
  testingTasks.push(
    makeTask(
      "Perform security testing and vulnerability scan",
      2,
      14,
      "Security Engineer",
      ["Perform manual exploratory testing"],
      "High",
      "Security scan completed with critical issues resolved"
    )
  );
  testingTasks.push(
    makeTask(
      "Perform load testing and performance optimization",
      3,
      20,
      "DevOps Engineer",
      ["Perform security testing and vulnerability scan"],
      "Medium",
      "Load tests showing system handles expected traffic"
    )
  );

  modules.push({
    module_name: "Testing & Quality Assurance",
    description:
      "Comprehensive testing strategy including unit, integration, E2E, security, and performance testing",
    milestones: [
      "Test framework ready",
      "Critical paths tested",
      "Performance validated",
    ],
    module_total_estimate_days: testingTasks.reduce(
      (s, t) => s + t.estimate_days,
      0
    ),
    tasks: testingTasks,
  });

  // Module 6: Deployment & DevOps
  const deploymentTasks = [];
  deploymentTasks.push(
    makeTask(
      "Setup staging environment infrastructure",
      2,
      14,
      "DevOps Engineer",
      [],
      "High",
      "Staging environment running and accessible"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Setup production environment infrastructure",
      2,
      14,
      "DevOps Engineer",
      ["Setup staging environment infrastructure"],
      "High",
      "Production infrastructure provisioned"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Configure auto-scaling and load balancing",
      2,
      14,
      "DevOps Engineer",
      ["Setup production environment infrastructure"],
      "High",
      "Auto-scaling configured based on traffic"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Setup database replication and failover",
      2,
      14,
      "DevOps Engineer",
      ["Setup production environment infrastructure"],
      "High",
      "Database replication working with automatic failover"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Configure SSL certificates and domain setup",
      1,
      6,
      "DevOps Engineer",
      ["Setup production environment infrastructure"],
      "High",
      "HTTPS configured for all domains"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Deploy application to staging environment",
      1,
      8,
      "DevOps Engineer",
      ["Setup staging environment infrastructure"],
      "High",
      "App running in staging matching production config"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Perform staging environment testing",
      2,
      16,
      "QA Engineer",
      ["Deploy application to staging environment"],
      "High",
      "Full regression testing passed in staging"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Deploy application to production environment",
      1,
      8,
      "DevOps Engineer",
      ["Perform staging environment testing"],
      "High",
      "Production deployment successful"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Setup monitoring and alerting for production",
      2,
      12,
      "DevOps Engineer",
      ["Deploy application to production environment"],
      "High",
      "Monitoring dashboards and alerts configured"
    )
  );
  deploymentTasks.push(
    makeTask(
      "Create rollback and disaster recovery procedures",
      1,
      8,
      "DevOps Engineer",
      ["Deploy application to production environment"],
      "High",
      "Documented rollback procedures tested"
    )
  );

  modules.push({
    module_name: "Deployment & DevOps",
    description:
      "Production deployment with monitoring, scaling, and disaster recovery",
    milestones: ["Staging deployed", "Production live", "Monitoring active"],
    module_total_estimate_days: deploymentTasks.reduce(
      (s, t) => s + t.estimate_days,
      0
    ),
    tasks: deploymentTasks,
  });

  // Module 7: Documentation & Handoff
  const docTasks = [];
  docTasks.push(
    makeTask(
      "Write API documentation with examples",
      2,
      14,
      "Technical Writer",
      [],
      "Medium",
      "Complete API docs with request/response examples"
    )
  );
  docTasks.push(
    makeTask(
      "Write user guides and tutorials",
      3,
      20,
      "Technical Writer",
      ["Write API documentation with examples"],
      "Medium",
      "User documentation covering all major features"
    )
  );
  docTasks.push(
    makeTask(
      "Write deployment and operations manual",
      2,
      14,
      "DevOps Engineer",
      ["Write API documentation with examples"],
      "Medium",
      "Ops manual with deployment and troubleshooting guides"
    )
  );
  docTasks.push(
    makeTask(
      "Create architecture diagrams and documentation",
      2,
      12,
      "Tech Lead",
      [],
      "Medium",
      "System architecture documented with diagrams"
    )
  );
  docTasks.push(
    makeTask(
      "Conduct knowledge transfer sessions",
      2,
      16,
      "Tech Lead",
      ["Create architecture diagrams and documentation"],
      "Medium",
      "Team trained on system architecture and operations"
    )
  );
  docTasks.push(
    makeTask(
      "Prepare handoff materials and final demo",
      1,
      8,
      "Product Manager",
      ["Conduct knowledge transfer sessions"],
      "Low",
      "Complete handoff package delivered with demo"
    )
  );

  modules.push({
    module_name: "Documentation & Handoff",
    description:
      "Comprehensive documentation and knowledge transfer for operations and maintenance",
    milestones: ["Docs written", "Team trained", "Handoff complete"],
    module_total_estimate_days: docTasks.reduce(
      (s, t) => s + t.estimate_days,
      0
    ),
    tasks: docTasks,
  });

  const overall_total_days = modules.reduce(
    (s, m) => s + (m.module_total_estimate_days || 0),
    0
  );

  return { modules, overall_total_days };
}
