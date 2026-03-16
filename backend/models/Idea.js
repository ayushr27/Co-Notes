import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    tags: [{
        type: String
    }],
    starred: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: '#667eea'
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

const Idea = mongoose.model('Idea', ideaSchema);
export default Idea;
