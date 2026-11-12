import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../services/api";

export interface User{
    id: string;
    nome: string;
    email: string;
}

interface AuthContextData {
    user: User | null;
    loading: boolean;
    login: (email: string, senha: string) => Promise<void>;
    register: (nome: string, email: string, senha: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider( { children }: { children: ReactNode }){

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function checkAuth(){
            try {
                const response = await api.get('/auth/me');
                setUser(response.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    async function login(email: string, password: string){
        const response = await api.post('/auth/login', {email, password});
        setUser(response.data.user);
    }

    async function register(name: string, email: string, password: string){
        const response = await api.post('/auth/register', {name, email, password});
        setUser(response.data.user);
    }

    async function logout() {
        await api.post('/auth/logout');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}