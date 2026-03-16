import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getMe, updateMe, getProfile, getDashboardStats } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateMe);
router.get("/me/stats", authenticateToken, getDashboardStats);
router.get("/:username", getProfile);

export default router;
