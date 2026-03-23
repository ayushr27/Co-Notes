import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function list() {
    console.log("=== GROQ MODELS ===");
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const models = await groq.models.list();
        console.log(models.data.map(m => m.id).join(', '));
    } catch(e) { console.error(e.message); }

    console.log("\n=== GEMINI MODELS ===");
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await res.json();
        console.log("Gemini models fetched.");
        if (data.models) {
            console.log(data.models.map(m => m.name).join(', '));
        } else {
            console.log(data);
        }
    } catch(e) { console.error(e.message); }
}
list();
