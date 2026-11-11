import { Request, Response } from 'express';
import { loginSchema, registerSchema } from './auth.schema.js';
import { authService } from './auth.service.js';
import { ZodError } from 'zod';

export class AuthController {
    async register(req: Request, res: Response){
        try {
            const data = registerSchema.parse(req.body);
            const result = await authService.register(data);
            res.status(201).json(result);
        } catch (error: any) {
            if(error instanceof ZodError){
                res.status(400).json({ erros: error.issues });
                return;
            }
            res.status(400).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response){
        try {
            const data = loginSchema.parse(req.body);
            const result = await authService.login(data);
            res.status(200).json(result);
        } catch (error: any) {
            if(error instanceof ZodError){
                res.status(400).json({ errors: error.issues });
                return;
            }
            res.status(401).json({ error: error.message });
        }
    }
}

export const authController = new AuthController();