import express from "express";
import { protect } from "../middleware/protect.js";
import { requireRole } from "../middleware/requireRole.js";
import { getAdminStats } from "../controllers/adminController.js";
import { getAllUsers, toggleBlockUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, requireRole(["admin"]), getAdminStats);
router.get("/users", protect, requireRole(["admin"]), getAllUsers);
router.patch("/users/:id/toggle-block", protect, requireRole(["admin"]), toggleBlockUser);

export default router;
