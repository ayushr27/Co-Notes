import mongoose from 'mongoose';

const quickNoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    pinned: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: '#fef3c7'
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
        }
    }
});

const QuickNote = mongoose.model('QuickNote', quickNoteSchema);
export default QuickNote;
