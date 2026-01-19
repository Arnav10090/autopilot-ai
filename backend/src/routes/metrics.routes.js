//METRICS ENDPOINT

import express from "express";
import { getAgentPerformance } from "../utils/metrics.js";
import { getProjectMetrics } from "../db/project.repository.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { range = '24h', user_id } = req.query;
    
    // Calculate start date
    const now = new Date();
    let startDate = new Date();
    
    switch(range) {
      case '24h': startDate.setHours(now.getHours() - 24); break;
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
      case '90d': startDate.setDate(now.getDate() - 90); break;
      default: startDate.setHours(now.getHours() - 24); // default to 24h
    }

    // Get DB metrics (Volume)
    // Pass user_id if present (convert to number/int usually, but pg driver handles strings often too, let's keep it safe if it's a number column)
    const userIdVal = user_id ? parseInt(user_id) : undefined;
    const dbMetrics = await getProjectMetrics(startDate, userIdVal);
    
    // Get In-Memory metrics (Performance)
    // NOTE: agentMetrics are in-memory and currently GLOBAL. 
    // Implementing user-specific agent metrics would require refactoring the entire metrics collection system to be DB-based or keyed by user.
    // However, the user request specifically mentioned "projects that are created by the logged in user".
    // I will filter the project metrics. The agent performance metrics (latency/success) are system-wide.
    // If the user REALLY wants agent stats by user, I'd need to change how `recordMetric` works. 
    // For now, I'll filter the "Projects" count which is the most visible "user specific" stats.
    const agentMetrics = getAgentPerformance(startDate);

    res.json({
      agents: agentMetrics,
      projects: dbMetrics,
      period: {
        range,
        start: startDate.toISOString(),
        end: now.toISOString()
      }
    });
  } catch (error) {
    console.error("Metrics Error:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

export default router;

//This route provides access to the in-memory metrics collected for each agent.
