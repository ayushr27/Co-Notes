import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    getCollections, getCollection, createCollection,
    updateCollection, deleteCollection, toggleStar,
    addItem, removeItem
} from "../controllers/collectionController.js";

const router = express.Router();

router.get("/", authenticateToken, getCollections);
router.get("/:id", authenticateToken, getCollection);
router.post("/", authenticateToken, createCollection);
router.put("/:id", authenticateToken, updateCollection);
router.delete("/:id", authenticateToken, deleteCollection);
router.patch("/:id/star", authenticateToken, toggleStar);
router.post("/:id/items", authenticateToken, addItem);
router.delete("/:id/items/:itemId", authenticateToken, removeItem);

export default router;
