import QuickNote from "../models/QuickNote.js";
import { moveToTrash } from "../utils/trashService.js";

// GET /api/quick-notes
export async function getQuickNotes(req, res) {
    try {
        const { search } = req.query;

        const query = {
            userId: req.userId,
            ...(search && {
                content: { $regex: search, $options: "i" }
            })
        };

        const notes = await QuickNote.find(query).sort({ pinned: -1, createdAt: -1 });
        return res.json(notes);
    } catch (error) {
        console.error("getQuickNotes error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/quick-notes
export async function createQuickNote(req, res) {
    try {
        const { content, color } = req.body;
        if (!content?.trim()) return res.status(400).json({ message: "Content is required" });

        const note = await QuickNote.create({
            content: content.trim(),
            color: color || "#667eea",
            userId: req.userId
        });

        return res.status(201).json(note);
    } catch (error) {
        console.error("createQuickNote error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/quick-notes/:id
export async function updateQuickNote(req, res) {
    try {
        const { content } = req.body;

        const updateData = {};
        if (content !== undefined) updateData.content = content;

        const note = await QuickNote.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!note) return res.status(404).json({ message: "Note not found" });

        return res.json(note);
    } catch (error) {
        console.error("updateQuickNote error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/quick-notes/:id
export async function deleteQuickNote(req, res) {
    try {
        const note = await QuickNote.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!note) return res.status(404).json({ message: "Note not found" });

        await moveToTrash({
            userId: req.userId,
            itemType: "quick-note",
            item: note,
            displayName: note.content?.slice(0, 60) || "Quick Note",
            icon: "📝"
        });

        return res.json({ message: "Note deleted" });
    } catch (error) {
        console.error("deleteQuickNote error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/quick-notes/:id/pin
export async function togglePin(req, res) {
    try {
        const note = await QuickNote.findOne({ _id: req.params.id, userId: req.userId });
        if (!note) return res.status(404).json({ message: "Note not found" });

        note.pinned = !note.pinned;
        await note.save();

        return res.json({ pinned: note.pinned });
    } catch (error) {
        console.error("togglePin error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/quick-notes/:id/color
export async function changeColor(req, res) {
    try {
        const { color } = req.body;
        if (!color) return res.status(400).json({ message: "Color is required" });

        const note = await QuickNote.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { color },
            { new: true, runValidators: true }
        );

        if (!note) return res.status(404).json({ message: "Note not found" });

        return res.json({ color: note.color });
    } catch (error) {
        console.error("changeColor error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
