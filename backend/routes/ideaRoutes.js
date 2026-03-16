import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    getIdeas, createIdea, updateIdea, deleteIdea, toggleStar
} from "../controllers/ideaController.js";

const router = express.Router();

router.get("/", authenticateToken, getIdeas);
router.post("/", authenticateToken, createIdea);
router.put("/:id", authenticateToken, updateIdea);
router.delete("/:id", authenticateToken, deleteIdea);
router.patch("/:id/star", authenticateToken, toggleStar);

export default router;
