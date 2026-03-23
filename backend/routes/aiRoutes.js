import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { generateIdea, generateArticle } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-idea", authenticateToken, generateIdea);
router.post("/generate-article", authenticateToken, generateArticle);

export default router;
