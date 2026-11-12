import { useEffect, useState } from 'react';
import { socket } from '../services/socket';
import { Wifi } from 'lucide-react';

interface TickerData {
  symbol: string;
  price: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

export function TickerBar() {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }

    function onTicker(data: TickerData) {
      setTickers((prev) => ({
        ...prev,
        [data.symbol]: data,
      }));
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('crypto:ticker', onTicker);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('crypto:ticker', onTicker);
    };
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Wifi className={`w-3.5 h-3.5 ${connected ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span className="text-slate-400 font-medium">
            {connected ? 'Binance Stream Ativo' : 'Conectando ao Stream...'}
          </span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto">
          {Object.values(tickers).map((ticker) => (
            <div key={ticker.symbol} className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">{ticker.symbol.replace('USDT', '')}</span>
              <span className="font-mono text-slate-100">
                ${ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}