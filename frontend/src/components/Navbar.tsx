import { Activity, ChartLineIcon, LogIn, LogOut, User as UserIcon, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onOpenLogin: () => void;
}

export function Navbar({ onOpenLogin }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLive = location.pathname === '/';
  const isWallet = location.pathname === '/wallet';

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              Crypto<span className="text-sky-400">Radar</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                PRO
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 cursor-pointer ${isLive
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 border-slate-700 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/40'
                  }`}
              >
                <ChartLineIcon className="w-3.5 h-3.5" />
                Live
                {isLive && (
                  <span className="w-2 h-2 bg-green-900 rounded-full animate-pulse" />
                )}
              </button>

              <button
                onClick={() => navigate('/wallet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-300 cursor-pointer ${isWallet
                    ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/20'
                    : 'text-slate-400 border-slate-700 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/40'
                  }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                My wallet
              </button>

              <div className="flex items-center gap-2 text-sm text-slate-300">
                <UserIcon className="w-4 h-4 text-sky-400" />
                <span>{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}