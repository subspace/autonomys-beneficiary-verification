import { useState, useEffect } from 'react';
import { WrapFaqSection } from '../components/wrap';

type WrapFlow = 'unwrap' | 'wrap';

interface StepData {
  number: number;
  title: string;
  description: React.ReactNode;
  images: string[];
}

const WRAP_IMAGE_BASE = '/images/wrap-guide';
const WAI3_CONTRACT = '0x7ba06C7374566c68495f7e4690093521F6B991bb';

function buildUnwrapSteps(): StepData[] {
  return [
    {
      number: 1,
      title: 'Connect Your Wallet',
      description: (
        <>
          Head to{' '}
          <a
            href="https://subspace.tools/wrap/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            subspace.tools/wrap
          </a>
          {' '}and connect your EVM wallet, such as <strong>MetaMask</strong>. First time here? Tap{' '}
          <strong>"Add network"</strong> to set up <strong>Autonomys Mainnet Auto EVM</strong> (chain ID
          870), then <strong>"Add token"</strong> so your WAI3 shows up in your wallet. (The WAI3 contract
          is <code className="text-sm bg-gray-100 px-1 rounded">{WAI3_CONTRACT}</code>.)
        </>
      ),
      images: ['wrap-unwrap-connect-wallet.png'],
    },
    {
      number: 2,
      title: 'Choose Unwrap and Enter the Amount',
      description: (
        <>
          Select <strong>"Unwrap WAI3 -&gt; AI3"</strong>, then in <strong>"Amount (WAI3)"</strong> enter
          how much to unwrap or click <strong>"MAX"</strong>. Unwrapping is 1:1, so the page confirms{' '}
          <strong>"You will receive the same amount in AI3"</strong>.
        </>
      ),
      images: ['wrap-unwrap-amount.png'],
    },
    {
      number: 3,
      title: 'Confirm and Complete',
      description: (
        <>
          Click <strong>"Unwrap WAI3 -&gt; AI3"</strong>, review the <strong>"Confirm Unwrap"</strong>
          {' '}dialog, click <strong>"Confirm in Wallet"</strong> and sign (gas is paid in native AI3). On
          success you will see <strong>"Transaction submitted!"</strong> with a{' '}
          <strong>"View on explorer"</strong> link, and your native AI3 balance updates once mined.
        </>
      ),
      images: ['wrap-unwrap-confirm.png', 'wrap-unwrap-transaction.png', 'wrap-unwrap-success.png'],
    },
  ];
}

function buildWrapSteps(): StepData[] {
  return [
    {
      number: 1,
      title: 'Connect Your Wallet',
      description: (
        <>
          Head to{' '}
          <a
            href="https://subspace.tools/wrap/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            subspace.tools/wrap
          </a>
          {' '}and connect your EVM wallet, such as <strong>MetaMask</strong>. First time here? Tap{' '}
          <strong>"Add network"</strong> to set up <strong>Autonomys Mainnet Auto EVM</strong> (chain ID
          870). (The WAI3 contract is{' '}
          <code className="text-sm bg-gray-100 px-1 rounded">{WAI3_CONTRACT}</code>.)
        </>
      ),
      images: ['wrap-wrap-connect-wallet.png'],
    },
    {
      number: 2,
      title: 'Choose Wrap and Enter the Amount',
      description: (
        <>
          Select <strong>"Wrap AI3 -&gt; WAI3"</strong>, then in <strong>"Amount (AI3)"</strong> enter how
          much to wrap or click <strong>"MAX"</strong> (a small buffer is kept back for gas). Wrapping is
          1:1, so the page confirms <strong>"You will receive the same amount in WAI3"</strong>.
        </>
      ),
      images: ['wrap-wrap-amount.png'],
    },
    {
      number: 3,
      title: 'Confirm and Complete',
      description: (
        <>
          Click <strong>"Wrap AI3 -&gt; WAI3"</strong>, review the <strong>"Confirm Wrap"</strong> dialog,
          click <strong>"Confirm in Wallet"</strong> and sign. On success you will see{' '}
          <strong>"Transaction submitted!"</strong> with a <strong>"View on explorer"</strong> link, and
          your WAI3 balance updates once mined.
        </>
      ),
      images: ['wrap-wrap-confirm.png', 'wrap-wrap-transaction.png', 'wrap-wrap-success.png'],
    },
  ];
}

