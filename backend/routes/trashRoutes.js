import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    getTrashItems,
    restoreTrashItem,
    deleteTrashItem,
    clearTrash
} from "../controllers/trashController.js";

const router = express.Router();

router.get("/", authenticateToken, getTrashItems);
router.post("/:id/restore", authenticateToken, restoreTrashItem);
router.delete("/:id", authenticateToken, deleteTrashItem);
router.delete("/", authenticateToken, clearTrash);

export default router;
