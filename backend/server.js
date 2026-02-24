import express from "express";
import cors from "cors"
const app = express();
import authRoutes from './routes/authRoutes.js';

// Middlewares
app.use(cors());
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)

app.listen(3000, ()=>{
    console.log("Listening")
})