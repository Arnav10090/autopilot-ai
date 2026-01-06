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

      // Simulated agent progression for UX clarity
      setStep(1);
      const result = await analyzeProject(form);
      console.debug("analyzeProject result:", result);

      setStep(4);
      if (result && result.project_id) {
        router.push(`/project/${result.project_id}`);
      } else {
        console.error("analyzeProject returned no project_id:", result);
        setError("Failed to create project. No project id returned.");
      }
    } catch (err) {
        console.error("analyzeProject error:", err);
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 w-full">
      {loading && <AgentProgress currentStep={step} />}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h1 className="text-2xl font-semibold text-gray-800">
          Create Project Plan
        </h1>

        <textarea
          name="project_description"
          placeholder="Describe your project idea..."
          value={form.project_description}
          onChange={handleChange}
          className="w-full border rounded p-3 min-h-[120px]"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="team_size"
            min={1}
            value={form.team_size}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Team Size"
          />

          <input
            type="text"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Deadline (e.g. 6 weeks)"
          />
        </div>

        <select
          name="skill_level"
          value={form.skill_level}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <textarea
          name="constraints"
          placeholder="Any constraints? (optional)"
          value={form.constraints}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating Plan..." : "Generate Plan"}
        </button>
      </form>
    </div>
  );
}
