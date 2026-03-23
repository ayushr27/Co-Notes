import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getMe, updateMe, getProfile, getDashboardStats, toggleFollow } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateMe);
router.get("/me/stats", authenticateToken, getDashboardStats);
router.get("/:username", getProfile);
router.post("/:id/follow", authenticateToken, toggleFollow);

export default router;
