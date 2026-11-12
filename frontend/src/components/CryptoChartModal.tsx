import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { socket } from '../services/socket';
import { type CryptoItem } from './CryptoTable';
import { X, TrendingUp, TrendingDown, Radio } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface CryptoChartModalProps {
  crypto: CryptoItem | null;
  onClose: () => void;
}

interface PricePoint {
  timestamp: number;
  price: number;
  timeStr: string;
}

export function CryptoChartModal({ crypto, onClose }: CryptoChartModalProps) {
  const [data, setData] = useState<PricePoint[]>([]);
  const [currentLivePrice, setCurrentLivePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Busca os dados históricos iniciais (últimas 24h)
  useEffect(() => {
    if (!crypto) return;

    let isMounted = true;
    setLoading(true);

    async function fetchHistory() {
      try {
        const response = await api.get(`/cryptos/${crypto?.id}/history?days=1`);
        if (!isMounted) return;

        const formatted = response.data.map((item: { timestamp: number; price: number }) => ({
          timestamp: item.timestamp,
          price: item.price,
          timeStr: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        setData(formatted);
        if (formatted.length > 0) {
          setCurrentLivePrice(formatted[formatted.length - 1].price);
        }
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [crypto?.id]);

    // 2. Escuta ticks ao vivo do WebSocket e atualiza a ponta do gráfico
  useEffect(() => {
    if (!crypto) return;

    const symbolPair = `${crypto.symbol.toUpperCase()}USDT`;

    function onTicker(ticker: { symbol: string; price: number; timestamp: number }) {
      if (ticker.symbol === symbolPair) {
        setCurrentLivePrice(ticker.price);

        setData((prev) => {
          if (prev.length === 0) return prev;
          
          // Pega o último ponto do histórico e atualiza apenas o preço dele com o tick ao vivo
          const lastIndex = prev.length - 1;
          const updatedLastPoint = {
            ...prev[lastIndex],
            price: ticker.price,
          };

          const newArr = [...prev];
          newArr[lastIndex] = updatedLastPoint;
          return newArr;
        });
      }
    }

    socket.on('crypto:ticker', onTicker);
    return () => {
      socket.off('crypto:ticker', onTicker);
    };
  }, [crypto?.symbol]);

  // AGORA SIM: Se não houver moeda selecionada, não renderiza nada
  if (!crypto) return null;

  const activePrice = currentLivePrice ?? crypto.current_price;
  const isPositive = crypto.price_change_percentage_24h >= 0;
  const strokeColor = isPositive ? '#10b981' : '#f43f5e';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header do Modal */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={crypto.image} alt={crypto.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">{crypto.name}</h2>
                <span className="text-xs uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  {crypto.symbol}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Radio className="w-3 h-3 animate-pulse" /> Live WebSocket
                </span>
              </div>
              <p className="text-xs text-slate-400">Preço e Gráfico em Tempo Real (24h)</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-slate-100 ">
              ${activePrice.toLocaleString('en-US', { minimumFractionDigits: 5 })}
            </div>
            <div
              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {crypto.price_change_percentage_24h?.toFixed(3)}% (24h)
            </div>
          </div>
        </div>

        {/* Área do Gráfico */}
        <div className="h-80 w-full pt-6">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Carregando gráfico em tempo real...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timeStr"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={['auto', 'auto']}
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  orientation="right"
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Preço']}
                  labelFormatter={(label) => `Horário: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={strokeColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#priceGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}