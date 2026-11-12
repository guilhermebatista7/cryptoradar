import WebSocket from 'ws';
import { getIO } from '../../sockets/socket.server.js';

interface BinanceTradePayload {
    e: string; // "trade"
    E: number; // Event time
    s: string; // Symbol ex: "BTCUSDT"
    p: string; // Price ex: "71850.50"
    q: string; // Quantity
    T: number; // Trade time
    m: boolean; // Is the buyer the market maker?
}

export class BinanceWebSocketService {
    private ws: WebSocket | null = null;
    // Pares exatos da Binance para o Top 10 exibido
    private symbols = [
        'btcusdt',   // 1. Bitcoin (BTC)
        'ethusdt',   // 2. Ethereum (ETH)
        'bnbusdt',   // 4. BNB (BNB)
        'usdcusdt',  // 5. USDC (USDC)
        'xrpusdt',   // 6. XRP (XRP)
        'solusdt',   // 7. Solana (SOL)
        'trxusdt',   // 8. TRON (TRX)
        'hypeusdt',  // 10. Hyperliquid (HYPE)
    ];
    connect() {
        // Usamos @trade para velocidade instantânea (a cada negociação executada)
        const streamsParam = this.symbols.map((s) => `${s}@trade`).join('/');
        const url = `wss://stream.binance.com:9443/stream?streams=${streamsParam}`;

        console.log('🔄 Conectando ao WebSocket de Alta Frequência da Binance (@trade)...');
        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            console.log('⚡ Conectado ao stream @trade da Binance (Ticks Instantâneos)!');
        });

        this.ws.on('message', (rawData: WebSocket.RawData) => {
            try {
                const message = JSON.parse(rawData.toString());
                const trade: BinanceTradePayload = message.data;

                if (!trade || !trade.s) return;

                const formattedTicker = {
                    symbol: trade.s,
                    price: parseFloat(trade.p),
                    timestamp: trade.T,
                };

                // Repassa instantaneamente para o frontend
                try {
                    const io = getIO();
                    io.emit('crypto:ticker', formattedTicker);
                } catch {
                    // Socket.IO não pronto
                }
            } catch (err) {
                console.error('Erro ao processar trade da Binance:', err);
            }
        });

        this.ws.on('error', (error) => {
            console.error('⚠️ Erro no WebSocket da Binance:', error.message);
        });

        this.ws.on('close', () => {
            console.warn('⚠️ Conexão Binance encerrada. Reconectando em 3s...');
            setTimeout(() => this.connect(), 3000);
        });
    }
}

export const binanceWS = new BinanceWebSocketService();