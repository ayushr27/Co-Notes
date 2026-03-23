import express from "express";
import { getNotifications, markAsRead, deleteNotification, clearAllNotifications } from "../controllers/notificationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getNotifications);
router.put("/read", authenticateToken, markAsRead);
router.delete("/:id", authenticateToken, deleteNotification);
router.delete("/", authenticateToken, clearAllNotifications);

export default router;
