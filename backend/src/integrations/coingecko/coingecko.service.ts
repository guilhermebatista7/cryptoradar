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

export interface CryptoHistoryPoint {
  timestamp: number;
  price: number;
}

export interface CryptoMarketChartResponse {
  prices: [number, number][]; // [timestamp, preco]
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

  // Histórico de preços para o gráfico
  async getCryptoHistory(coinId: string, vsCurrency = 'usd', days = 7): Promise<CryptoHistoryPoint[]> {
    const response = await coinGeckoClient.get<CryptoMarketChartResponse>(
      `/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: vsCurrency,
          days: days,
        }
      }
    );

    return response.data.prices.map(([timestamp, price]) => ({
      timestamp,
      price
    }));
  }

  // Detalhes completos da moeda
  async getCryptoDetails(coinId: string) {
    const response = await coinGeckoClient.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
    });

    const data = response.data;
    return {
      id: data.id,
      symbol: data.symbol,
      name: data.name, 
      description: data.description?.en || '',
      image: data.image?.large,
      genesis_date: data.genesis_date,
      market_cap_rank: data.market_cap_rank,
      current_price_usd: data.market_data?.current_price?.usd,
      high_24h_usd: data.market_data?.high_24h?.usd,
      low_24h_usd: data.market_data?.low_24h?.usd,
      price_change_percentage_24h: data.market_data?.price_change_percentage_24h,
      price_change_percentage_7d: data.market_data?.price_change_percentage_7d,
      price_change_percentage_30d: data.market_data?.price_change_percentage_30d,
    }
  }
}

export const coinGeckoService = new CoinGeckoService();