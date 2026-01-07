import { runFullAnalysis } from "../services/agentOrchestrator.js";
import { saveProject } from "../db/project.repository.js";
import { getProjectById } from "../db/project.repository.js";

export async function analyzeProject(req, res) {
  try {
    const analysisResult = await runFullAnalysis(req.body);

    console.log("ANALYSIS RESULT:", JSON.stringify(analysisResult, null, 2));

    const projectId = await saveProject(req.body, analysisResult);

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

    return res.json(project);
  } catch (err) {
    console.error("GET PROJECT ERROR:", err);
    return res.status(500).json({
      message: "Failed to fetch project"
    });
  }
}

