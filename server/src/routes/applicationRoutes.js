import express from "express";
import { protect } from "../middleware/protect.js";
import { requireRole } from "../middleware/requireRole.js";
import { getRecruiterApplications } from "../controllers/applicationController.js";

import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();


router.post("/apply", protect, requireRole(["student"]), applyToJob);
router.get("/my", protect, requireRole(["student"]), getMyApplications);


router.get(
  "/recruiter",
  protect,
  requireRole(["recruiter"]),
  getRecruiterApplications
);
router.get("/job/:jobId", protect, requireRole(["recruiter"]), getApplicantsForJob);


router.put(
  "/:id/status",
  protect,
  requireRole(["recruiter"]),
  updateApplicationStatus
);


export default router;
