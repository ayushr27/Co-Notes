import mongoose from 'mongoose';

const projectNoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => { delete ret._id; delete ret.__v; }
    }
});

const projectCollectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: '📁' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => { delete ret._id; delete ret.__v; }
    }
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🚀' },
    color: { type: String, default: '#6366f1' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notes: [projectNoteSchema],
    collections: [projectCollectionSchema]
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

const Project = mongoose.model('Project', projectSchema);
export default Project;
