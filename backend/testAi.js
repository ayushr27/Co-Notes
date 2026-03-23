import dotenv from 'dotenv';
dotenv.config();
import { generateContent } from './services/aiService.js';

async function test() {
    console.log("Testing AI generation...");
    try {
        const result = await generateContent("Say hello world in 3 words.");
        console.log("Success! Result:", result);
    } catch (e) {
        console.error("Test failed:", e);
    }
}

test();
