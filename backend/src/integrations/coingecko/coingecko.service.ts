import { coinGeckoClient } from './coingecko.client.js';

export interface CryptoMarketItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export class CoinGeckoService {
  async getTopCryptos(vsCurrency = 'usd', limit = 10): Promise<CryptoMarketItem[]> {
    const response = await coinGeckoClient.get<CryptoMarketItem[]>('/coins/markets', {
      params: {
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
      },
    });

    return response.data;
  }
}

export const coinGeckoService = new CoinGeckoService();