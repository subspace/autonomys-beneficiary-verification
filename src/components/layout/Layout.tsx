import { WalletButton, WalletModal } from '@autonomys/auto-wallet-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  showWallet?: boolean;
}

export function Layout({ children, showWallet = true }: LayoutProps) {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/subspace-logo.png" 
              alt="Subspace Foundation" 
              className="h-10 w-10 flex-shrink-0"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Autonomys Beneficiary Portal
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Operated by the Subspace Foundation
              </p>
            </div>
          </div>
          {showWallet && (
            <WalletButton onOpenModal={() => setWalletModalOpen(true)} />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Wallet Connection Modal */}
      {showWallet && (
        <WalletModal
          open={walletModalOpen}
          onOpenChange={setWalletModalOpen}
        />
      )}
    </div>
  );
}
