import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../services/emailService.js";

function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function Register(req, res) {
    const email = req.body.email?.toLowerCase().trim();
    const name = req.body.name?.trim();
    const username = req.body.username?.toLowerCase().trim();
    const password = req.body.password;

    // Basic validation
    if (!email || !name || !password || !username) {
        return res.status(400).json({ message: "Please provide all required fields (name, username, email, password)" });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" });
    }
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ message: "Username must be between 3 and 30 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name,
            username: username,
            email: email,
            password: hashedPassword
        });

        const token = generateToken(user.id);

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error creating user:", error.message);

        // Mongoose duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function Login(req, res) {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = generateToken(user.id);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
                location: user.location,
                website: user.website,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function ForgotPassword(req, res) {
    const email = req.body.email?.toLowerCase().trim();
    if (!email) {
        return res.status(400).json({ message: "Please provide an email address" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Return success even if user not found for security purposes
            return res.status(200).json({ message: "If that email is registered, a password reset link has been generated." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        try {
            const clientUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
            const resetPasswordPath = process.env.RESET_PASSWORD_PATH || '/reset-password.html';
            const normalizedResetPath = resetPasswordPath.startsWith('/') ? resetPasswordPath : `/${resetPasswordPath}`;
            const resetUrl = `${clientUrl}${normalizedResetPath}?token=${encodeURIComponent(resetToken)}`;

            await sendPasswordResetEmail(user.email, resetUrl);
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            return res.status(500).json({ message: "Unable to send reset email right now. Please try again shortly." });
        }

        return res.status(200).json({ 
            message: "If that email is registered, a password reset link has been sent to it."
        });
    } catch (error) {
        console.error("Forgot password error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function ResetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: "Invalid request. Token and new password are required." });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // token not expired
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Password has been successfully reset" });
    } catch (error) {
        console.error("Reset password error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}