import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}

export async function requireAdmin(req, res, next) {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Server error verifying admin status" });
    }
}
