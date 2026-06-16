import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from '@autonomys/auto-wallet-react';
import { Layout } from './components/layout';
import { HomePage, ClaimGuidePage, StakingGuidePage, XdmGuidePage, WrapGuidePage } from './pages';

function App() {
  return (
    <WalletProvider config={{
      dappName: 'Autonomys Beneficiary Verification',
      storageKey: 'autonomys-beneficiary-wallet',
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
          <Route
            path="/stake"
            element={
              <Layout showWallet={false}>
                <StakingGuidePage />
              </Layout>
            }
          />
          {/* Redirect the previous /staking route to /stake so existing links keep working */}
          <Route path="/staking" element={<Navigate to="/stake" replace />} />
          <Route
            path="/xdm"
            element={
              <Layout showWallet={false}>
                <XdmGuidePage />
              </Layout>
            }
          />
          <Route
            path="/wrap"
            element={
              <Layout showWallet={false}>
                <WrapGuidePage />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
