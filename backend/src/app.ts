import express from 'express';
import cors from 'cors';
import { prisma } from './shared/prisma.js';

const app = express();

app.use(cors());
app.use(express.json());

//Rota de teste
app.get('/health', async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        res.json({
            status: 200,
            database: 'connceted',
            usersInDb: userCount,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

export default app;
