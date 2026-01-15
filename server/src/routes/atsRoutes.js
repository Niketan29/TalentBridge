import express from "express";
import { protect } from "../middleware/protect.js";
import { requireRole } from "../middleware/requireRole.js";
import { analyzeATS } from "../controllers/atsController.js";

const router = express.Router();

router.post("/analyze", protect, requireRole(["student"]), analyzeATS);

export default router;
