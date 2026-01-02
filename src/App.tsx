import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage, ClaimGuidePage } from './pages';

function App() {
  return (
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
  );
}

export default App;
