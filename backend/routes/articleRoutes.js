import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    getFeed, getMyArticles, getArticle, createArticle,
    updateArticle, deleteArticle, togglePublish,
    toggleLike, getComments, addComment
} from "../controllers/articleController.js";

const router = express.Router();

// Auth-protected routes (must come before /:id to avoid route conflict)
router.get("/my", authenticateToken, getMyArticles);
router.post("/", authenticateToken, createArticle);

// Public routes
router.get("/feed", getFeed);
router.get("/:id", getArticle);
router.get("/:id/comments", getComments);

// Auth-protected routes
router.put("/:id", authenticateToken, updateArticle);
router.delete("/:id", authenticateToken, deleteArticle);
router.patch("/:id/publish", authenticateToken, togglePublish);
router.post("/:id/like", authenticateToken, toggleLike);
router.post("/:id/comments", authenticateToken, addComment);

export default router;
