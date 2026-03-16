console.log('--- Initializing server.js ---');
import express from "express";
import cors from "cors";
import connectDB from "./db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import quickNoteRoutes from "./routes/quickNoteRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/quick-notes", quickNoteRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/search", searchRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});