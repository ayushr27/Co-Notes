import prisma from "../db.js";
import bcrypt from "bcrypt";

export async function Register(req, res) {
    const email = req.body.email.toLowerCase().trim();
    const name = req.body.name.trim();
    const password = req.body.password;

    // Basic validation
    if (!email || !name || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email)) {
        return res.status(400).json({ message: "Please provide a valid email address" });
    }
    else if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword
            }
        })
        return res.status(201).json({
            message: "User created successfully",
        })

    } catch (error) {
        console.error("Error creating user:", error?.meta?.driverAdapterError?.cause || error.message);

        // prisma unique constraint error code is P2002
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Email already exists"
            })
        }

        else {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    }
}

export async function Login(req, res) {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        })
        if (!user) {
            return res.status(404).json({ 
                message: "User not found"
            });
        }

        const hashedPassword = user.password;
        const passwordCheck = await bcrypt.compare(password, hashedPassword);
        if(!passwordCheck) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}