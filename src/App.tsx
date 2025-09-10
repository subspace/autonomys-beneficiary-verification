import React, { useState } from 'react';
import { WalletButton, WalletModal } from './components/wallet';
import { useWallet } from './hooks/use-wallet';

function App() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { isConnected, selectedAccount, injector } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Substrate Wallet Integration Demo
          </h1>
          <WalletButton onOpenModal={() => setWalletModalOpen(true)} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Wallet Status</h2>
          
          {!isConnected ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallet Connected</h3>
              <p className="text-gray-500 mb-4">
                Connect your Substrate wallet to get started with this demo.
              </p>
              <button
                onClick={() => setWalletModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Wallet Connected</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Successfully connected to your Substrate wallet!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Name</h4>
                  <p className="text-gray-600 font-mono">
                    {selectedAccount?.name || 'Unnamed Account'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Address</h4>
                  <p className="text-gray-600 font-mono text-sm break-all">
                    {selectedAccount?.address}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Account Source</h4>
                  <p className="text-gray-600">
                    {selectedAccount?.source || 'Unknown'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Injector Available</h4>
                  <p className="text-gray-600">
                    {injector ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Your wallet is now connected and ready to use</p>
                  <p>• The injector can be used to sign transactions</p>
                  <p>• Account information is persisted across browser sessions</p>
                  <p>• You can switch accounts using the wallet button dropdown</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Wallet Connection Modal */}
      <WalletModal
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
      />
    </div>
  );
}

export default App;
