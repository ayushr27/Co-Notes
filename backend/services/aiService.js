import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const getGeminiClient = () => {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not found in environment variables");
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const getGroqClient = () => {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not found in environment variables");
    return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

async function generateWithGemini(prompt) {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function generateWithGroq(prompt) {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
    });
    return completion.choices[0]?.message?.content || "";
}

export async function generateContent(prompt) {
    try {
        console.log("Attempting to generate with Gemini...");
        const result = await generateWithGemini(prompt);
        return result;
    } catch (error) {
        console.error("Gemini failed, falling back to Groq. Error:", error.message);
        try {
            console.log("Attempting to generate with Groq...");
            const result = await generateWithGroq(prompt);
            return result;
        } catch (groqError) {
            console.error("Groq also failed. Error:", groqError.message);
            throw new Error("Both Gemini and Groq failed to generate content.");
        }
    }
}
