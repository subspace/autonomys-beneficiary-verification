import { useState } from 'react';
import { WalletButton, WalletModal } from './components/wallet';
import { VerificationForm } from './components/verification';
import { useWallet } from './hooks/use-wallet';
import { ChevronDown } from 'lucide-react';
import { address } from '@autonomys/auto-utils';

function App() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletTypesExpanded, setWalletTypesExpanded] = useState(false);
  const { isConnected, selectedAccount } = useWallet();

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
                Autonomys Beneficiary Address Verification
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Operated by the Subspace Foundation
              </p>
            </div>
          </div>
          <WalletButton onOpenModal={() => setWalletModalOpen(true)} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Welcome to the Autonomys Network Beneficiary Address Association Portal
            </h2>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-4">
                As part of the Autonomys token distribution process, every stakeholder must designate an EVM beneficiary wallet to receive vested tokens.
              </p>
              
              <p className="text-gray-700 mb-4">
              To ensure security, we need to confirm that the EVM address you provide is genuinely linked to the Autonomys (SS58) account you are connected with. This is achieved by submitting a simple on-chain transaction from your SS58 wallet.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <button
                  onClick={() => setWalletTypesExpanded(!walletTypesExpanded)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-medium text-gray-900">Understanding Wallet Types:</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${walletTypesExpanded ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {walletTypesExpanded && (
                <div className="text-gray-700 space-y-2 mt-3">
                  <p className="mb-3">
                    The Autonomys network has two chains:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">Chain</th>
                          <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">Description</th>
                          <th className="px-4 py-3 text-left text-base font-semibold text-gray-900">Address Format</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 font-medium text-gray-900">Autonomys Consensus Chain</td>
                          <td className="px-4 py-3 text-gray-700">Built on Substrate. This is where the account you are verifying ownership of exists.</td>
                          <td className="px-4 py-3 text-gray-700 font-mono text-sm">SS58</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-gray-900">Auto EVM</td>
                          <td className="px-4 py-3 text-gray-700">An EVM-compatible chain where vesting takes place.</td>
                          <td className="px-4 py-3 text-gray-700 font-mono text-sm">0x...</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 p-3 bg-gray-100 rounded border border-gray-300">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> SS58 addresses can appear differently based on network prefix. The same account may be shown as <code className="text-xs bg-white px-1 py-0.5 rounded">5...</code> (Substrate format) or <code className="text-xs bg-white px-1 py-0.5 rounded">su...</code> (Subspace format), but they represent the same account. Your connected wallet displays above in Subspace format, while you may see addresses in Substrate format elsewhere - both refer to the same account. <a href="https://forum.autonomys.xyz/t/substrate-wallet-guide/4535" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Learn more</a>.
                    </p>
                  </div>
                  <p className="mt-3">
                    You'll connect your <strong>Autonomys wallet</strong> (SS58 address) to verify ownership, and designate an <strong>EVM wallet</strong> (0x address) to receive your vested tokens.
                  </p>
                </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-blue-900 mb-3">Why this is important:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                    It proves that you, as the owner of the Autonomys wallet we have on file, have chosen the EVM wallet where your vested tokens will be delivered.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                    It prevents anyone else from registering an address on your behalf.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                    It ensures that all future token releases flow to the correct wallet.
                  </li>
                </ul>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-amber-900 mb-3">What you will need to do:</h3>
                <ol className="space-y-3 text-amber-800">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">1</span>
                    Connect your Autonomys wallet below.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">2</span>
                    Enter your EVM beneficiary wallet address for receiving tokens.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">3</span>
                    Submit the verification transaction.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-sm font-medium mr-3 flex-shrink-0 mt-0.5">4</span>
                    Reply to the Subspace Foundation email with your transaction hash.
                  </li>
                </ol>
                
                <div className="mt-4 p-3 bg-amber-100 rounded border">
                  <h4 className="text-amber-900 font-semibold mb-2">What happens next:</h4>
                  <ul className="text-amber-800 space-y-2">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-600 mt-2 mr-3 flex-shrink-0"></span>
                      Your Autonomys wallet will be permanently linked to the EVM address you provide.
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-600 mt-2 mr-3 flex-shrink-0"></span>
                      This address will be used as your beneficiary wallet for all vesting and lockup contracts.
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-600 mt-2 mr-3 flex-shrink-0"></span>
                      You are responsible for ensuring that this wallet remains under your control and capable of signing transactions required to claim tokens in the future.
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-xl font-semibold text-red-900 mb-2">Critical Warning</h3>
                    <div className="text-red-800">
                      <p className="font-semibold mb-2">
                        Double-check your EVM wallet address before submitting!
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                          <strong>Submitting an incorrect EVM address could result in permanent loss of your vested tokens.</strong>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                          Once submitted, changing your beneficiary address (if possible) will require manual review and may delay your ability to claim tokens.
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                          Ensure you control the private keys for the EVM address you provide.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Status Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Wallet Status</h2>
            
            {!isConnected ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallet Connected</h3>
                <p className="text-gray-500 mb-4">
                  Connect your Autonomys wallet to start the EVM address verification process.
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
                        <p>Ready to submit EVM address verification to Autonomys Network</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Substrate Address - Highlighted */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Your Substrate (SS58) Address</h4>
                  <p className="text-blue-800 font-mono text-sm break-all">
                    {selectedAccount?.address}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    This is the address format (starting with "5") that you provided during stakeholder verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Account Name</h4>
                    <p className="text-gray-600 font-mono">
                      {selectedAccount?.name || 'Unnamed Account'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Account Source</h4>
                    <p className="text-gray-600">
                      {selectedAccount?.source || 'Unknown'}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Network</h4>
                    <p className="text-gray-600">
                      Autonomys Mainnet
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Subspace Format Address</h4>
                    <p className="text-gray-600 font-mono text-sm break-all">
                      {selectedAccount?.address ? address(selectedAccount.address, 6094) : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      This is the same account displayed in Subspace format (starting with "su").
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Verification Form */}
          <VerificationForm />
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
