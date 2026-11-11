import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { setupSocketIO } from './sockets/socket.server.js';
import { binanceWS } from './integrations/binance/binance.ws.js';

const PORT = process.env.PORT || 3001;

// Criar servidor HTTP acoplando o Express
const server = http.createServer(app);

// Inicializa o Socket.IO acoplado ao servidor HTTP
setupSocketIO(server);

server.listen(PORT, () => {
    console.log(`Servidor rodando ... (Porta: ${PORT})`);
    binanceWS.connect();
})