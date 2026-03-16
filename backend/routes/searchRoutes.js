import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { globalSearch } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", authenticateToken, globalSearch);

export default router;
