import Notification from "../models/Notification.js";

// Get user's notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ userId });
        const unreadCount = await Notification.countDocuments({ userId, isRead: false });

        res.json({
            notifications,
            total,
            unreadCount,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error fetching notifications" });
    }
};

// Mark sub-set or all as read
export const markAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        const { notificationIds } = req.body; // Array of IDs to mark read, or empty for all

        if (notificationIds && notificationIds.length > 0) {
            await Notification.updateMany(
                { _id: { $in: notificationIds }, userId },
                { $set: { isRead: true } }
            );
        } else {
            await Notification.updateMany(
                { userId, isRead: false },
                { $set: { isRead: true } }
            );
        }
        res.json({ message: "Notifications marked as read" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ message: "Server error updating notifications" });
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        await Notification.findOneAndDelete({ _id: id, userId });
        res.json({ message: "Notification deleted" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Server error deleting notification" });
    }
};

// Clear all notifications
export const clearAllNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.deleteMany({ userId });
        res.json({ message: "All notifications cleared" });
    } catch (error) {
        console.error("Error clearing notifications:", error);
        res.status(500).json({ message: "Server error clearing notifications" });
    }
};
