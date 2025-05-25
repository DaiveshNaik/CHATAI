require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Gemini AI
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    // This log will appear in Netlify Function logs if the key is missing from environment variables.
    // The application will fail when trying to use genAI if the key is truly not set.
    console.error("CRITICAL: GEMINI_API_KEY is not set in the environment variables. The application will not be able to connect to the Gemini API.");
}

// Initialize genAI. If apiKey is undefined here (because it wasn't set in Netlify's environment),
// the constructor or subsequent API calls will likely throw an error,
// which should be caught by the try/catch block in your API route.
const genAI = new GoogleGenerativeAI(apiKey); // Use the apiKey variable from process.env

// Initialize chat history with a formatting instruction
let chatHistory = [ // Changed from const to let
    {
        role: "user",
        parts: [{ text: "You are ChatAI, a highly versatile AI assistant. Your capabilities include: \n1. General conversation and information retrieval. \n2. Code generation and suggestions in various programming languages. \n3. Answering questions about a codebase (users will provide code snippets, often prefixed with instructions like 'Fix the following code snippet:' or 'Explain this:'). \n4. Summarizing text or documents. \n5. Assisting with debugging by analyzing code and error messages. \n6. Creative writing, brainstorming, and problem-solving. \nAlways aim to understand the user's intent from their full message. Please provide structured and to-the-point answers. Use Markdown for formatting, especially for code blocks." }]
    },
    {
        role: "model",
        parts: [{ text: "Okay, I understand. I am ChatAI, ready to assist with a wide range of tasks. I will use Markdown for all my responses, especially for code blocks, and interpret instructions from your messages. How can I help you today?" }]
    }
    // Actual conversation will be appended after this
];

app.post('/api/chat', async (req, res) => {
    const userMessageContent = req.body.message; // Renamed for clarity

    if (!userMessageContent) {
        return res.status(400).json({ error: 'No message provided' });
    }

    console.log('Received user message:', userMessageContent);

    try {
        const historyForApiCall = JSON.parse(JSON.stringify(chatHistory));

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const chat = model.startChat({
            history: historyForApiCall, 
            generationConfig: {
                maxOutputTokens: 500,
            }
        });

        const result = await chat.sendMessage(userMessageContent);
        const aiResponse = await result.response;
        const aiReplyText = aiResponse.text();

        console.log('Sending AI reply:', aiReplyText);

        // Update chatHistory by creating a new array
        const newMessages = [
            { role: "user", parts: [{ text: userMessageContent }] },
            { role: "model", parts: [{ text: aiReplyText }] }
        ];
        let currentFullHistory = [...chatHistory, ...newMessages];

        // Trim chatHistory
        const maxConversationPairs = 10; // Max number of user/model message *pairs*
        const systemPromptsCount = 2; // Initial system prompts (user role, model role)
                                      // These are the first two entries in chatHistory
        
        // Total messages to keep: system prompts + (pairs * 2 messages per pair)
        const totalMessagesToKeep = systemPromptsCount + (maxConversationPairs * 2);

        if (currentFullHistory.length > totalMessagesToKeep) {
            // Separate system prompts from actual conversation
            const systemPrompts = currentFullHistory.slice(0, systemPromptsCount);
            const conversationHistory = currentFullHistory.slice(systemPromptsCount);
            
            // Keep only the most recent 'maxConversationPairs * 2' messages from the conversation
            const trimmedConversation = conversationHistory.slice(-(maxConversationPairs * 2));
            
            chatHistory = [...systemPrompts, ...trimmedConversation];
        } else {
            chatHistory = currentFullHistory;
        }
        
        res.json({ reply: aiReplyText });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        let errorMessage = 'Failed to get response from AI.';
        if (error instanceof Error) {
            errorMessage += ` ${error.message}`;
        }
        
        if (error.message && error.message.includes('API key not valid')) {
             res.status(401).json({ error: 'Gemini API key is not valid. Please check your .env file.' });
        } else if (error.message && error.message.includes('quota')) {
            res.status(429).json({ error: 'You have exceeded your Gemini API quota.' });
        } else if (error.message && (error.message.includes('404 Not Found') || error.message.toLowerCase().includes('model not found'))) {
            res.status(404).json({ error: 'The specified AI model was not found. Please check the model name in the server configuration or ensure your API key has access to it.' });
        }
        else {
            res.status(500).json({ error: errorMessage });
        }
    }
});

// Remove or comment out the app.listen() part for Netlify deployment
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

module.exports.handler = serverless(app);