import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { TrendingDown, TrendingUp, RefreshCw, Radio } from 'lucide-react';

export interface CryptoItem {
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

// Moedas do Top 10 com par na Binance
const BINANCE_SUPPORTED_SYMBOLS = ['btc', 'eth', 'bnb', 'usdc', 'xrp', 'sol', 'trx', 'hype'];

interface CryptoTableProps {
  onSelectCrypto: (crypto: CryptoItem) => void;
}

export function CryptoTable({ onSelectCrypto }: CryptoTableProps) {
  const [cryptos, setCryptos] = useState<CryptoItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMarkets() {
    try {
      setLoading(true);
      const response = await api.get('/cryptos/markets?limit=10');
      setCryptos(response.data);
    } catch (err) {
      console.error('Erro ao buscar cotações:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMarkets();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Top Criptomoedas</h2>
          <p className="text-xs text-slate-400">Preços consolidados via CoinGecko</p>
        </div>
        <button
          onClick={fetchMarkets}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 font-medium">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Ativo</th>
              <th className="py-3 px-4 text-right">Preço</th>
              <th className="py-3 px-4 text-right">24h %</th>
              <th className="py-3 px-4 text-right">Volume 24h</th>
              <th className="py-3 px-4 text-right">Valor de Mercado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {cryptos.map((coin) => {
              const isPositive = coin.price_change_percentage_24h >= 0;
              const hasLiveStream = BINANCE_SUPPORTED_SYMBOLS.includes(coin.symbol.toLowerCase());

              return (
                <tr
                  key={coin.id}
                  onClick={() => hasLiveStream && onSelectCrypto(coin)}
                  className={`transition-colors ${
                    hasLiveStream
                      ? 'hover:bg-slate-800/60 cursor-pointer group'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  title={hasLiveStream ? 'Clique para abrir o gráfico ao vivo' : 'Sem par ao vivo na Binance'}
                >
                  <td className="py-3 px-4 text-slate-500 font-sans">{coin.market_cap_rank}</td>
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center gap-3">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{coin.name}</span>
                          {hasLiveStream ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                              <Radio className="w-2.5 h-2.5 animate-pulse" />
                              AO VIVO
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                              Estável
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-100">
                    ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {coin.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    ${coin.total_volume.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    ${coin.market_cap.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}