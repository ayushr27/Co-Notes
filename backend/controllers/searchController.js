import Document from "../models/Document.js";
import Collection from "../models/Collection.js";
import Article from "../models/Article.js";
import Idea from "../models/Idea.js";
import QuickNote from "../models/QuickNote.js";

// GET /api/search?q=query
export async function globalSearch(req, res) {
    try {
        const { q } = req.query;
        if (!q?.trim()) return res.json({ documents: [], collections: [], articles: [], ideas: [] });

        const searchTerm = q.trim();

        const [documents, collections, articles, ideas, quickNotes] = await Promise.all([
            Document.find({
                userId: req.userId,
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { tags: { $in: [new RegExp(searchTerm, "i")] } }
                ]
            })
                .select("_id title icon updatedAt")
                .limit(10)
                .sort({ updatedAt: -1 }),

            Collection.find({
                userId: req.userId,
                $or: [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { description: { $regex: searchTerm, $options: "i" } }
                ]
            })
                .select("_id name icon color")
                .limit(10),

            Article.find({
                published: true,
                visibility: "public",
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { subtitle: { $regex: searchTerm, $options: "i" } },
                    { subcategory: { $regex: searchTerm, $options: "i" } },
                    { tags: { $in: [new RegExp(searchTerm, "i")] } }
                ]
            })
                .select("_id title coverImage publishedAt")
                .limit(10)
                .sort({ publishedAt: -1 }),

            Idea.find({
                userId: req.userId,
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { description: { $regex: searchTerm, $options: "i" } }
                ]
            })
                .select("_id title color")
                .limit(10),

            QuickNote.find({
                userId: req.userId,
                $or: [
                    { title: { $regex: searchTerm, $options: "i" } },
                    { content: { $regex: searchTerm, $options: "i" } }
                ]
            })
                .select("_id title color")
                .limit(10)
        ]);

        return res.json({ documents, collections, articles, ideas, quickNotes });
    } catch (error) {
        console.error("globalSearch error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
