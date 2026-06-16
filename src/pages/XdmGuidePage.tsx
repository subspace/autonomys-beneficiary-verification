import { useState, useEffect } from 'react';
import { XdmFaqSection } from '../components/xdm';

type XdmFlow = 'evmToConsensus' | 'consensusToEvm';

interface StepData {
  number: number;
  title: string;
  description: React.ReactNode;
  images: string[];
}

const XDM_IMAGE_BASE = '/images/xdm-guide';

function buildEvmToConsensusSteps(): StepData[] {
  return [
    {
      number: 1,
      title: 'Open the XDM Sender and Choose Your Direction',
      description: (
        <>
          Go to{' '}
          <a
            href="https://subspace.tools/xdm/send"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            subspace.tools/xdm/send
          </a>
          . Under <strong>"Select Network:"</strong> choose <strong>"Mainnet"</strong>, then under{' '}
          <strong>"Transfer Direction:"</strong> choose <strong>"Auto EVM → Consensus"</strong>.
        </>
      ),
      images: ['xdm-evm-network-direction.png'],
    },
    {
      number: 2,
      title: 'Connect Your EVM Wallet',
      description: (
        <>
          Under <strong>"EVM Wallet (Source):"</strong> click <strong>"Connect MetaMask"</strong>
          {' '}(or your EVM wallet) and approve the connection. Make sure the wallet is on the{' '}
          <strong>Autonomys Mainnet Auto EVM</strong> network (chain ID 870) - if you see{' '}
          <strong>"Wrong Network"</strong>, click <strong>"Switch Network"</strong>.
        </>
      ),
      images: ['xdm-evm-connect-wallet.png'],
    },
    {
      number: 3,
      title: 'Enter the Recipient Address and Amount',
      description: (
        <>
          In <strong>"Recipient Substrate Address"</strong> paste your consensus-chain address (it starts
          with <strong>"sub…"</strong>) - this is the address you will stake from, so make sure you control
          it. Then in <strong>"Amount (AI3)"</strong> enter how much to transfer, or click{' '}
          <strong>"MAX"</strong> (a small buffer is kept back for gas). The minimum transfer is{' '}
          <strong>1 AI3</strong>, and the form shows{' '}
          <strong>"Estimated confirmation time: ~1 day (14,400 domain blocks)"</strong>.
        </>
      ),
      images: ['xdm-evm-recipient-amount.png'],
    },
    {
      number: 4,
      title: 'Send and Confirm',
      description: (
        <>
          Click <strong>"Send Transfer"</strong>. Review the <strong>"Confirm Transfer"</strong> dialog
          (direction, from, to, and amount), click <strong>"Confirm & Send"</strong>, then sign the
          transaction in your wallet.
        </>
      ),
      images: ['xdm-evm-confirm.png', 'xdm-evm-transaction-confirm.png'],
    },
    {
      number: 5,
      title: 'Track Your Transfer',
      description: (
        <>
          You are taken to the <strong>"XDM Transfer Status"</strong> page, which auto-refreshes every
          30 seconds. The transfer takes about <strong>1 day (14,400 domain blocks)</strong> to complete,
          after which your AI3 arrives on the consensus chain and is ready to stake.
        </>
      ),
      images: ['xdm-evm-status.png'],
    },
  ];
}

