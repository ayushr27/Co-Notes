import { generateContent } from '../services/aiService.js';

export const generateIdea = async (req, res) => {
    try {
        const { topic } = req.body;
        
        let prompt = "Generate a single, brilliant, and creative idea for a project, article, or startup. Provide only the idea title and a short description. Format the response such that the first line is the title, and the rest is the description.";
        if (topic && topic.trim() !== '') {
            prompt = `Generate a single, brilliant, and creative idea related to: "${topic}". Provide only the idea title and a short description. Format the response such that the first line is the title, and the rest is the description.`;
        }

        const aiResponse = await generateContent(prompt);
        
        // Parse title and description
        const lines = aiResponse.split('\n').filter(line => line.trim() !== '');
        const title = lines[0].replace(/^[\*\#\-\d\.\s]+/, '').trim(); // Remove markdown bullets/formatting
        const description = lines.slice(1).join('\n').trim();

        res.json({ title, description });
    } catch (error) {
        res.status(500).json({ message: "Failed to generate idea", error: error.message });
    }
};

export const generateArticle = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!title && !description) {
            return res.status(400).json({ message: "Please provide a title or description for the article." });
        }

        const prompt = `Write a comprehensive, engaging, and well-structured article based on the following:
Title: ${title || 'Not provided'}
Description: ${description || 'Not provided'}
        
The article should have a clear introduction, body paragraphs with formatting (if applicable), and a conclusion.`;

        const articleContent = await generateContent(prompt);

        res.json({ content: articleContent });
    } catch (error) {
        res.status(500).json({ message: "Failed to generate article", error: error.message });
    }
};
