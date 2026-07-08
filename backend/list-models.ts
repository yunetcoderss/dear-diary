import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY || 'dummy_key_if_not_provided',
    baseURL: 'https://api.groq.com/openai/v1',
});

async function main() {
    try {
        const models = await openai.models.list();
        console.log("Available models:");
        for (const model of models.data) {
            console.log(model.id);
        }
    } catch (e) {
        console.error("Error fetching models", e);
    }
}

main();
