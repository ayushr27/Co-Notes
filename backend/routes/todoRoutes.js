import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    getTodos, createTodo, updateTodo, deleteTodo,
    toggleComplete, toggleStar, clearCompleted
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/", authenticateToken, getTodos);
router.post("/", authenticateToken, createTodo);
router.delete("/completed", authenticateToken, clearCompleted);
router.put("/:id", authenticateToken, updateTodo);
router.delete("/:id", authenticateToken, deleteTodo);
router.patch("/:id/toggle", authenticateToken, toggleComplete);
router.patch("/:id/star", authenticateToken, toggleStar);

export default router;
