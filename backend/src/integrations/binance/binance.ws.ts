import WebSocket from 'ws';
import { getIO } from '../../sockets/socket.server.js';

interface BinanceMiniTickerPayload {
    e: string; // Event type (ex: 24hrMiniTicker)
    E: string; // Event time
    s: string; // Symbol (ex: BTCUSDT)
    c: string; // Current / Close price
    o: string; // Open price
    h: string; // High price
    l: string; // Low price
    v: string; // Total traded base asset volume
    q: string; // Total traded quote asset volume
}

export class BinanceWebSocketService {
    private ws: WebSocket | null = null;

    // Pares que queremos monitorar ao vivo
    private symbols = ['btcusdt', 'ethusdt', 'solusdt'];

    // Monta a URL para múltiplos streams combinados
    // Ex: wss://stream.binance.com:9443/stream?streams=btcusdt@miniTicker/ethusdt@miniTicker/solusdt@miniTicker
    connect() {
        const streamsParam = this.symbols.map((s) => `${s}@miniTicker`).join('/');
        const url = `wss://stream.binance.com:9443/stream?streams=${streamsParam}`;

        console.log('Conectando ao WebSocket da Binance');
        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            console.log('Conectado ao stream da Binance');
        });

        this.ws.on('message', (rawData: WebSocket.RawData) => {
            try {
                const message = JSON.parse(rawData.toString());
                // No formato multi-stream da Binance, os dados ficam em message.data
                const ticker: BinanceMiniTickerPayload = message.data;

                if (!ticker || !ticker.s) return;

                const formattedTicker = {
                    symbol: ticker.s,
                    price: parseFloat(ticker.c),
                    high24h: parseFloat(ticker.h),
                    low24h: parseFloat(ticker.l),
                    timestamp: ticker.E,
                }

                // Repassa o preço em tempo real para todos os clientes do nosso app!
                try {
                    const io = getIO();
                    io.emit('crypto:ticker', formattedTicker);
                } catch {
                    // Socket.IO ainda não pronto
                }
            } catch (err) {
                console.error('Erro ao processar mensagem da Binance:', err);
            }

        });

        this.ws.on('error', (error) => {
            console.error('⚠️ Erro no WebSocket da Binance:', error.message);
        });
        // Reconexão automática em caso de queda de rede
        this.ws.on('close', () => {
            console.warn('⚠️ Conexão com a Binance fechada. Tentando reconectar em 5 segundos...');
            setTimeout(() => this.connect(), 5000);
        });
    }
}

export const binanceWS = new BinanceWebSocketService();