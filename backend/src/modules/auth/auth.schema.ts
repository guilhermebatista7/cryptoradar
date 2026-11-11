import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.email('Formato de e-mail inválido'),
    password: z.string().min(6, 'A sneha deve ter no mínimo 6 caraceteres'),
});

export const loginSchema = z.object({
    email: z.email('Formato de e-mail inválido'),
    password: z.string().min(1, 'A senha é obrigatória'),
});

// Extrai os tipos TypeScript diretamente dos schemas Zod
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;