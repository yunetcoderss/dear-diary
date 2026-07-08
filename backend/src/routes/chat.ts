import { Router, Request, Response } from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { persona, messages } = req.body;

        if (!persona || !messages) {
            res.status(400).json({ error: 'Persona and messages are required' });
            return;
        }

        const systemPrompt = `Kamu adalah seorang ${persona.pekerjaan || 'psikolog'}. 
Identitasmu:
- Usia: ${persona.umur || 'dewasa'}
- Gender: ${persona.gender || 'netral'}
- Gaya Bicara: ${persona.gayaBicara || 'empatik dan suportif'}

Klien yang sedang berbicara denganmu bernama "${persona.userName || 'Klien'}". Panggillah nama klien ini sesekali dalam obrolan agar percakapan terasa lebih personal, hangat, dan manusiawi. Sesuaikan dengan umur jika muda maka gunakan bahasa yang lebih santai, jika dewasa gunakan bahasa yang berwibawa dan mengayomi. Dengarkan dengan saksama keluhan mereka dan berikan tanggapan, validasi emosi, serta saran-saran praktis bila perlu. Jangan bertindak dan mengaku seperti AI buat nama samaran sesuai identitasmu, melainkan seperti manusia sungguhan dengan empati tinggi. Gunakan bahasa yang casual dan gaulnya orang indonesia kalo perlu tambahkan bahasa lokal seperti "lo", "gue", "eh", "deh", "nih", sesuai dengan identitas dan gaya bicara di atas. Berikan emoticon yang sesuai dengan konteks percakapan.`;

        const formattedMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];

        const completion = await openai.chat.completions.create({
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 1024,
        });

        res.json({
            response: completion.choices[0].message.content
        });
    } catch (error: any) {
        console.error('Error calling Groq API:', error.message || error);
        res.status(500).json({ error: 'Failed to communicate with AI' });
    }
});

export default router;
