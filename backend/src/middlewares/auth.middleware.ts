import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

interface JwtPayload{
    userId: string;
}

//Extende a tipagem do Request do Express para aceitar req.userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export function authMiddleware( req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(401).json({ error: 'Token não fornecido' });
        return;
    }

    const parts = authHeader.split(' ');
    if(parts.length !== 2 || parts[0] !== 'Bearer'){
        res.status(401).json({ error: 'Formato de token inválido '});
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}