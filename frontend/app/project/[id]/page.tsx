import { getProjectById, getMetrics } from "@/services/api";
import { redirect } from "next/navigation";
import RequirementsView from "@/components/RequirementsView";
import TechStackView from "@/components/TechStackView";
import TaskPlanView from "@/components/TaskPlanView";
import RiskView from "@/components/RiskView";
import MetricsDashboard from "@/components/MetricsDashboard";

interface Props {
  params: { id: string };
}

export default async function ProjectDashboard({ params }: Props) {
  const resolvedParams = (await params) as { id?: string };
  const id = resolvedParams?.id;

  if (!id || id === "undefined") {
    redirect("/create");
  }

  const project = await getProjectById(id);
  const metrics = await getMetrics();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Project Plan Dashboard
          </h1>
          <p className="text-gray-600">
            AI-generated project analysis and recommendations
          </p>
        </div>

        {/* Requirements */}
        <RequirementsView requirements={project.requirements} />

        {/* Tech Stack */}
        {project.tech_stack && (
          <TechStackView techStack={project.tech_stack} />
        )}

        {/* Task Plan */}
        {project.task_plan && (
          <TaskPlanView taskPlan={project.task_plan} />
        )}

        {/* Risks */}
        {project.risks && <RiskView risks={project.risks} />}

        {/* Metrics */}
        <MetricsDashboard metrics={metrics} />
      </div>
    </div>
  );
}