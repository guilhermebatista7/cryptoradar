import { useState } from 'react';
import { CryptoTable, type CryptoItem } from './components/CryptoTable';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Wallet } from './components/Wallet';

export default function App() {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoItem | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout selectedCrypto={selectedCrypto} onCloseCrypto={() => setSelectedCrypto(null)}/>}>
          <Route index element={<CryptoTable onSelectCrypto={(crypto) => setSelectedCrypto(crypto)}/>}/>
            <Route path="wallet" element={<Wallet/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}