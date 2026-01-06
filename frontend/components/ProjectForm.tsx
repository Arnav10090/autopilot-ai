"use client";

import { useState } from "react";
import { analyzeProject } from "@/services/api";
import { CreateProjectPayload } from "@/types/project";
import { useRouter } from "next/navigation";
import AgentProgress from "@/components/AgentProgress";

export default function ProjectForm() {
  const router = useRouter();

  const [form, setForm] = useState<CreateProjectPayload>({
    project_description: "",
    team_size: 1,
    deadline: "",
    skill_level: "Beginner",
    constraints: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.project_description.trim()) {
      setError("Project description is required");
      return;
    }

    try {
      setLoading(true);
      setStep(0);

      setStep(1);
      const result = await analyzeProject(form);

      setStep(4);
      if (result && result.project_id) {
        router.push(`/project/${result.project_id}`);
      } else {
        setError("Failed to create project. No project id returned.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {loading && <AgentProgress currentStep={step} />}

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Project Plan
        </h1>
        <p className="text-gray-600 mb-8">
          Provide details about your project and let our AI agents create a comprehensive plan.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Description */}
          <div>
            <label htmlFor="project_description" className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              id="project_description"
              name="project_description"
              placeholder="Describe your project idea, goals, and key features..."
              value={form.project_description}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg p-4 min-h-[160px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Team Size & Deadline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="team_size" className="block text-sm font-medium text-gray-700 mb-2">
                Team Size *
              </label>
              <input
                type="number"
                id="team_size"
                name="team_size"
                min={1}
                value={form.team_size}
                onChange={handleChange}
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Deadline *
              </label>
              <input
                type="text"
                id="deadline"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., 6 weeks, 3 months"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <label htmlFor="skill_level" className="block text-sm font-medium text-gray-700 mb-2">
              Team Skill Level *
            </label>
            <select
              id="skill_level"
              name="skill_level"
              value={form.skill_level}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {/* Constraints */}
          <div>
            <label htmlFor="constraints" className="block text-sm font-medium text-gray-700 mb-2">
              Constraints (Optional)
            </label>
            <textarea
              id="constraints"
              name="constraints"
              placeholder="Any technical constraints, budget limitations, or specific requirements..."
              value={form.constraints}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {loading ? "Generating Plan..." : "Generate Plan"}
          </button>
        </form>
      </div>
    </div>
  );
}