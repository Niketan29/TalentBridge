import express from "express";
import { protect } from "../middleware/protect.js";
import { requireRole } from "../middleware/requireRole.js";

import {
  getRecruiterProfile,
  upsertRecruiterProfile,
} from "../controllers/recruiterProfileController.js";

const router = express.Router();

router.get("/profile", protect, requireRole(["recruiter"]), getRecruiterProfile);
router.put("/profile", protect, requireRole(["recruiter"]), upsertRecruiterProfile);

export default router;
