import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    getQuickNotes, createQuickNote, updateQuickNote,
    deleteQuickNote, togglePin, changeColor
} from "../controllers/quickNoteController.js";

const router = express.Router();

router.get("/", authenticateToken, getQuickNotes);
router.post("/", authenticateToken, createQuickNote);
router.put("/:id", authenticateToken, updateQuickNote);
router.delete("/:id", authenticateToken, deleteQuickNote);
router.patch("/:id/pin", authenticateToken, togglePin);
router.patch("/:id/color", authenticateToken, changeColor);

export default router;
