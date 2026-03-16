import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, // Stringified JSON or HTML
    },
    icon: {
        type: String,
        default: '📄'
    },
    coverImage: {
        type: String,
    },
    permission: {
        type: String,
        enum: ['private', 'public', 'collaborative'],
        default: 'private'
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String
    }]
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

const Document = mongoose.model('Document', documentSchema);
export default Document;
