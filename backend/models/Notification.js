import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true, // e.g., 'article_published', 'document_created'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    link: {
        type: String, // Optional URL to navigate to when clicked
        default: ""
    }
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
