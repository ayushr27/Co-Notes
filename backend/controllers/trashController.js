import Document from "../models/Document.js";
import Collection from "../models/Collection.js";
import Idea from "../models/Idea.js";
import Todo from "../models/Todo.js";
import QuickNote from "../models/QuickNote.js";
import Article from "../models/Article.js";
import Project from "../models/Project.js";
import TrashItem from "../models/TrashItem.js";

function preparePayload(payload) {
    const safe = { ...(payload || {}) };
    delete safe._id;
    delete safe.id;
    delete safe.__v;
    delete safe.createdAt;
    delete safe.updatedAt;
    return safe;
}

async function restoreWithModel(Model, ownerField, ownerValue, payload, itemId) {
    const existing = await Model.findById(itemId);
    if (existing) return existing;

    const data = preparePayload(payload);
    data[ownerField] = ownerValue;

    try {
        return await Model.create({ _id: itemId, ...data });
    } catch {
        return await Model.create(data);
    }
}

export async function getTrashItems(req, res) {
    try {
        const items = await TrashItem.find({ userId: req.userId }).sort({ deletedAt: -1 });
        return res.json(items);
    } catch (error) {
        console.error("getTrashItems error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function restoreTrashItem(req, res) {
    try {
        const trashItem = await TrashItem.findOne({ _id: req.params.id, userId: req.userId });
        if (!trashItem) return res.status(404).json({ message: "Trash item not found" });

        const { itemType, payload, itemId } = trashItem;

        if (itemType === "document") {
            await restoreWithModel(Document, "userId", req.userId, payload, itemId);
        } else if (itemType === "collection") {
            await restoreWithModel(Collection, "userId", req.userId, payload, itemId);
        } else if (itemType === "idea") {
            await restoreWithModel(Idea, "userId", req.userId, payload, itemId);
        } else if (itemType === "todo") {
            await restoreWithModel(Todo, "userId", req.userId, payload, itemId);
        } else if (itemType === "quick-note") {
            await restoreWithModel(QuickNote, "userId", req.userId, payload, itemId);
        } else if (itemType === "article") {
            await restoreWithModel(Article, "userId", req.userId, payload, itemId);
        } else if (itemType === "project") {
            await restoreWithModel(Project, "owner", req.userId, payload, itemId);
        } else {
            return res.status(400).json({ message: "Unsupported trash item type" });
        }

        await trashItem.deleteOne();
        return res.json({ message: "Item restored successfully" });
    } catch (error) {
        console.error("restoreTrashItem error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteTrashItem(req, res) {
    try {
        const item = await TrashItem.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!item) return res.status(404).json({ message: "Trash item not found" });

        return res.json({ message: "Trash item removed permanently" });
    } catch (error) {
        console.error("deleteTrashItem error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function clearTrash(req, res) {
    try {
        const result = await TrashItem.deleteMany({ userId: req.userId });
        return res.json({ message: `${result.deletedCount} item(s) removed permanently` });
    } catch (error) {
        console.error("clearTrash error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
