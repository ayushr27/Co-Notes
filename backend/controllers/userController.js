import User from "../models/User.js";
import Document from "../models/Document.js";
import Idea from "../models/Idea.js";
import Todo from "../models/Todo.js";
import Article from "../models/Article.js";
import QuickNote from "../models/QuickNote.js";
import Collection from "../models/Collection.js";

// GET /api/users/me
export async function getMe(req, res) {
    try {
        const user = await User.findById(req.userId).select("-password -__v");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json(user);
    } catch (error) {
        console.error("getMe error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/users/me
export async function updateMe(req, res) {
    const { name, bio, avatar, coverImage, location, website } = req.body;
    try {
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (location !== undefined) updateData.location = location;
        if (website !== undefined) updateData.website = website;

        const user = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password -__v");

        return res.json(user);
    } catch (error) {
        console.error("updateMe error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/users/:username
export async function getProfile(req, res) {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password -__v");
        if (!user) return res.status(404).json({ message: "User not found" });

        const [articlesCount, collectionsCount] = await Promise.all([
            Article.countDocuments({ userId: user._id, published: true }),
            Collection.countDocuments({ userId: user._id, isPrivate: false })
        ]);

        return res.json({
            ...user.toJSON(),
            _count: {
                articles: articlesCount,
                collections: collectionsCount
            }
        });
    } catch (error) {
        console.error("getProfile error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/users/me/stats
export async function getDashboardStats(req, res) {
    try {
        const [
            documentCount,
            ideaCount,
            completedTodos,
            pendingTodos,
            articleCount,
            quickNoteCount,
            collectionCount
        ] = await Promise.all([
            Document.countDocuments({ userId: req.userId }),
            Idea.countDocuments({ userId: req.userId }),
            Todo.countDocuments({ userId: req.userId, completed: true }),
            Todo.countDocuments({ userId: req.userId, completed: false }),
            Article.countDocuments({ userId: req.userId, published: true }),
            QuickNote.countDocuments({ userId: req.userId }),
            Collection.countDocuments({ userId: req.userId })
        ]);

        return res.json({
            documents: documentCount,
            ideas: ideaCount,
            todosCompleted: completedTodos,
            todosPending: pendingTodos,
            articles: articleCount,
            quickNotes: quickNoteCount,
            collections: collectionCount
        });
    } catch (error) {
        console.error("getDashboardStats error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/users/:id/follow
export async function toggleFollow(req, res) {
    try {
        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.userId);
        
        if (!targetUser || !currentUser) return res.status(404).json({ message: "User not found" });
        if (targetUser._id.toString() === currentUser._id.toString()) {
            return res.status(400).json({ message: "Cannot follow yourself" });
        }

        const isFollowing = currentUser.following.findIndex(id => id.toString() === targetUser._id.toString()) > -1;

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUser._id.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());
            await currentUser.save();
            await targetUser.save();
            return res.json({ following: false });
        } else {
            // Follow
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
            await currentUser.save();
            await targetUser.save();
            return res.json({ following: true });
        }
    } catch (error) {
        console.error("toggleFollow error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
