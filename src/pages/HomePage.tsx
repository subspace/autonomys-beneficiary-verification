import { useRef } from 'react';
import { VerificationForm } from '../components/verification';
import { FaqSection, type FaqSectionHandle } from '../components/verification/faq-section';
import { useWallet } from '../hooks/use-wallet';
import { address } from '@autonomys/auto-utils';

export function HomePage() {
  const { isConnected, selectedAccount } = useWallet();
  const faqRef = useRef<FaqSectionHandle>(null);

  return (
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
            To establish this association, you will submit a simple on-chain transaction from your Autonomys (SS58) wallet confirming the EVM address you wish to use.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800">
                  <strong>Important:</strong> Before submitting your address, please{' '}
                  <button
                    type="button"
                    onClick={() => faqRef.current?.scrollToAndExpand()}
                    className="text-red-700 hover:text-red-900 underline font-medium"
                  >
                    review the FAQ below
                  </button>
                  {' '}- especially the sections on wallet requirements and unsupported wallets.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-900 mb-3">Why this is important:</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                It confirms that you, as the owner of the Autonomys wallet on file, have designated the EVM wallet where your tokens will be delivered.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                It prevents anyone else from registering an address on your behalf.
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
                Submit the association transaction.
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
              Connect your Autonomys wallet using the button in the header to start the EVM address verification process.
            </p>
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
                    <p>Ready to submit EVM beneficiary address association to Autonomys Network</p>
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

      {/* FAQ Section */}
      <FaqSection ref={faqRef} />
    </div>
  );
}
