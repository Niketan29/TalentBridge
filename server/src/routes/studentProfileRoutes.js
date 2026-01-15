import express from "express";
import { protect } from "../middleware/protect.js";
import { requireRole } from "../middleware/requireRole.js";

import {
  getStudentProfile,
  upsertStudentProfile,
} from "../controllers/studentProfileController.js";

const router = express.Router();

router.get("/profile", protect, requireRole(["student"]), getStudentProfile);
router.put("/profile", protect, requireRole(["student"]), upsertStudentProfile);

export default router;
