import { Request, Response } from 'express';
import { coinGeckoService } from '../../integrations/coingecko/coingecko.service.js';

export class CryptoController {
    async getTop(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const currency = (req.query.currency as string) || 'usd';
            const data = await coinGeckoService.getTopCryptos(currency, limit);
            res.json(data);
        } catch (error: any) {
            console.error('Erro ao buscar dados na CoinGecko:', error.message);
            res.status(502).json({
                error: 'Falha ao buscar dados do mercado de criptomoedas',
            });
        }
    }
}

export const cryptoController = new CryptoController();