import mongoose from 'mongoose';

const collectionItemSchema = new mongoose.Schema({
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
        }
    }
});

const collectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    icon: {
        type: String,
        default: '📁'
    },
    color: {
        type: String,
        default: '#667eea'
    },
    template: {
        type: String,
        default: 'blank'
    },
    isPrivate: {
        type: Boolean,
        default: true
    },
    starred: {
        type: Boolean,
        default: false
    },
    items: [collectionItemSchema]
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

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
