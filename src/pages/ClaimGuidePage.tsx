import { useEffect } from 'react';
import { ClaimFaqSection } from '../components/claim';

const IMAGE_BASE_PATH = '/images/claim-guide';

export function ClaimGuidePage() {
  useEffect(() => {
    document.title = 'How to Claim AI3 Tokens | Autonomys Beneficiary Portal';
  }, []);
  const steps = [
    {
      number: 1,
      title: 'Visit Hedgey and Connect Your Wallet',
      description: (
        <>
          Go to{' '}
          <a
            href="https://app.hedgey.finance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            app.hedgey.finance
          </a>
          {' '}and click <strong>"Connect a wallet"</strong> in the top right. Select your beneficiary wallet
          (this guide uses MetaMask as an example, but other EVM wallets are supported).
        </>
      ),
      images: [
        'hedgey-connect-wallet.png',
        'hedgey-wallet-select.png',
        'hedgey-wallet-connect-metamask.png',
      ],
    },
    {
      number: 2,
      title: 'Select the Autonomys EVM Network',
      description: (
        <>
          Ensure the <strong>Autonomys EVM</strong> network is selected in your wallet and in the Hedgey interface.
        </>
      ),
      images: [
        'hedgey-network-select.png',
        'hedgey-network-dropdown.png',
      ],
    },
    {
      number: 3,
      title: 'Navigate to Vesting Plans',
      description: (
        <>
          Click on <strong>"Vesting Plans"</strong> in the left sidebar menu.
        </>
      ),
      images: [
        'hedgey-vesting-plans-menu.png',
      ],
    },
    {
      number: 4,
      title: 'View Your Plan Details',
      description: (
        <>
          Find your vesting plan in the list and click <strong>"View Details"</strong> on the plan you want to interact with.
          You'll see information including total tokens, schedule, vesting rate, and available amount to claim.
        </>
      ),
      images: [
        'hedgey-plan-details.png',
      ],
    },
    {
      number: 5,
      title: 'Claim Your Tokens',
      description: (
        <>
          Click the <strong>"Claim"</strong> button. A dialog will appear showing the amount of tokens available to claim.
          Click <strong>"Claim WAI3"</strong> to proceed.
        </>
      ),
      images: [
        'hedgey-claim-dialog.png',
      ],
    },
    {
      number: 6,
      title: 'Confirm the Transaction',
      description: (
        <>
          Your wallet will prompt you to confirm the transaction. Review the details and click <strong>"Confirm"</strong>.
          You'll see a small network fee in AI3.
        </>
      ),
      images: [
        'hedgey-confirm-transaction.png',
      ],
    },
    {
      number: 7,
      title: 'Transaction Complete',
      description: (
        <>
          When successful, you'll see a confirmation toast at the bottom of the screen.
          If you've claimed all tokens in the plan, after a short while the plan will move to the "Historical" section.
        </>
      ),
      images: [
        'hedgey-success.png',
        'hedgey-historical.png',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          How to Claim AI3 Tokens from Hedgey
        </h2>
        <p className="text-gray-600">
          Follow these steps to claim your available AI3 tokens from your vesting allocation on the Hedgey portal.
        </p>
      </div>

      {/* Important Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Important: Gas Settings
            </h3>
            <p className="text-amber-800">
              If nothing happens after submitting your claim transaction, you may need to adjust the gas defaults for Auto EVM.
              See the{' '}
              <a
                href="https://docs.autonomys.xyz/bridge/outbound#adjusting-gas-limit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:text-amber-900 underline font-medium"
              >
                gas adjustment guide
              </a>
              {' '}for instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Step-by-Step Guide
        </h3>
        
        <div className="space-y-8">
          {steps.map((step) => (
            <div key={step.number} className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mr-3">
                  {step.number}
                </span>
                <h4 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h4>
              </div>
              
              <p className="text-gray-700 mb-4 ml-11">
                {step.description}
              </p>
              
              {/* Screenshots */}
              <div className="ml-11">
                {step.images.length > 0 ? (
                  <div className="flex flex-col items-center gap-4">
                    {step.images.map((image, index) => (
                      <img
                        key={image}
                        src={`${IMAGE_BASE_PATH}/${image}`}
                        alt={`Step ${step.number}.${index + 1}: ${step.title}`}
                        className="rounded-lg border border-gray-200 shadow-sm max-w-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">
                      Screenshot placeholder
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <ClaimFaqSection />
    </div>
  );
}
