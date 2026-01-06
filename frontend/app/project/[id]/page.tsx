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
    // If the route was navigated to with an invalid id (e.g. '/project/undefined'),
    // redirect the user back to the create page instead of throwing a server error.
    redirect("/create");
  }

  const project = await getProjectById(id);
  const metrics = await getMetrics();

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Project Plan Dashboard
      </h1>

      <RequirementsView requirements={project.requirements} />

      {project.tech_stack && (
        <TechStackView techStack={project.tech_stack} />
      )}

      {project.task_plan && (
        <TaskPlanView taskPlan={project.task_plan} />
      )}

      {project.risks && <RiskView risks={project.risks} />}

      <MetricsDashboard metrics={metrics} />
    </div>
  );
}