const flowConfig = {
  unwrap: {
    label: 'Unwrap WAI3 to AI3',
    sublabel: 'WAI3 to native AI3',
    pageTitle: 'How to Unwrap WAI3 to AI3 | Autonomys Beneficiary Portal',
    heading: 'How to Unwrap WAI3 into Native AI3',
    description:
      'Convert wrapped AI3 (WAI3) back into native AI3 on Auto EVM using the Subspace Tools wrap interface. This is the first step in moving claimed tokens toward staking.',
    steps: buildUnwrapSteps,
  },
  wrap: {
    label: 'Wrap AI3 to WAI3',
    sublabel: 'Native AI3 to WAI3',
    pageTitle: 'How to Wrap AI3 to WAI3 | Autonomys Beneficiary Portal',
    heading: 'How to Wrap Native AI3 into WAI3',
    description:
      'Convert native AI3 on Auto EVM into wrapped AI3 (WAI3), the ERC-20 token used by DeFi protocols and other contracts, using the Subspace Tools wrap interface.',
    steps: buildWrapSteps,
  },
} as const;

export function WrapGuidePage() {
  const [activeFlow, setActiveFlow] = useState<WrapFlow>('unwrap');
  const config = flowConfig[activeFlow];
  const steps = config.steps();

  useEffect(() => {
    document.title = config.pageTitle;
  }, [config.pageTitle]);

  return (
    <div className="space-y-6">
      {/* Flow Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-sm text-gray-600 mb-3 text-center">What would you like to do?</p>
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            {(Object.entries(flowConfig) as [WrapFlow, typeof flowConfig[WrapFlow]][]).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFlow(key)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                  ${activeFlow === key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }
                `}
              >
                <span className="block">{cfg.label}</span>
                <span className={`block text-xs mt-0.5 ${activeFlow === key ? 'text-blue-100' : 'text-gray-400'}`}>
                  {cfg.sublabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {config.heading}
        </h2>
        <p className="text-gray-600">
          {config.description}
        </p>
      </div>

      {/* Prerequisites */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Where This Fits in Staking Your Unlocked Tokens
            </h3>
            <p className="text-amber-800">
              Tokens claimed from a vesting plan or investor lockup arrive as <strong>WAI3</strong>, an
              ERC-20 wrapper, on Auto EVM. To stake them you first convert WAI3 back to native AI3. The full
              path is:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-amber-800">
              <li><strong>Unwrap WAI3 to native AI3</strong> on Auto EVM (this guide)</li>
              <li>
                <a href="/xdm" className="text-amber-700 hover:text-amber-900 underline font-medium">
                  Bridge AI3 from Auto EVM to the consensus chain
                </a>
                {' '}using XDM
              </li>
              <li>
                <a href="/stake" className="text-amber-700 hover:text-amber-900 underline font-medium">
                  Stake your AI3
                </a>
                {' '}on the consensus chain
              </li>
            </ol>
            <p className="text-amber-800 mt-2">
              Wrapping and unwrapping are 1:1 with no fees beyond gas. You need an EVM wallet (such as
              MetaMask) on Auto EVM (chain ID 870) and a little AI3 to cover gas.
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
            <div key={`${activeFlow}-${step.number}`} className="border-l-4 border-blue-500 pl-6">
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
              {step.images.length > 0 && (
                <div className="ml-11">
                  <div className="flex flex-col items-center gap-4">
                    {step.images.map((image, index) => (
                      <img
                        key={image}
                        src={`${WRAP_IMAGE_BASE}/${image}`}
                        alt={`Step ${step.number}.${index + 1}: ${step.title}`}
                        className="rounded-lg border border-gray-200 shadow-sm max-w-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <WrapFaqSection />
    </div>
  );
}
