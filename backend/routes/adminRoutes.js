import express from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { 
    getAdminMetrics, 
    getAllUsers, 
    updateUserRole, 
    deleteUser,
    getRecentActivity,
    deleteContent,
    getModerationContent
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes must be heavily protected
router.use(authenticateToken, requireAdmin);

router.get("/metrics", getAdminMetrics);
router.get("/users", getAllUsers);
router.get("/activity", getRecentActivity);
router.get("/moderation", getModerationContent);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.delete("/content/:type/:id", deleteContent);

export default router;
