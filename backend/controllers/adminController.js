import User from "../models/User.js";
import Project from "../models/Project.js";
import Article from "../models/Article.js";
import Document from "../models/Document.js";
import Idea from "../models/Idea.js";

// @desc    Get dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
export const getAdminMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalArticles = await Article.countDocuments();

        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            metrics: {
                totalUsers,
                totalProjects,
                totalArticles
            },
            recentUsers
        });
    } catch (error) {
        console.error("Admin metrics error:", error);
        res.status(500).json({ message: "Error fetching admin metrics" });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        // Prevent removing the last admin (basic safeguard, can be expanded)
        if (role === 'user') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                const targetUser = await User.findById(req.params.id);
                if (targetUser && targetUser.role === 'admin') {
                    return res.status(400).json({ message: "Cannot demote the last admin" });
                }
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user role" });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        // Find and delete the user
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Optional cascade deletes:
        // await Project.deleteMany({ owner: req.params.id });
        // await Article.deleteMany({ author: req.params.id });

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// @desc    Get recent platform activity
// @route   GET /api/admin/activity
// @access  Private/Admin
export const getRecentActivity = async (req, res) => {
    try {
        const [users, projects, articles, documents] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(5).select('name username createdAt'),
            Project.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'name'),
            Article.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name'),
            Document.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name')
        ]);

        const activity = [
            ...users.map(u => ({ type: 'user', data: u, text: `New user joined: ${u.name || u.username}`, date: u.createdAt })),
            ...projects.map(p => ({ type: 'project', data: p, text: `New project created: ${p.name}`, date: p.createdAt })),
            ...articles.map(a => ({ type: 'article', data: a, text: `Article published: ${a.title}`, date: a.createdAt })),
            ...documents.map(d => ({ type: 'document', data: d, text: `New document: ${d.title}`, date: d.createdAt }))
        ].sort((a, b) => b.date - a.date).slice(0, 10);

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: "Error fetching activity" });
    }
};

// @desc    Moderate content (delete project/article)
// @route   DELETE /api/admin/content/:type/:id
// @access  Private/Admin
export const deleteContent = async (req, res) => {
    try {
        const { type, id } = req.params;
        let model;
        if (type === 'project') model = Project;
        else if (type === 'article') model = Article;
        else if (type === 'document') model = Document;
        else return res.status(400).json({ message: "Invalid content type" });

        const item = await model.findByIdAndDelete(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        res.json({ message: `${type} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: "Error deleting content" });
    }
};

// @desc    Get all public content for moderation
// @route   GET /api/admin/moderation
// @access  Private/Admin
export const getModerationContent = async (req, res) => {
    try {
        const [projects, articles] = await Promise.all([
            Project.find().populate('owner', 'name username').sort({ createdAt: -1 }),
            Article.find().populate('userId', 'name username').sort({ createdAt: -1 })
        ]);

        res.json({ projects, articles });
    } catch (error) {
        res.status(500).json({ message: "Error fetching moderation content" });
    }
};
