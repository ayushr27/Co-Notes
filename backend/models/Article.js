import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
        }
    }
});

const articleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
    },
    content: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    category: {
        type: String,
    },
    subcategory: {
        type: String,
    },
    tags: [{
        type: String
    }],
    languages: [{
        type: String
    }],
    frameworks: [{
        type: String
    }],
    isSeriesPart: {
        type: Boolean,
        default: false
    },
    seriesName: {
        type: String
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'unlisted', 'members'],
        default: 'public'
    },
    published: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
    },
    readTime: {
        type: Number,
        default: 5
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    allowComments: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
            // Provide a count for _count.comments to mimic Prisma response format
            if (ret.comments) {
                ret._count = ret._count || {};
                ret._count.comments = ret.comments.length;
            }
        }
    }
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
