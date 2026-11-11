import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma.js";
import { LoginInput, RegisterInput } from "./auth.schema.js";
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export class AuthService{
    async register(data: RegisterInput){
        const existeUser = await prisma.user.findUnique({
            where: {email : data.email},
        });

        if(existeUser){
            throw new Error('E-mail já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        })

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {expiresIn: '7d' });

        return { user, token};
    }

    async login(data: LoginInput){
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user){
            throw new Error('Credenciais inválidas');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if(!isPasswordValid){
            throw new Error('Credenciais inválidas');
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        }
    }
}

export const authService = new AuthService();