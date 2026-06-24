import React, { useState, useEffect } from 'react';
import { ChevronDown, Link2, Check } from 'lucide-react';

type ClaimFlow = 'vesting' | 'lockup';

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

function buildFaqItems(flow: ClaimFlow): FaqItem[] {
  const isVesting = flow === 'vesting';
  const planNounPlural = isVesting ? 'vesting plans' : 'investor lockups';

  return [
    {
      id: 'what-token',
      question: "What token will I receive when I claim?",
      answer: (
        <>
          <p>You will receive WAI3 on Auto EVM.</p>
          <p className="mt-2">
            AI3 exists in multiple representations across the Autonomys Network, depending on where it is used.
            These representations all correspond to the same underlying token, but are used in different environments.
          </p>
          <p className="mt-3">At a high level:</p>
          <ul className="mt-2 space-y-2 ml-2">
            <li>
              <strong>AI3 (consensus chain)</strong>
              <br />
              <span className="text-gray-600">Native token on the Autonomys consensus chain (SS58 addresses)</span>
            </li>
            <li>
              <strong>AI3 (Auto EVM)</strong>
              <br />
              <span className="text-gray-600">
                Native token on Auto EVM (Ethereum-style addresses), used to execute EVM transactions
              </span>
            </li>
            <li>
              <strong>WAI3 (Auto EVM)</strong>
              <br />
              <span className="text-gray-600">Wrapped AI3 used by smart contracts, including vesting and lockups</span>
            </li>
          </ul>
          <p className="mt-3">
            {isVesting
              ? 'Vesting plans distribute WAI3 on Auto EVM.'
              : 'Investor lockups distribute WAI3 on Auto EVM.'}
          </p>
        </>
      ),
    },
    {
      id: 'why-wai3',
      question: `Why does ${isVesting ? 'vesting' : 'the lockup'} use WAI3 instead of AI3 directly?`,
      answer: (
        <>
          <p>Vesting and lockup contracts are implemented using smart contracts on Auto EVM.</p>
          <p className="mt-2">
            These contracts operate on ERC-20 tokens such as WAI3, a wrapped representation of AI3 that is compatible
            with standard EVM contract patterns. This allows {isVesting ? 'vesting' : 'lockup'} logic to function safely and predictably.
          </p>
          <p className="mt-2">Native AI3 on Auto EVM is not an ERC-20 token - the same as ETH on Ethereum.</p>
        </>
      ),
    },
    {
      id: 'what-next',
      question: "What can I do with WAI3 after I claim it?",
      answer: (
        <>
          <p>After claiming WAI3 on Auto EVM, you have several options:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
            <li>Hold WAI3 on Auto EVM</li>
            <li>
              <a href="/wrap" className="text-blue-600 hover:text-blue-800 underline">
                Unwrap WAI3 to native AI3
              </a>
              {' '}on Auto EVM
            </li>
            <li>
              <a href="/xdm" className="text-blue-600 hover:text-blue-800 underline">
                Bridge AI3 to the Autonomys consensus chain
              </a>
              {' '}using XDM
            </li>
          </ul>
          <p className="mt-2">Unwrapping and bridging are optional steps that you control.</p>
        </>
      ),
    },
    {
      id: 'why-consensus',
      question: "Why might I want to move tokens to the consensus chain?",
      answer: (
        <>
          <p>You may want to move AI3 to the consensus chain if you plan to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
            <li>
              <a href="/stake" className="text-blue-600 hover:text-blue-800 underline">
                Stake AI3 to earn rewards
              </a>
              {' '}(see the{' '}
              <a
                href="https://forum.autonomys.xyz/t/boosting-early-staking-the-guardians-of-growth-initiative/4962"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Guardians of Growth
              </a>
              {' '}initiative)
            </li>
            <li>Participate in consensus-layer activities</li>
            <li>Interact with exchanges or services that support the consensus chain but not Auto EVM</li>
          </ul>
          <p className="mt-2">Some exchanges and network features operate only on the consensus chain.</p>
        </>
      ),
    },
    {
      id: 'unwrap',
      question: "How do I unwrap WAI3 to AI3 on Auto EVM?",
      answer: (
        <>
          <p>WAI3 can be unwrapped into native Auto EVM AI3 using the official unwrapping process.</p>
          <p className="mt-2">
            Follow our{' '}
            <a href="/wrap" className="text-blue-600 hover:text-blue-800 underline font-medium">
              step-by-step unwrap guide
            </a>
            {' '}for the full walkthrough. For more technical detail, see the{' '}
            <a
              href="https://develop.autonomys.xyz/evm/wrapping_ai3#unwrapping-wai3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Autonomys Developer Hub
            </a>.
          </p>
          <p className="mt-2">Unwrapping requires signing an EVM transaction and paying standard network gas fees.</p>
        </>
      ),
    },
    {
      id: 'view-wai3-balance',
      question: "How do I view my WAI3 balance?",
      answer: (
        <>
          <p>
            To view wrapped AI3 (WAI3) in an EVM wallet such as MetaMask, you will need to add the WAI3 contract address to your wallet.
          </p>
          <p className="mt-2">
            A step-by-step guide on how to do this can be found in the{' '}
            <a
              href="https://develop.autonomys.xyz/evm/wrapping_ai3#wrapping-ai3-for-wai3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              WAI3 wrapping guide
            </a>.
          </p>
        </>
      ),
    },
    {
      id: 'xdm',
      question: "How do I move AI3 from Auto EVM to the consensus chain?",
      answer: (
        <>
          <p>
            After unwrapping WAI3 into native Auto EVM AI3, you can bridge AI3 to the consensus chain using
            XDM (Cross-Domain Messaging). Follow our{' '}
            <a href="/xdm" className="text-blue-600 hover:text-blue-800 underline font-medium">
              step-by-step XDM guide
            </a>.
          </p>
          <p className="mt-2">
            This process transfers the token representation from Auto EVM back to the consensus chain while
            preserving the underlying asset.
          </p>
          <p className="mt-2">
            Transfers from Auto EVM to the consensus chain take 14,400 domain blocks (approximately 1 day) to confirm.
            You can track your transfer status using the{' '}
            <a
              href="https://autonomys-community.github.io/autonomys-helpers/xdm/transfers/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              XDM Transfer Status tool
            </a>.
          </p>
          <p className="mt-2">
            <strong>Note:</strong> You will need to connect your EVM account using{' '}
            <a
              href="https://docs.autonomys.xyz/wallets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              SubWallet or Talisman
            </a>.
          </p>
        </>
      ),
    },
    {
      id: 'bridge-ethereum',
      question: "How do I bridge AI3 to Ethereum?",
      answer: (
        <>
          <p>After claiming WAI3 on Auto EVM, you can move AI3 to Ethereum if you want to trade on Ethereum-based exchanges.</p>
          <p className="mt-3 font-medium">The high-level steps are:</p>
          <ol className="list-decimal list-inside mt-2 space-y-2 ml-2">
            <li>Unwrap WAI3 to native AI3 on Auto EVM</li>
            <li>
              Bridge AI3 from Auto EVM to Ethereum using the{' '}
              <a
                href="https://docs.autonomys.xyz/bridge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                official Autonomys bridge
              </a>
            </li>
          </ol>
          <p className="mt-3">
            Once bridged to Ethereum, AI3 can be traded on supported Ethereum-based DEXs. For example, AI3 is available on{' '}
            <a
              href="https://app.uniswap.org/explore/pools/ethereum/0xa65e8c1c28fc60612cb8e2df615cc8612bc6d8a04f96128fbd346df44601b6f6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Uniswap via the WAI3/USDC pool
            </a>.
          </p>
          <p className="mt-2">Bridging and trading are optional and fully controlled by you.</p>
        </>
      ),
    },
    {
      id: 'gas-issues',
      question: "My claim transaction isn't working. What should I do?",
      answer: (
        <>
          <p>If nothing happens after submitting your claim transaction, you may need to adjust the gas settings for Auto EVM.</p>
          <p className="mt-2">
            See the{' '}
            <a
              href="https://docs.autonomys.xyz/bridge/outbound#adjusting-gas-limit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              gas adjustment guide
            </a>
            {' '}for step-by-step instructions on configuring your wallet's gas settings.
          </p>
        </>
      ),
    },
    {
      id: 'partial-claim',
      question: `Can I claim part of my allocation now and the rest later?`,
      answer: (
        <>
          <p>Yes. You can claim any amount that has {isVesting ? 'vested' : 'unlocked'} and is available to you.</p>
          <p className="mt-2">
            When you click "Claim" in the Hedgey portal, it will show you the amount currently available.
            You can return later to claim additional tokens as more of your allocation {isVesting ? 'vests' : 'unlocks'}.
          </p>
        </>
      ),
    },
    {
      id: 'hedgey-advanced',
      question: "Where can I learn about advanced Hedgey features?",
      answer: (
        <>
          <p>
            For advanced features like delegation, transferring {planNounPlural}, or other contract functions,
            refer to the official Hedgey documentation:
          </p>
          <p className="mt-2">
            <a
              href="https://hedgey.gitbook.io/hedgey-community-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Hedgey Community Docs
            </a>
          </p>
          <p className="mt-2">
            The Hedgey docs cover topics including vesting plans, investor lockups, token grants, and more.
          </p>
        </>
      ),
    },
    {
      id: 'safe-multisig',
      question: "How do I claim tokens to a Safe multisig wallet?",
      answer: (
        <>
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium text-amber-900">Sending tokens from a Safe to an exchange</p>
                <p className="mt-2 text-amber-800">
                  A Safe is a smart contract wallet, not a regular (externally owned) account. Many
                  centralized exchanges do not support deposits from smart contract wallets, so tokens
                  sent directly from your Safe to an exchange deposit address may be delayed, rejected, or
                  lost. Before transferring, confirm the exchange accepts deposits from a Safe, or first
                  move the tokens to a standard wallet you control. See{' '}
                  <a
                    href="https://develop.autonomys.xyz/evm/safe#overview"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-900 underline hover:text-amber-700"
                  >
                    the Safe overview in the developer docs
                  </a>{' '}
                  for details.
                </p>
              </div>
            </div>
          </div>
          <p>
            If you registered a Safe multisig as your beneficiary wallet, you can claim tokens using the Hedgey {isVesting ? 'Vesting Tokens' : 'Investor Lockups'} app.
          </p>
          <p className="mt-3 font-medium">Steps:</p>
          <ol className="list-decimal list-inside mt-2 space-y-2 ml-2">
            <li>
              Go to{' '}
              <a
                href="https://safe.autonomys.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                safe.autonomys.xyz
              </a>
            </li>
            <li>
              Open the Apps section and find <strong>Hedgey {isVesting ? 'Vesting Tokens' : 'Investor Lockups'}</strong> in the ecosystem apps
              <div className="mt-3 ml-1">
                <img
                  src="/images/claim-guide/hedgey-safe-ecosystem-app.png"
                  alt={`Hedgey ${isVesting ? 'Vesting Tokens' : 'Investor Lockups'} in Safe ecosystem apps`}
                  className="rounded-lg border border-gray-200 shadow-sm max-w-full"
                />
              </div>
            </li>
            <li>Follow the standard claim process from within your Safe</li>
          </ol>
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

interface ClaimFaqSectionProps {
  activeFlow?: ClaimFlow;
}

export function ClaimFaqSection({ activeFlow = 'vesting' }: ClaimFaqSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const faqItems = buildFaqItems(activeFlow);

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
  }, [activeFlow]);

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
    <div id="claim-faq-section" className="bg-white rounded-lg shadow-sm p-6">
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
              Common questions about claiming and managing your tokens.
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
