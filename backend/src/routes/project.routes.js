import express from "express";
import {
  analyzeProject,
  getProject
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/analyze", analyzeProject);
router.get("/:id", getProject);

export default router;
