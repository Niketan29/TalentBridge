import express from "express";
import { protect } from "../middleware/protect.js";
import { requireRole } from "../middleware/requireRole.js";

import {
  createJob,
  getAllJobs,
  getRecruiterJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();


router.get("/", getAllJobs);

router.get("/recruiter/my-jobs", protect, requireRole(["recruiter"]), getRecruiterJobs);

router.post("/", protect, requireRole(["recruiter"]), createJob);

router.get("/:id", getJobById);
router.put("/:id", protect, requireRole(["recruiter"]), updateJob);
router.delete("/:id", protect, requireRole(["recruiter"]), deleteJob);


export default router;