function buildConsensusToEvmSteps(): StepData[] {
  return [
    {
      number: 1,
      title: 'Open the XDM Sender and Choose Your Direction',
      description: (
        <>
          Go to{' '}
          <a
            href="https://subspace.tools/xdm/send"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            subspace.tools/xdm/send
          </a>
          . Under <strong>"Select Network:"</strong> choose <strong>"Mainnet"</strong>, then under{' '}
          <strong>"Transfer Direction:"</strong> choose <strong>"Consensus → Auto EVM"</strong>.
        </>
      ),
      images: ['xdm-consensus-network-direction.png'],
    },
    {
      number: 2,
      title: 'Connect Your Substrate Wallet',
      description: (
        <>
          Under <strong>"Substrate Wallet (Source):"</strong> connect your Substrate wallet
          (<strong>SubWallet</strong>, <strong>Talisman</strong>, or <strong>Polkadot.js</strong>) and
          select the account holding your AI3.
        </>
      ),
      images: ['xdm-consensus-connect-wallet.png'],
    },
    {
      number: 3,
      title: 'Enter the Recipient Address and Amount',
      description: (
        <>
          In <strong>"Recipient EVM Address (0x…)"</strong> paste the Auto EVM address you want to receive
          the tokens (it starts with <strong>"0x"</strong>). Then in <strong>"Amount (AI3)"</strong> enter
          how much to transfer, or click <strong>"MAX"</strong>. The minimum transfer is{' '}
          <strong>1 AI3</strong>. This direction is faster: the form shows{' '}
          <strong>"Estimated confirmation time: ~10 minutes (100 domain blocks)"</strong>.
        </>
      ),
      images: ['xdm-consensus-recipient-amount.png'],
    },
    {
      number: 4,
      title: 'Send and Confirm',
      description: (
        <>
          Click <strong>"Send Transfer"</strong>. Review the <strong>"Confirm Transfer"</strong> dialog,
          click <strong>"Confirm & Send"</strong>, then sign the transaction in your wallet.
        </>
      ),
      images: ['xdm-consensus-confirm.png'],
    },
    {
      number: 5,
      title: 'Track Your Transfer',
      description: (
        <>
          You are taken to the <strong>"XDM Transfer Status"</strong> page, which auto-refreshes every
          30 seconds. This direction completes in about <strong>10 minutes (100 domain blocks)</strong>.
        </>
      ),
      images: ['xdm-consensus-status.png'],
    },
  ];
}

const flowConfig = {
  evmToConsensus: {
    label: 'Auto EVM → Consensus',
    sublabel: 'Move AI3 for staking',
    pageTitle: 'How to Transfer AI3 with XDM - Auto EVM to Consensus | Autonomys Beneficiary Portal',
    heading: 'How to Transfer AI3 from Auto EVM to the Consensus Chain',
    description:
      'Use XDM (Cross-Domain Messaging) to move native AI3 from Auto EVM to the consensus chain so you can stake it. This uses the Subspace Tools XDM sender.',
    steps: buildEvmToConsensusSteps,
  },
  consensusToEvm: {
    label: 'Consensus → Auto EVM',
    sublabel: 'Move AI3 to Auto EVM',
    pageTitle: 'How to Transfer AI3 with XDM - Consensus to Auto EVM | Autonomys Beneficiary Portal',
    heading: 'How to Transfer AI3 from the Consensus Chain to Auto EVM',
    description:
      'Use XDM (Cross-Domain Messaging) to move native AI3 from the consensus chain to Auto EVM, for example to wrap it into WAI3 or use it in EVM applications.',
    steps: buildConsensusToEvmSteps,
  },
} as const;

export function XdmGuidePage() {
  const [activeFlow, setActiveFlow] = useState<XdmFlow>('evmToConsensus');
  const config = flowConfig[activeFlow];
  const steps = config.steps();

  useEffect(() => {
    document.title = config.pageTitle;
  }, [config.pageTitle]);

  return (
    <div className="space-y-6">
      {/* Flow Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-sm text-gray-600 mb-3 text-center">Which direction are you transferring?</p>
        <div className="flex justify-center">
          <div className="inline-flex rounded-full bg-gray-100 p-1">
            {(Object.entries(flowConfig) as [XdmFlow, typeof flowConfig[XdmFlow]][]).map(([key, cfg]) => (
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
              To stake tokens you claimed from a vesting plan or investor lockup, they need to reach the
              consensus chain. The full path is:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-amber-800">
              <li>
                <a href="/wrap" className="text-amber-700 hover:text-amber-900 underline font-medium">
                  Unwrap WAI3 to native AI3
                </a>
                {' '}on Auto EVM
              </li>
              <li>
                <strong>Bridge AI3 from Auto EVM to the consensus chain using XDM</strong> (this guide)
              </li>
              <li>
                <a href="/stake" className="text-amber-700 hover:text-amber-900 underline font-medium">
                  Stake your AI3
                </a>
                {' '}on the consensus chain
              </li>
            </ol>
            <p className="text-amber-800 mt-2">
              For the <strong>Auto EVM → Consensus</strong> direction you connect an EVM wallet (such as
              MetaMask) holding native AI3 on Auto EVM. Keep a little AI3 for gas. The minimum transfer is
              1 AI3, and this direction takes about 1 day to confirm.
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
                        src={`${XDM_IMAGE_BASE}/${image}`}
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
      <XdmFaqSection />
    </div>
  );
}
