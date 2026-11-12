import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { prisma } from "../../shared/prisma.js";

const authRoutes = Router();

authRoutes.post('/register', (req, res) => authController.register(req, res));
authRoutes.post('/login', (req, res) => authController.login(req, res));
authRoutes.post('/logout', (req, res) => authController.logout(req, res));

//Rota protegida
authRoutes.get('/me', authMiddleware, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {id: req.userId},
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        }
    });
    res.json({ user });
})

export default authRoutes;