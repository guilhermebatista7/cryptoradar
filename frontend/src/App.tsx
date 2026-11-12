import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { CryptoTable, type CryptoItem } from './components/CryptoTable';
import { AuthModal } from './components/AuthModal';
import { CryptoChartModal } from './components/CryptoChartModal';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoItem | null>(null);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar onOpenLogin={() => setIsAuthOpen(false)} />
        <TickerBar />

        <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
          <CryptoTable onSelectCrypto={(crypto) => setSelectedCrypto(crypto)} />
        </main>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        <CryptoChartModal crypto={selectedCrypto} onClose={() => setSelectedCrypto(null)} />
      </div>
    </AuthProvider>
  );
}