//METRICS ENDPOINT

import express from "express";
import { metrics } from "../utils/metrics.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(metrics);
});

export default router;

//This route provides access to the in-memory metrics collected for each agent.
