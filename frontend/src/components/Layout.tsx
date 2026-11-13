import { useState } from "react";
import { Navbar } from "./Navbar";
import { TickerBar } from "./TickerBar";
import { Outlet } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import { CryptoChartModal } from "./CryptoChartModal";
import { AuthProvider } from "../contexts/AuthContext";
import type { CryptoItem } from "./CryptoTable";

interface LayoutProps{
    selectedCrypto: CryptoItem | null;
    onCloseCrypto: () => void;
}

export function Layout({selectedCrypto, onCloseCrypto}: LayoutProps) {
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <AuthProvider>
            <div className="app-container">
                <Navbar onOpenLogin={() => setIsAuthOpen(true)} />
                <TickerBar />

                <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
                    <Outlet />
                </main>

                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
                <CryptoChartModal crypto={selectedCrypto} onClose={onCloseCrypto} />
            </div>
        </AuthProvider>
    )
}