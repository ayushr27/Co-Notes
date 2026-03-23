import Collection from "../models/Collection.js";

// GET /api/collections
export async function getCollections(req, res) {
    try {
        const { search, starred } = req.query;

        const query = {
            userId: req.userId,
            ...(starred === "true" && { starred: true }),
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            })
        };

        const collections = await Collection.find(query).sort({ createdAt: -1 });

        return res.json(collections.map(c => ({
            ...c.toJSON(),
            itemCount: c.items.length
        })));
    } catch (error) {
        console.error("getCollections error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/collections/:id
export async function getCollection(req, res) {
    try {
        const collection = await Collection.findOne({ _id: req.params.id, userId: req.userId })
            .populate({
                path: 'items.document',
                select: 'id title icon updatedAt'
            });

        if (!collection) return res.status(404).json({ message: "Collection not found" });

        // Sort items by addedAt desc
        collection.items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

        return res.json(collection);
    } catch (error) {
        console.error("getCollection error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/collections
export async function createCollection(req, res) {
    try {
        const { name, description, icon, color, template, isPrivate } = req.body;
        if (!name?.trim()) return res.status(400).json({ message: "Collection name is required" });

        const collection = await Collection.create({
            name: name.trim(),
            description: description || null,
            icon: icon || "📁",
            color: color || "#667eea",
            template: template || "blank",
            isPrivate: isPrivate !== undefined ? isPrivate : true,
            userId: req.userId
        });

        return res.status(201).json(collection);
    } catch (error) {
        console.error("createCollection error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/collections/:id
export async function updateCollection(req, res) {
    try {
        const { name, description, icon, color, template, isPrivate } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (icon !== undefined) updateData.icon = icon;
        if (color !== undefined) updateData.color = color;
        if (template !== undefined) updateData.template = template;
        if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

        const collection = await Collection.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!collection) return res.status(404).json({ message: "Collection not found" });

        return res.json(collection);
    } catch (error) {
        console.error("updateCollection error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/collections/:id
export async function deleteCollection(req, res) {
    try {
        const collection = await Collection.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!collection) return res.status(404).json({ message: "Collection not found" });

        return res.json({ message: "Collection deleted" });
    } catch (error) {
        console.error("deleteCollection error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/collections/:id/star
export async function toggleStar(req, res) {
    try {
        const collection = await Collection.findOne({ _id: req.params.id, userId: req.userId });
        if (!collection) return res.status(404).json({ message: "Collection not found" });

        collection.starred = !collection.starred;
        await collection.save();

        return res.json({ starred: collection.starred });
    } catch (error) {
        console.error("toggleStar error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/collections/:id/items
export async function addItem(req, res) {
    try {
        const { documentId } = req.body;
        if (!documentId) return res.status(400).json({ message: "documentId is required" });

        const collection = await Collection.findOne({ _id: req.params.id, userId: req.userId });
        if (!collection) return res.status(404).json({ message: "Collection not found" });

        // Check if already in collection
        if (collection.items.some(item => item.document.toString() === documentId)) {
            return res.status(409).json({ message: "Document already in collection" });
        }

        collection.items.push({ document: documentId });
        await collection.save();

        return res.status(201).json(collection.items[collection.items.length - 1]);
    } catch (error) {
        console.error("addItem error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/collections/:id/items/:itemId
export async function removeItem(req, res) {
    try {
        const collection = await Collection.findOne({ _id: req.params.id, userId: req.userId });
        if (!collection) return res.status(404).json({ message: "Collection not found" });

        collection.items.pull(req.params.itemId);
        await collection.save();

        return res.json({ message: "Item removed from collection" });
    } catch (error) {
        console.error("removeItem error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
