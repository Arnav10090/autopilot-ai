export interface CreateProjectPayload {
  project_description: string;
  team_size: number;
  deadline: string;
  skill_level: string;
  constraints?: string;
}

export interface ProjectResult {
  project_id: string;
  status: "completed" | "incomplete";
  requirements: {
    functional_requirements: string[];
    non_functional_requirements: string[];
    assumptions: string[];
    missing_information: string[];
  };
  tech_stack?: {
    frontend: { choice: string; reason: string };
    backend: { choice: string; reason: string };
    database: { choice: string; reason: string };
    deployment: { choice: string; reason: string };
  };
  task_plan?: {
    modules: {
      module_name: string;
      tasks: {
        task_name: string;
        estimate_days: number;
        depends_on: string[];
      }[];
    }[];
  };
  risks?: {
    risks: {
      risk: string;
      severity: "Low" | "Medium" | "High";
      mitigation: string;
    }[];
  };
}

