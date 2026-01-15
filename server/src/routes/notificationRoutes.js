import express from "express";
import { protect } from "../middleware/protect.js";

import {
  getMyNotifications,
  markAsRead,
  getUnreadCount,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/:id/read", protect, markAsRead);

export default router;
