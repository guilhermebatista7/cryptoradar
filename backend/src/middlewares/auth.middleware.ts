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
    let token = req.cookies?.token;

    if(!token){
        res.status(401).json({ error: 'Não autenticado '});
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}