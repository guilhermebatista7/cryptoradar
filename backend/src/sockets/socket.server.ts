import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function setupSocketIO(httpServer: HttpServer): SocketIOServer {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`Novo cliente conectado via websocket: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
}

export function getIO(): SocketIOServer{
    if(!io){
        throw new Error('Socket.IO ainda não foi inicializado');
    }

    return io;
}