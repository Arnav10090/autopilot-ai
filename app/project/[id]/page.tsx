"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function CompleteDashboard() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [projectRes, metricsRes] = await Promise.all([
          fetch(`http://127.0.0.1:5000/api/projects/${projectId}`),
          fetch(`http://127.0.0.1:5000/api/metrics`)
        ]);

        if (!projectRes.ok) {
          throw new Error("Failed to fetch project");
        }

        if (!metricsRes.ok) {
          throw new Error("Failed to fetch metrics");
        }

        const projectData = await projectRes.json();
        const metricsData = await metricsRes.json();

        setProject(projectData);
        setMetrics(metricsData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString();

  const getStatusBadge = (status: string) =>
    status === "completed" ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        Completed
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        Incomplete
      </span>
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{error || "Project not found"}</p>
      </div>
    );
  }

  const severityConfig: any = {
    Low: { bg: "bg-green-50", badge: "bg-green-100 text-green-800" },
    Medium: { bg: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-800" },
    High: { bg: "bg-red-50", badge: "bg-red-100 text-red-800" }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* PROJECT OVERVIEW */}
        <section className="bg-white p-8 rounded-xl shadow border-l-4 border-blue-600">
          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Project Analysis Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Project ID:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {project.id}
                </code>
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Generated on {formatDate(project.created_at)}
              </p>
            </div>
            {getStatusBadge(project.status)}
          </div>
        </section>

        {/* REQUIREMENTS */}
        <section className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Requirements Analysis</h2>

          {[
            "functional_requirements",
            "non_functional_requirements",
            "assumptions",
          ].map((key) => (
            <div key={key} className="mb-6">
              <h3 className="font-semibold capitalize mb-2">
                {key.replace(/_/g, " ")}
              </h3>
              <ul className="list-disc ml-6 space-y-1">
                {(project.requirements?.[key] ?? []).map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          {project.requirements?.missing_information?.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-semibold mb-2">Missing Information</h3>
              <ul className="list-disc ml-6">
                {(project.requirements.missing_information ?? []).map(
                  (item: string, i: number) => (
                    <li key={i}>{item}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </section>

        {/* TECH STACK */}
        <section className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(project.tech_stack ?? {}).map(([key, value]: any) => (
              <div key={key} className="border rounded p-5">
                <h3 className="uppercase text-sm text-gray-500 mb-1">{key}</h3>
                <p className="font-semibold">{value?.choice}</p>
                <p className="text-sm text-gray-600 mt-1">{value?.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TASK PLAN */}
        <section className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Execution Plan</h2>
          {(project.task_plan?.modules ?? []).map((module: any, i: number) => (
            <div key={i} className="mb-6 border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold mb-2">{module.module_name}</h3>
              {(module.tasks ?? []).map((task: any, j: number) => (
                <div key={j} className="flex justify-between text-sm mb-1">
                  <span>{task.task_name}</span>
                  <span className="font-medium">{task.estimate_days} days</span>
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* RISKS */}
        <section className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Risk Analysis</h2>
          {(project.risks?.risks ?? []).map((risk: any, i: number) => {
            const cfg = severityConfig[risk?.severity];
            return (
              <div key={i} className={`p-4 rounded mb-4 ${cfg.bg}`}>
                <div className="flex justify-between mb-1">
                  <p className="font-medium">{risk.risk}</p>
                  <span className={`px-2 py-0.5 rounded text-xs ${cfg.badge}`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Mitigation: {risk.mitigation}
                </p>
              </div>
            );
          })}
        </section>

        {/* METRICS */}
        {metrics && (
          <section className="bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">System Metrics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(metrics.agents ?? {}).map(([agent, data]: any) => {
                const avgLatency = Math.round(
                  (data.totalLatencyMs ?? 0) / Math.max(1, (data.totalCalls ?? 1))
                );
                return (
                  <div key={agent} className="border rounded p-5">
                    <h3 className="font-semibold capitalize mb-2">
                      {agent} Agent
                    </h3>
                    <p>Total Calls: {data.totalCalls}</p>
                    <p>Failures: {data.failures}</p>
                    <p>Retries: {data.totalRetries}</p>
                    <p>Avg Latency: {avgLatency} ms</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
