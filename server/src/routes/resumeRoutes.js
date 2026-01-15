import express from "express";
import { protect } from "../middleware/protect.js";
import { requireRole } from "../middleware/requireRole.js";

import {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  setActiveResume,
  getActiveResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/", protect, requireRole(["student"]), createResume);
router.get("/", protect, requireRole(["student"]), getMyResumes);

router.get("/active", protect, requireRole(["student"]), getActiveResume);

router.get("/:id", protect, requireRole(["student"]), getResumeById);
router.put("/:id", protect, requireRole(["student"]), updateResume);
router.delete("/:id", protect, requireRole(["student"]), deleteResume);

router.put("/:id/active", protect, requireRole(["student"]), setActiveResume);

export default router;
