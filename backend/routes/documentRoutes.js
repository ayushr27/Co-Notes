import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    getDocuments, getDocument, createDocument,
    updateDocument, deleteDocument, toggleFavorite
} from "../controllers/documentController.js";

const router = express.Router();

router.get("/", authenticateToken, getDocuments);
router.get("/:id", authenticateToken, getDocument);
router.post("/", authenticateToken, createDocument);
router.put("/:id", authenticateToken, updateDocument);
router.delete("/:id", authenticateToken, deleteDocument);
router.patch("/:id/favorite", authenticateToken, toggleFavorite);

export default router;
