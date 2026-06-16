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
      id: 'ai3-vs-wai3',
      question: 'What is the difference between AI3 and WAI3?',
      answer: (
        <>
          <p>
            <strong>Native AI3</strong> on Auto EVM is the chain's native token, like ETH on Ethereum. It
            is used to pay gas, but it is not an ERC-20 token.
          </p>
          <p className="mt-2">
            <strong>WAI3</strong> is a wrapped, ERC-20 version of AI3 (a WETH-style wrapper). Smart
            contracts, DeFi protocols, and the Hedgey vesting and lockup contracts use WAI3 because they
            expect a standard ERC-20 interface.
          </p>
        </>
      ),
    },
    {
      id: 'why-unwrap',
      question: 'Why do I need to unwrap WAI3?',
      answer: (
        <>
          <p>
            Tokens claimed from a vesting plan or investor lockup arrive as <strong>WAI3</strong>. To stake
            them you need <strong>native AI3 on the consensus chain</strong>, so the path is:
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
            <li>Unwrap WAI3 to native AI3 on Auto EVM (this guide)</li>
            <li>
              <a href="/xdm" className="text-blue-600 hover:text-blue-800 underline">
                Bridge AI3 to the consensus chain with XDM
              </a>
            </li>
            <li>
              <a href="/stake" className="text-blue-600 hover:text-blue-800 underline">
                Stake your AI3
              </a>
            </li>
          </ol>
        </>
      ),
    },
    {
      id: 'rate-fees',
      question: 'Is wrapping 1:1? Are there fees?',
      answer: (
        <p>
          Wrapping and unwrapping are always <strong>1:1</strong> - 1 AI3 becomes 1 WAI3 and vice versa.
          There are <strong>no protocol fees</strong>; you only pay the network gas for the transaction,
          which is charged in native AI3.
        </p>
      ),
    },
    {
      id: 'which-wallet',
      question: 'Which wallet do I need?',
      answer: (
        <p>
          An EVM wallet such as <strong>MetaMask</strong> or Rabby, connected to the{' '}
          <strong>Autonomys Mainnet Auto EVM</strong> network (chain ID 870). Substrate wallets are not
          used for wrapping - that happens entirely on Auto EVM.
        </p>
      ),
    },
    {
      id: 'add-wai3',
      question: 'How do I see my WAI3 balance in my wallet?',
      answer: (
        <>
          <p>
            On the wrap page, under <strong>"Step 2 - Prepare your wallet"</strong>, use the{' '}
            <strong>"Add token"</strong> button to add WAI3 to your wallet's asset list. You can also add it
            manually using the WAI3 contract address:
          </p>
          <p className="mt-2">
            <code className="text-sm bg-gray-100 px-1 rounded break-all">
              0x7ba06C7374566c68495f7e4690093521F6B991bb
            </code>
          </p>
          <p className="mt-2">WAI3 has 18 decimals, the same as AI3.</p>
        </>
      ),
    },
    {
      id: 'gas',
      question: 'I have WAI3 but no AI3 for gas - what do I do?',
      answer: (
        <p>
          You need a small amount of native AI3 on Auto EVM to pay gas for the unwrap transaction. If your
          balance is zero and you cannot cover gas, reach out to{' '}
          <a
            href="mailto:claims@subspace.foundation"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            claims@subspace.foundation
          </a>
          {' '}for assistance. Keep a small buffer rather than wrapping or transferring your entire balance.
        </p>
      ),
    },
    {
      id: 'next-step',
      question: 'I unwrapped to AI3 - what next?',
      answer: (
        <p>
          Bridge your native AI3 from Auto EVM to the consensus chain using the{' '}
          <a href="/xdm" className="text-blue-600 hover:text-blue-800 underline font-medium">
            XDM guide
          </a>
          , then{' '}
          <a href="/stake" className="text-blue-600 hover:text-blue-800 underline font-medium">
            stake it
          </a>. For more detail on wrapping, see the{' '}
          <a
            href="https://develop.autonomys.xyz/evm/wrapping_ai3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Autonomys Developer Hub
          </a>.
        </p>
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

export function WrapFaqSection() {
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
    <div id="wrap-faq-section" className="bg-white rounded-lg shadow-sm p-6">
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
              Common questions about wrapping and unwrapping AI3.
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
