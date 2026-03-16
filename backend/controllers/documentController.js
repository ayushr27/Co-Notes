import Document from "../models/Document.js";

// GET /api/documents
export async function getDocuments(req, res) {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = {
            userId: req.userId,
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { tags: { $in: [search] } }
                ]
            })
        };

        const [documents, total] = await Promise.all([
            Document.find(query)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .select("-content -__v"),
            Document.countDocuments(query)
        ]);

        return res.json({ documents, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        console.error("getDocuments error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/documents/:id
export async function getDocument(req, res) {
    try {
        const doc = await Document.findOne({ _id: req.params.id, userId: req.userId });
        if (!doc) return res.status(404).json({ message: "Document not found" });
        return res.json(doc);
    } catch (error) {
        console.error("getDocument error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/documents
export async function createDocument(req, res) {
    try {
        const { title, content, icon, coverImage, permission, tags } = req.body;
        const doc = await Document.create({
            title: title || "Untitled",
            content: content || "",
            icon: icon || "📄",
            coverImage,
            permission: permission || "private",
            tags: tags || [],
            userId: req.userId
        });
        return res.status(201).json(doc);
    } catch (error) {
        console.error("createDocument error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/documents/:id
export async function updateDocument(req, res) {
    try {
        const { title, content, icon, coverImage, permission, tags } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (icon !== undefined) updateData.icon = icon;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (permission !== undefined) updateData.permission = permission;
        if (tags !== undefined) updateData.tags = tags;

        const doc = await Document.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!doc) return res.status(404).json({ message: "Document not found" });

        return res.json(doc);
    } catch (error) {
        console.error("updateDocument error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/documents/:id
export async function deleteDocument(req, res) {
    try {
        const doc = await Document.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!doc) return res.status(404).json({ message: "Document not found" });

        return res.json({ message: "Document deleted" });
    } catch (error) {
        console.error("deleteDocument error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/documents/:id/favorite
export async function toggleFavorite(req, res) {
    try {
        const doc = await Document.findOne({ _id: req.params.id, userId: req.userId });
        if (!doc) return res.status(404).json({ message: "Document not found" });

        doc.isFavorite = !doc.isFavorite;
        await doc.save();

        return res.json({ isFavorite: doc.isFavorite });
    } catch (error) {
        console.error("toggleFavorite error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
