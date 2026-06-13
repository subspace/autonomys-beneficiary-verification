import React, { useState, useEffect } from 'react';
import { ChevronDown, Link2, Check } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

function buildFaqItems(): FaqItem[] {
  return [
    {
      id: 'which-wallets',
      question: 'Which wallets can I use for staking?',
      answer: (
        <>
          <p>
            The staking portal supports Substrate wallet extensions: <strong>SubWallet</strong>,{' '}
            <strong>Talisman</strong>, and the <strong>Polkadot.js extension</strong>.
          </p>
          <p className="mt-2">
            MetaMask and other EVM-only wallets are <strong>not supported</strong> - staking takes place
            on the Autonomys consensus chain, not on Auto EVM. If you don't have a Substrate wallet yet,
            see the{' '}
            <a
              href="https://docs.autonomys.xyz/wallets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Autonomys wallets guide
            </a>.
          </p>
        </>
      ),
    },
    {
      id: 'tokens-on-evm',
      question: "I claimed my tokens on Hedgey - why can't I stake them yet?",
      answer: (
        <>
          <p>
            Tokens claimed from vesting plans and investor lockups are distributed as <strong>WAI3 on
            Auto EVM</strong>, but staking requires <strong>native AI3 on the consensus chain</strong>.
          </p>
          <p className="mt-2">Before you can stake, you need to:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
            <li>
              <a href="/claim#faq-unwrap" className="text-blue-600 hover:text-blue-800 underline">
                Unwrap WAI3 to native AI3
              </a>
              {' '}on Auto EVM
            </li>
            <li>
              <a href="/claim#faq-xdm" className="text-blue-600 hover:text-blue-800 underline">
                Bridge AI3 from Auto EVM to the consensus chain
              </a>
              {' '}using XDM
            </li>
          </ol>
          <p className="mt-2">
            Note that the XDM transfer from Auto EVM to the consensus chain takes 14,400 domain blocks
            (approximately 1 day) to confirm.
          </p>
        </>
      ),
    },
    {
      id: 'minimum-stake',
      question: 'Is there a minimum staking amount?',
      answer: (
        <>
          <p>
            Yes - each operator sets its own <strong>minimum nominator stake</strong>, which is displayed
            on the staking form when you select an operator.
          </p>
          <p className="mt-2">
            The minimum applies to your <strong>first nomination only</strong>. Once you have an active
            position with an operator, you can add any amount of additional stake.
          </p>
        </>
      ),
    },
    {
      id: 'storage-fund',
      question: 'Why does only 80% of my deposit show as staked?',
      answer: (
        <>
          <p>
            When you stake, <strong>20% of your deposit is reserved in the operator's storage fund</strong>,
            which pays for the data bundles the operator produces. The remaining 80% becomes your stake.
          </p>
          <p className="mt-2">
            The storage fund reserve is not lost - it is <strong>refunded proportionally when you
            withdraw</strong>. The exact refund depends on storage fund performance over the period
            you were staked.
          </p>
        </>
      ),
    },
    {
      id: 'pending-stake',
      question: 'Why does my stake show as "Pending"?',
      answer: (
        <>
          <p>
            Staking operations are processed in <strong>epochs</strong>, which occur every 100 domain
            blocks (approximately 10 minutes).
          </p>
          <p className="mt-2">
            Your deposit sits in a pending queue until the next epoch transition, at which point it
            converts to shares in the operator's nomination pool and starts earning. The Dashboard shows
            the epoch at which your deposit becomes effective.
          </p>
        </>
      ),
    },
    {
      id: 'rewards',
      question: 'How and when do I receive staking rewards?',
      answer: (
        <>
          <p>
            Rewards are <strong>automatically compounded into your staked position</strong> - there is
            nothing to claim while you remain staked. Your share of the operator's earnings (after the
            operator's nomination tax) accrues to the value of your position.
          </p>
          <p className="mt-2">
            You receive the accumulated rewards when you withdraw your stake.
          </p>
        </>
      ),
    },
    {
      id: 'operator-tax',
      question: 'What is the operator "tax"?',
      answer: (
        <>
          <p>
            The nomination tax is the <strong>commission an operator takes from rewards</strong> before
            distributing the remainder to its nominators, shown as a percentage on each operator card.
          </p>
          <p className="mt-2">
            When comparing operators, consider the tax alongside the estimated APY, total stake,
            nominator count, and operator status.
          </p>
        </>
      ),
    },
    {
      id: 'withdrawal-time',
      question: 'How long does it take to withdraw my stake?',
      answer: (
        <>
          <p>Withdrawal is a two-step process:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
            <li>
              <strong>Request the withdrawal</strong> - processed at the end of the current epoch
              (~10 minutes)
            </li>
            <li>
              <strong>Wait the locking period</strong> - 14,400 domain blocks (approximately 1 day),
              then claim your funds with the <strong>"Claim All"</strong> button on the Dashboard
            </li>
          </ol>
          <p className="mt-2">
            In total, expect roughly one day between requesting a withdrawal and having the funds back
            in your wallet.
          </p>
        </>
      ),
    },
    {
      id: 'partial-withdrawal',
      question: 'Can I withdraw only part of my stake?',
      answer: (
        <>
          <p>
            Yes - choose <strong>"Partial"</strong> on the withdrawal page and enter the amount you want
            to receive. The rest of your stake remains active and continues earning rewards.
          </p>
          <p className="mt-2">
            However, if a partial withdrawal would leave your remaining stake <strong>below the
            operator's minimum</strong>, the portal will convert it into a full withdrawal of your
            entire position.
          </p>
        </>
      ),
    },
    {
      id: 'learn-more',
      question: 'Where can I learn more about how staking works?',
      answer: (
        <>
          <p>
            The{' '}
            <a
              href="https://docs.autonomys.xyz/staking/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Autonomys staking documentation
            </a>
            {' '}covers the underlying mechanics in depth: operators and domains, nomination pools,
            share calculation, stake epochs, and withdrawal processing.
          </p>
          <p className="mt-2">
            For questions not covered here, visit the{' '}
            <a
              href="https://forum.autonomys.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Autonomys Forum
            </a>.
          </p>
        </>
      ),
    },
  ];
}

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onToggle }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#faq-${item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id={`faq-${item.id}`} className="bg-gray-50 border border-gray-200 rounded-lg scroll-mt-24">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left p-4"
      >
        <span className="text-base font-medium text-gray-900 pr-4">{item.question}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            role="button"
            tabIndex={0}
            onClick={handleCopyLink}
            onKeyDown={(e) => e.key === 'Enter' && handleCopyLink(e as unknown as React.MouseEvent)}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Copy link to this question"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-700 space-y-2">
          {item.answer}
        </div>
      )}
    </div>
  );
};

export function StakingFaqSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const faqItems = buildFaqItems();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#faq-')) {
        const faqId = hash.replace('#faq-', '');
        const item = faqItems.find(item => item.id === faqId);
        if (item) {
          setIsExpanded(true);
          setOpenIds(prev => new Set(prev).add(faqId));
          setTimeout(() => {
            document.getElementById(`faq-${faqId}`)?.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 150);
        }
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenIds(new Set(faqItems.map(item => item.id)));
  };

  const handleCollapseAll = () => {
    setOpenIds(new Set());
  };

  return (
    <div id="staking-faq-section" className="bg-white rounded-lg shadow-sm p-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-lg font-medium text-gray-900">
          {isExpanded ? 'Frequently Asked Questions' : 'Frequently Asked Questions (click to expand)'}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700">
              Common questions about staking and unstaking your AI3 tokens.
            </p>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleExpandAll}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Expand all
              </button>
              <span className="text-gray-400">|</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Collapse all
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openIds.has(item.id)}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
