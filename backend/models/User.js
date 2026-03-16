import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    bio: {
        type: String,
    },
    avatar: {
        type: String,
    },
    location: {
        type: String,
    },
    website: {
        type: String,
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        }
    }
});

const User = mongoose.model('User', userSchema);
export default User;
