import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
    getProjects, getProject, createProject, updateProject, deleteProject,
    inviteCollaborator, getMyInvites, getProjectInvites, respondToInvite,
    addNote, deleteNote,
    addProjectCollection, deleteProjectCollection,
    leaveProject
} from "../controllers/projectController.js";

const router = express.Router();

// Project CRUD
router.get("/", authenticateToken, getProjects);
router.post("/", authenticateToken, createProject);

// Invites — must come before /:id routes
router.get("/invites/mine", authenticateToken, getMyInvites);
router.patch("/invites/:inviteId", authenticateToken, respondToInvite);

// Single project
router.get("/:id", authenticateToken, getProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, deleteProject);

// Invite collaborator
router.post("/:id/invite", authenticateToken, inviteCollaborator);
router.get("/:id/invites", authenticateToken, getProjectInvites);

// Notes
router.post("/:id/notes", authenticateToken, addNote);
router.delete("/:id/notes/:noteId", authenticateToken, deleteNote);

// Collections
router.post("/:id/collections", authenticateToken, addProjectCollection);
router.delete("/:id/collections/:collectionId", authenticateToken, deleteProjectCollection);

// Leave project
router.post("/:id/leave", authenticateToken, leaveProject);

export default router;
