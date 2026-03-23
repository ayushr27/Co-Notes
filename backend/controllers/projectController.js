import Project from "../models/Project.js";
import CollabInvite from "../models/CollabInvite.js";
import User from "../models/User.js";
import { moveToTrash } from "../utils/trashService.js";

// GET /api/projects — list projects where user is owner or collaborator
export async function getProjects(req, res) {
    try {
        const projects = await Project.find({
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        })
        .populate('owner', 'name username avatar')
        .populate('collaborators', 'name username avatar')
        .sort({ updatedAt: -1 });

        return res.json(projects);
    } catch (error) {
        console.error("getProjects error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/projects/:id
export async function getProject(req, res) {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        })
        .populate('owner', 'name username avatar')
        .populate('collaborators', 'name username avatar')
        .populate('notes.createdBy', 'name username avatar')
        .populate('collections.createdBy', 'name username avatar');

        if (!project) return res.status(404).json({ message: "Project not found" });
        return res.json(project);
    } catch (error) {
        console.error("getProject error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/projects
export async function createProject(req, res) {
    try {
        const { title, description, icon, color } = req.body;
        if (!title?.trim()) return res.status(400).json({ message: "Project title is required" });

        const project = await Project.create({
            title: title.trim(),
            description: description || '',
            icon: icon || '🚀',
            color: color || '#6366f1',
            owner: req.userId
        });

        const populated = await Project.findById(project._id)
            .populate('owner', 'name username avatar');

        return res.status(201).json(populated);
    } catch (error) {
        console.error("createProject error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/projects/:id
export async function updateProject(req, res) {
    try {
        const { title, description, icon, color } = req.body;
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (icon !== undefined) updateData.icon = icon;
        if (color !== undefined) updateData.color = color;

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, owner: req.userId },
            updateData,
            { new: true, runValidators: true }
        ).populate('owner', 'name username avatar')
         .populate('collaborators', 'name username avatar');

        if (!project) return res.status(404).json({ message: "Project not found or not owner" });
        return res.json(project);
    } catch (error) {
        console.error("updateProject error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/projects/:id
export async function deleteProject(req, res) {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.userId });
        if (!project) return res.status(404).json({ message: "Project not found or not owner" });

        await moveToTrash({
            userId: req.userId,
            itemType: "project",
            item: project,
            displayName: project.title,
            icon: project.icon || "🚀"
        });

        // Clean up related invites
        await CollabInvite.deleteMany({ project: req.params.id });

        return res.json({ message: "Project deleted" });
    } catch (error) {
        console.error("deleteProject error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/projects/:id/invite — invite a user by username
export async function inviteCollaborator(req, res) {
    try {
        const { username } = req.body;
        if (!username?.trim()) return res.status(400).json({ message: "Username is required" });

        const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
        if (!project) return res.status(404).json({ message: "Project not found or not owner" });

        const targetUser = await User.findOne({ username: username.trim() });
        if (!targetUser) return res.status(404).json({ message: "User not found" });

        if (targetUser._id.toString() === req.userId) {
            return res.status(400).json({ message: "You cannot invite yourself" });
        }

        // Check if already a collaborator
        if (project.collaborators.some(c => c.toString() === targetUser._id.toString())) {
            return res.status(409).json({ message: "User is already a collaborator" });
        }

        // Check if invite already pending
        const existingInvite = await CollabInvite.findOne({
            from: req.userId,
            to: targetUser._id,
            project: project._id,
            status: 'pending'
        });
        if (existingInvite) {
            return res.status(409).json({ message: "Invite already sent to this user" });
        }

        const invite = await CollabInvite.create({
            from: req.userId,
            to: targetUser._id,
            project: project._id
        });

        const populated = await CollabInvite.findById(invite._id)
            .populate('from', 'name username avatar')
            .populate('project', 'title icon color');

        return res.status(201).json(populated);
    } catch (error) {
        console.error("inviteCollaborator error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/projects/invites/mine — get pending invites for current user
export async function getMyInvites(req, res) {
    try {
        const invites = await CollabInvite.find({ to: req.userId, status: 'pending' })
            .populate('from', 'name username avatar')
            .populate('project', 'title icon color description')
            .sort({ createdAt: -1 });

        return res.json(invites);
    } catch (error) {
        console.error("getMyInvites error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// GET /api/projects/:id/invites — get sent invites for a project (owner only)
export async function getProjectInvites(req, res) {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        });
        if (!project) return res.status(404).json({ message: "Project not found" });

        const invites = await CollabInvite.find({ project: req.params.id })
            .populate('from', 'name username avatar')
            .populate('to', 'name username avatar')
            .sort({ createdAt: -1 });

        return res.json(invites);
    } catch (error) {
        console.error("getProjectInvites error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PATCH /api/projects/invites/:inviteId — accept or reject
export async function respondToInvite(req, res) {
    try {
        const { action } = req.body; // 'accept' or 'reject'
        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({ message: "Action must be 'accept' or 'reject'" });
        }

        const invite = await CollabInvite.findOne({ _id: req.params.inviteId, to: req.userId, status: 'pending' });
        if (!invite) return res.status(404).json({ message: "Invite not found" });

        if (action === 'accept') {
            invite.status = 'accepted';
            await invite.save();

            // Add user to project collaborators
            await Project.findByIdAndUpdate(invite.project, {
                $addToSet: { collaborators: req.userId }
            });

            return res.json({ message: "Invite accepted! You are now a collaborator." });
        } else {
            invite.status = 'rejected';
            await invite.save();
            return res.json({ message: "Invite declined." });
        }
    } catch (error) {
        console.error("respondToInvite error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/projects/:id/notes — add a note
export async function addNote(req, res) {
    try {
        const { title, content } = req.body;
        if (!title?.trim()) return res.status(400).json({ message: "Note title is required" });

        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        });
        if (!project) return res.status(404).json({ message: "Project not found" });

        project.notes.push({ title: title.trim(), content: content || '', createdBy: req.userId });
        await project.save();

        const updated = await Project.findById(project._id)
            .populate('notes.createdBy', 'name username avatar');

        return res.status(201).json(updated.notes[updated.notes.length - 1]);
    } catch (error) {
        console.error("addNote error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/projects/:id/notes/:noteId
export async function deleteNote(req, res) {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        });
        if (!project) return res.status(404).json({ message: "Project not found" });

        project.notes.pull(req.params.noteId);
        await project.save();

        return res.json({ message: "Note deleted" });
    } catch (error) {
        console.error("deleteNote error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/projects/:id/notes/:noteId
export async function updateNote(req, res) {
    try {
        const { title, content } = req.body;
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        });
        if (!project) return res.status(404).json({ message: "Project not found" });

        const note = project.notes.id(req.params.noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (title !== undefined) note.title = title.trim();
        if (content !== undefined) note.content = content || '';
        
        await project.save();
        
        const updated = await Project.findById(project._id)
            .populate('notes.createdBy', 'name username avatar');
            
        return res.json(updated.notes.id(req.params.noteId));
    } catch (error) {
        console.error("updateNote error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/projects/:id/collections — add a collection
export async function addProjectCollection(req, res) {
    try {
        const { name, icon } = req.body;
        if (!name?.trim()) return res.status(400).json({ message: "Collection name is required" });

        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        });
        if (!project) return res.status(404).json({ message: "Project not found" });

        project.collections.push({ name: name.trim(), icon: icon || '📁', createdBy: req.userId });
        await project.save();

        const updated = await Project.findById(project._id)
            .populate('collections.createdBy', 'name username avatar');

        return res.status(201).json(updated.collections[updated.collections.length - 1]);
    } catch (error) {
        console.error("addProjectCollection error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE /api/projects/:id/collections/:collectionId
export async function deleteProjectCollection(req, res) {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        });
        if (!project) return res.status(404).json({ message: "Project not found" });

        project.collections.pull(req.params.collectionId);
        await project.save();

        return res.json({ message: "Collection deleted" });
    } catch (error) {
        console.error("deleteProjectCollection error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// PUT /api/projects/:id/collections/:collectionId
export async function updateProjectCollection(req, res) {
    try {
        const { name, icon } = req.body;
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.userId }, { collaborators: req.userId }]
        });
        if (!project) return res.status(404).json({ message: "Project not found" });

        const col = project.collections.id(req.params.collectionId);
        if (!col) return res.status(404).json({ message: "Collection not found" });

        if (name !== undefined) col.name = name.trim();
        if (icon !== undefined) col.icon = icon;
        
        await project.save();
        
        const updated = await Project.findById(project._id)
            .populate('collections.createdBy', 'name username avatar');
            
        return res.json(updated.collections.id(req.params.collectionId));
    } catch (error) {
        console.error("updateProjectCollection error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// POST /api/projects/:id/leave — collaborator leaves
export async function leaveProject(req, res) {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            collaborators: req.userId
        });
        if (!project) return res.status(404).json({ message: "Project not found or you are not a collaborator" });

        project.collaborators.pull(req.userId);
        await project.save();

        return res.json({ message: "You have left the project" });
    } catch (error) {
        console.error("leaveProject error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}
