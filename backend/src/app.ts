import express from 'express';
import cors from 'cors';
import { prisma } from './shared/prisma.js';
import cryptoRoutes from './modules/cryptos/crypto.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cryptos', cryptoRoutes);
app.use('/api/auth', authRoutes)

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
