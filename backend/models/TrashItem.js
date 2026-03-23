import mongoose from "mongoose";

const trashItemSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        itemType: {
            type: String,
            required: true,
            enum: ["document", "collection", "idea", "todo", "quick-note", "article", "project"],
            index: true
        },
        itemId: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            default: "Untitled"
        },
        icon: {
            type: String,
            default: "🗑️"
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        deletedAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

trashItemSchema.index({ userId: 1, deletedAt: -1 });

const TrashItem = mongoose.model("TrashItem", trashItemSchema);
export default TrashItem;
