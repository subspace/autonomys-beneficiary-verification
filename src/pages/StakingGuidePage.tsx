import { useState, useEffect } from 'react';
import { StakingFaqSection } from '../components/staking';

type StakingFlow = 'stake' | 'unstake';

interface StepData {
  number: number;
  title: string;
  description: React.ReactNode;
  images: string[];
}

const STAKING_IMAGE_BASE = '/images/staking-guide';

function buildStakeSteps(): StepData[] {
  return [
    {
      number: 1,
      title: 'Visit the Staking Portal and Connect Your Wallet',
      description: (
        <>
          Go to{' '}
          <a
            href="https://staking.autonomys.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            staking.autonomys.xyz
          </a>
          {' '}and click <strong>"Connect Wallet"</strong> in the top right. Choose your Substrate wallet
          extension (<strong>SubWallet</strong>, <strong>Talisman</strong>, or <strong>Polkadot.js</strong>),
          approve the connection request in the extension popup, then select the account holding your AI3.
        </>
      ),
      images: ['staking-connect-wallet.png', 'staking-wallet-modal.png'],
    },
    {
      number: 2,
      title: 'Browse the Operators List',
      description: (
        <>
          Open the <strong>"Operators"</strong> page using the <strong>"Staking"</strong> link in the top
          navigation. Each operator shows its{' '}
          <strong>nomination tax</strong> (commission taken from rewards), <strong>estimated APY</strong>,
          total staked value, nominator count, and status. Use the search box or switch between grid
          and table views to compare operators.
        </>
      ),
      images: ['staking-operators-list.png'],
    },
    {
      number: 3,
      title: 'Choose an Operator and Click "Stake"',
      description: (
        <>
          Click <strong>"Stake"</strong> on the operator you want to nominate. You'll be taken to that
          operator's staking page (headed <strong>"Stake to"</strong> followed by the operator's name),
          which shows a summary of the operator alongside the staking form.
        </>
      ),
      images: ['staking-stake-page.png'],
    },
    {
      number: 4,
      title: 'Enter the Amount to Stake',
      description: (
        <>
          Enter the amount of AI3 in the <strong>"Amount to Stake"</strong> field, or click{' '}
          <strong>"MAX"</strong> to stake your full available balance (a small buffer is kept back for
          transaction fees). The form shows the operator's <strong>minimum stake</strong>, which applies
          to your first stake only. The <strong>Transaction Breakdown</strong> shows how your stake
          splits: 80% becomes your stake and 20% is reserved in the operator's <strong>storage fund</strong>
          {' '}- this reserve is refunded proportionally when you withdraw.
        </>
      ),
      images: ['staking-amount-form.png'],
    },
    {
      number: 5,
      title: 'Submit and Sign the Transaction',
      description: (
        <>
          Click <strong>"Stake Tokens"</strong>. Your wallet extension will pop up asking you to sign
          the transaction - review the details and approve. The button shows{' '}
          <strong>"Awaiting signature..."</strong> and then <strong>"Submitting..."</strong> while the
          transaction is broadcast.
        </>
      ),
      images: ['staking-sign-transaction.png'],
    },
    {
      number: 6,
      title: 'Confirmation and Epoch Activation',
      description: (
        <>
          On success you'll see a <strong>"Staking Successful!"</strong> screen. Your stake appears as{' '}
          <strong>"Pending"</strong> on your Dashboard until the next epoch transition (~10 minutes),
          when it becomes active and starts earning. Rewards are automatically compounded into your
          position - there is nothing to claim while you remain staked.
        </>
      ),
      images: ['staking-success.png', 'staking-dashboard-position-pending.png', 'staking-dashboard-position.png'],
    },
  ];
}

