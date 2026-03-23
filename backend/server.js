import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

// Middleware imports
import { authenticateToken } from "./middleware/auth.js";

// Connect to MongoDB
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadsDir));

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Only allow image files
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Only image files are allowed'));
        } else {
            cb(null, true);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.post("/api/articles/upload-cover", authenticateToken, upload.single("cover"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const coverUrl = `/uploads/${req.file.filename}`;
    res.json({ url: coverUrl });
});

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

// Global 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler (must have 4 params for Express to treat it as error middleware)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // Handle multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: "Image file is too large (max 5MB)" });
    }
    if (err.message === 'Only image files are allowed') {
        return res.status(400).json({ message: err.message });
    }
    
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
