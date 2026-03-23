import Document from "../models/Document.js";
import Collection from "../models/Collection.js";
import { createNotification } from "../services/notificationService.js";

// GET /api/documents
export async function getDocuments(req, res) {
    try {
        const { search, page = 1, limit = 20, collectionId } = req.query;
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

        if (collectionId) {
            const collection = await Collection.findOne({ _id: collectionId, userId: req.userId });
            if (collection) {
                const docIds = collection.items.map(item => item.document);
                query._id = { $in: docIds };
            } else {
                return res.json({ documents: [], total: 0, page: parseInt(page), limit: parseInt(limit) });
            }
        }

        const [documents, total] = await Promise.all([
            Document.find(query)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .select("-__v"),
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
        const { title, content, icon, coverImage, permission, tags, color, isPinned, isStarred, isArchived } = req.body;
        const doc = await Document.create({
            title: title || "Untitled",
            content: content || "",
            icon: icon || "📄",
            coverImage,
            permission: permission || "private",
            tags: tags || [],
            color: color || "none",
            isPinned: isPinned || false,
            isStarred: isStarred || false,
            isArchived: isArchived || false,
            userId: req.userId
        });

        await createNotification(
            req,
            req.userId,
            `New document "${doc.title}" created.`,
            "document_created",
            `/document.html?id=${doc._id}`
        );

        return res.status(201).json(doc);
    } catch (error) {
        console.error("createDocument error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/documents/:id
export async function updateDocument(req, res) {
    try {
        const { title, content, icon, coverImage, permission, tags, color, isPinned, isStarred, isArchived } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (icon !== undefined) updateData.icon = icon;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (permission !== undefined) updateData.permission = permission;
        if (tags !== undefined) updateData.tags = tags;
        if (color !== undefined) updateData.color = color;
        if (isPinned !== undefined) updateData.isPinned = isPinned;
        if (isStarred !== undefined) updateData.isStarred = isStarred;
        if (isArchived !== undefined) updateData.isArchived = isArchived;

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
