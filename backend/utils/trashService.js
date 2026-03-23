import TrashItem from "../models/TrashItem.js";

function sanitizePayload(raw) {
    const payload = raw?.toObject ? raw.toObject({ depopulate: true }) : { ...(raw || {}) };
    delete payload._id;
    delete payload.id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;
    return payload;
}

export async function moveToTrash({ userId, itemType, item, displayName, icon }) {
    if (!item) return null;

    const itemId = (item._id || item.id || "").toString();
    if (!itemId) return null;

    const payload = sanitizePayload(item);

    return TrashItem.create({
        userId,
        itemType,
        itemId,
        displayName: displayName || payload.title || payload.name || payload.text || payload.content?.slice(0, 50) || "Untitled",
        icon: icon || payload.icon || "🗑️",
        payload,
        deletedAt: new Date()
    });
}
