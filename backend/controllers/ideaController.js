import Idea from "../models/Idea.js";
import { createNotification } from "../services/notificationService.js";

// GET /api/ideas
export async function getIdeas(req, res) {
    try {
        const { search, starred } = req.query;

        const query = {
            userId: req.userId,
            ...(starred === "true" && { starred: true }),
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            })
        };

        const ideas = await Idea.find(query).sort({ createdAt: -1 });
        return res.json(ideas);
    } catch (error) {
        console.error("getIdeas error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/ideas
export async function createIdea(req, res) {
    try {
        const { title, description, tags, color } = req.body;
        if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

        const idea = await Idea.create({
            title: title.trim(),
            description: description || null,
            tags: tags || [],
            color: color || "#667eea",
            userId: req.userId
        });

        await createNotification(
            req,
            req.userId,
            `Idea saved: "${idea.title}"`,
            "idea_created",
            "/ideas.html"
        );

        return res.status(201).json(idea);
    } catch (error) {
        console.error("createIdea error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/ideas/:id
export async function updateIdea(req, res) {
    try {
        const { title, description, tags, color } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (tags !== undefined) updateData.tags = tags;
        if (color !== undefined) updateData.color = color;

        const idea = await Idea.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!idea) return res.status(404).json({ message: "Idea not found" });

        return res.json(idea);
    } catch (error) {
        console.error("updateIdea error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/ideas/:id
export async function deleteIdea(req, res) {
    try {
        const idea = await Idea.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!idea) return res.status(404).json({ message: "Idea not found" });

        return res.json({ message: "Idea deleted" });
    } catch (error) {
        console.error("deleteIdea error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/ideas/:id/star
export async function toggleStar(req, res) {
    try {
        const idea = await Idea.findOne({ _id: req.params.id, userId: req.userId });
        if (!idea) return res.status(404).json({ message: "Idea not found" });

        idea.starred = !idea.starred;
        await idea.save();

        return res.json({ starred: idea.starred });
    } catch (error) {
        console.error("toggleStar error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
