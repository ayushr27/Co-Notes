import express from "express";
import { Login, Register, ForgotPassword, ResetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword);

export default router;