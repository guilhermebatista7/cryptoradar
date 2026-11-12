import { Request, Response } from 'express';
import { loginSchema, registerSchema } from './auth.schema.js';
import { authService } from './auth.service.js';
import { ZodError } from 'zod';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 dias em milissegundos
}

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const data = registerSchema.parse(req.body);
            const { user, token } = await authService.register(data);

            //Define cookie seguro no navegador
            res.cookie('token', token, COOKIE_OPTIONS);

            // Retorna apenas os dados do usuário, sem expor o token no corpo
            res.status(201).json(user);
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({ erros: error.issues });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const data = loginSchema.parse(req.body);
            const { user, token } = await authService.login(data);

            res.cookie('token', token, COOKIE_OPTIONS);

            res.status(200).json(user);
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).json({ errors: error.issues });
                return;
            }
            res.status(401).json({ error: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        // Limpa o cookie no logout
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout realizado com sucesso' });
    }
}

export const authController = new AuthController();