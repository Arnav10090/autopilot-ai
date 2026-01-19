import { runFullAnalysis } from "../services/agentOrchestrator.js";
import { saveProject, getAllProjects } from "../db/project.repository.js";
import { getProjectById } from "../db/project.repository.js";

export async function analyzeProject(req, res) {
  try {
    const { user_id } = req.body; // Extract user_id from request
    const analysisResult = await runFullAnalysis(req.body);

    console.log("ANALYSIS RESULT:", JSON.stringify(analysisResult, null, 2));

    const projectId = await saveProject(req.body, analysisResult, user_id);

    return res.json({
      project_id: projectId,
      ...analysisResult
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

export async function getProject(req, res) {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      console.warn("Invalid project id requested:", id);
      return res.status(400).json({ message: "Invalid project id" });
    }

    const project = await getProjectById(id);

    if (!project) {
      console.log("Project not found:", req.params.id);
      return res.status(404).json({ message: "Project not found" });
    }

    const safeJsonParse = (value) => {
      if (value == null) return null;
      if (typeof value === "object") return value;
      if (typeof value !== "string") return value;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    };

    return res.json({
      ...project,
      requirements: safeJsonParse(project.requirements),
      tech_stack: safeJsonParse(project.tech_stack),
      task_plan: safeJsonParse(project.task_plan),
      risks: safeJsonParse(project.risks),
    });
  } catch (err) {
    console.error("GET PROJECT ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch project"
    });
  }
}

export async function listProjects(req, res) {
  try {
    const { user_id } = req.query; // Get user_id from query string
    const rows = await getAllProjects(user_id);

    const projects = rows.map((r) => {
      let techTags = [];
      try {
        techTags = r.tech_stack ? JSON.parse(r.tech_stack) : [];
        if (Array.isArray(techTags)) {
          techTags = techTags.slice(0, 4).map((t) => (typeof t === 'string' ? t : t.name || String(t)));
        } else {
          techTags = [];
        }
      } catch (e) {
        techTags = [];
      }

      return {
        id: r.id,
        title: r.project_description || 'Untitled project',
        description: r.project_description || '',
        status: r.status || 'Planning',
        date: r.created_at || new Date().toISOString(),
        owner: '—',
        tags: techTags,
        skill_level: r.skill_level || 'Beginner',
        team_size: r.team_size || 1
      };
    });

    return res.json({ projects });
  } catch (err) {
    console.error('LIST PROJECTS ERROR:', err);
    return res.status(500).json({ message: 'Failed to list projects' });
  }
}

