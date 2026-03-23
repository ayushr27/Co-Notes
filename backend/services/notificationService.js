import Notification from "../models/Notification.js";

/**
 * Helper to create and emit a notification.
 * @param {Object} req - Express request object (used to access req.app.get('io')).
 * @param {String|ObjectId} userId - ID of the user to receive the notification.
 * @param {String} message - The text content of the notification.
 * @param {String} type - The notification type (e.g., 'article_published', etc.).
 * @param {String} link - Optional URL for the frontend to navigate to.
 */
export const createNotification = async (req, userId, message, type, link = "") => {
    try {
        const notification = await Notification.create({
            userId,
            message,
            type,
            link
        });

        const io = req.app.get("io");
        if (io) {
            io.to(userId.toString()).emit("new_notification", notification);
        }
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
