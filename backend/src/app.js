import express from "express";
import cors from "cors";
import projectRoutes from "./routes/project.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/metrics", metricsRoutes);

export default app;