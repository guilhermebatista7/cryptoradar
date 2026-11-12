import { Activity, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="flex items-center gap-2 text-3xl font-bold text-sky-400">
        <Activity className="w-8 h-8 animate-pulse text-sky-400" />
        CryptoRadar
      </div>
      <p className="text-slate-400 text-sm">Plataforma de Monitoramento em Tempo Real</p>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 text-sm">
        <ShieldCheck className="w-4 h-4" />
        Vite + React + Tailwind v4 funcionando!
      </div>
    </div>
  );
}