function buildUnstakeSteps(): StepData[] {
  return [
    {
      number: 1,
      title: 'Open Your Dashboard and Click "Withdraw"',
      description: (
        <>
          Go to the <strong>"Dashboard"</strong> at{' '}
          <a
            href="https://staking.autonomys.xyz/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            staking.autonomys.xyz/dashboard
          </a>
          {' '}with your wallet connected. Find the position you want to exit in the{' '}
          <strong>"Active Positions"</strong> table and click <strong>"Withdraw"</strong>.
        </>
      ),
      images: ['unstake-dashboard-withdraw.png'],
    },
    {
      number: 2,
      title: 'Choose Partial or Full Withdrawal',
      description: (
        <>
          On the withdrawal page for that operator, choose a withdrawal method:{' '}
          <strong>"Partial"</strong> (enter the total amount you want to receive) or{' '}
          <strong>"Full Withdrawal"</strong>. Note: if a partial withdrawal would leave your remaining
          stake below the operator's minimum, the portal will warn you and convert it into a full
          withdrawal of your entire position.
        </>
      ),
      images: ['unstake-method.png'],
    },
    {
      number: 3,
      title: 'Review the Summary, Submit and Sign',
      description: (
        <>
          The <strong>"Withdrawal Summary"</strong> shows the amount you'll receive - including your
          proportional <strong>storage fund refund</strong> - and the transaction fee. Click{' '}
          <strong>"Withdraw Tokens"</strong> and sign the transaction in your wallet extension.
          On success you'll see a <strong>"Withdrawal Successful!"</strong> confirmation. Withdrawal
          requests are processed at the end of the current epoch.
        </>
      ),
      images: ['unstake-summary.png', 'unstake-withdrawal-successful.png'],
    },
    {
      number: 4,
      title: 'Wait for the Locking Period',
      description: (
        <>
          Withdrawn funds have a <strong>locking period of 14,400 domain blocks (~1 day)</strong> before
          they can be claimed. Track progress in the <strong>"Pending Operations"</strong> card on your
          Dashboard: the withdrawal shows as <strong>"Withdrawing"</strong> with a countdown
          (for example, "Ready in ~23h 59m"), then changes to <strong>"Unlockable"</strong> when ready.
        </>
      ),
      images: ['unstake-pending-operations.png'],
    },
    {
      number: 5,
      title: 'Claim Your Funds',
      description: (
        <>
          Once your withdrawal shows as <strong>"Unlockable"</strong>, a summary appears with the total
          amount ready. Click <strong>"Claim All"</strong> and sign the transaction. Your AI3 - including
          the storage fund refund - is returned to your wallet's available balance.
        </>
      ),
      images: ['unstake-claim-all.png', 'unstake-claimed-success.png'],
    },
  ];
}

const flowConfig = {
  stake: {
    label: 'Stake',
    sublabel: 'Nominate an operator',
    pageTitle: 'How to Stake AI3 Tokens | Autonomys Beneficiary Portal',
    heading: 'How to Stake AI3 Tokens',
    description:
      'Follow these steps to stake (nominate) your AI3 tokens to an operator using the Autonomys Staking portal and start earning rewards.',
    steps: buildStakeSteps,
  },
  unstake: {
    label: 'Unstake & Withdraw',
    sublabel: 'Reclaim your tokens',
    pageTitle: 'How to Unstake AI3 Tokens | Autonomys Beneficiary Portal',
    heading: 'How to Unstake and Withdraw AI3 Tokens',
    description:
      'Follow these steps to withdraw your staked AI3 from an operator and claim your funds back to your wallet. Withdrawal is a two-step process: request the withdrawal, then claim after a ~1 day locking period.',
    steps: buildUnstakeSteps,
  },
} as const;

export function StakingGuidePage() {
  const [activeFlow, setActiveFlow] = useState<StakingFlow>('stake');
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
            {(Object.entries(flowConfig) as [StakingFlow, typeof flowConfig[StakingFlow]][]).map(([key, cfg]) => (
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
              Before You Start: Tokens Must Be on the Consensus Chain
            </h3>
            <p className="text-amber-800">
              Staking happens on the Autonomys <strong>consensus chain</strong> and requires a Substrate
              wallet (SubWallet, Talisman, or Polkadot.js - MetaMask is not supported). If you just claimed
              WAI3 from your vesting plan or investor lockup on Hedgey, you'll first need to:
            </p>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-amber-800">
              <li>
                <a
                  href="/wrap"
                  className="text-amber-700 hover:text-amber-900 underline font-medium"
                >
                  Unwrap your WAI3 to native AI3
                </a>
                {' '}on Auto EVM
              </li>
              <li>
                <a
                  href="/xdm"
                  className="text-amber-700 hover:text-amber-900 underline font-medium"
                >
                  Bridge AI3 from Auto EVM to the consensus chain
                </a>
                {' '}using XDM (takes ~1 day)
              </li>
            </ol>
            <p className="text-amber-800 mt-2">
              Keep a small amount of AI3 unstaked to cover transaction fees.
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
                        src={`${STAKING_IMAGE_BASE}/${image}`}
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
      <StakingFaqSection />
    </div>
  );
}
