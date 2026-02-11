import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from '@autonomys/auto-wallet-react';
import { Layout } from './components/layout';
import { HomePage, ClaimGuidePage } from './pages';

function App() {
  return (
    <WalletProvider config={{
      dappName: 'Autonomys Beneficiary Verification',
      storageKey: 'substrate-wallet-demo-preferences',
      ss58Prefix: 42,
    }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout showWallet={true}>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/claim"
            element={
              <Layout showWallet={false}>
                <ClaimGuidePage />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
