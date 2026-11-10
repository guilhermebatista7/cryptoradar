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
    };

    async getDetails(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'ID da criptomoeda inválido' });
            }

            const data = await coinGeckoService.getCryptoDetails(id);
            res.json(data);
        } catch (error) {
            res.status(502).json({ error: 'Falha ao buscar detalhes da criptomoeda' });
        }
    }

    async getHistory(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: 'ID da criptomoeda inválido' });
            }

            const days = req.query.days ? Number(req.query.days) : 7;
            const currency = (req.query.currency as string) || 'usd';

            const data = await coinGeckoService.getCryptoHistory(id, currency, days);
            res.json(data)
        } catch (error) {
            res.status(502).json({ error: 'Erro ao buscar histórico da moeda' });
        }
    }
}

export const cryptoController = new CryptoController();