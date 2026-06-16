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
      id: 'what-is-xdm',
      question: 'What is XDM?',
      answer: (
        <>
          <p>
            XDM (Cross-Domain Messaging) is how AI3 moves between the Autonomys <strong>consensus
            chain</strong> and the <strong>Auto EVM</strong> domain. It is the official bridge between the
            two environments.
          </p>
          <p className="mt-2">
            This guide uses the{' '}
            <a
              href="https://subspace.tools/xdm/send"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Subspace Tools XDM sender
            </a>. For background, see the{' '}
            <a
              href="https://docs.autonomys.xyz/xdm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              XDM documentation
            </a>.
          </p>
        </>
      ),
    },
    {
      id: 'how-long',
      question: 'How long does an XDM transfer take?',
      answer: (
        <>
          <p>It depends on the direction:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
            <li><strong>Consensus to Auto EVM:</strong> about 10 minutes (100 domain blocks)</li>
            <li><strong>Auto EVM to Consensus:</strong> about 1 day (14,400 domain blocks)</li>
          </ul>
          <p className="mt-2">
            The longer time for Auto EVM to Consensus is a security challenge period built into the
            protocol.
          </p>
        </>
      ),
    },
    {
      id: 'minimum',
      question: 'Is there a minimum transfer amount?',
      answer: (
        <p>
          Yes. The minimum XDM transfer is <strong>1 AI3</strong>. The sender also keeps a small amount of
          AI3 back to cover gas when you use the <strong>"MAX"</strong> button.
        </p>
      ),
    },
    {
      id: 'which-wallet',
      question: 'Which wallet do I need?',
      answer: (
        <>
          <p>It depends on the source chain you are transferring from:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
            <li>
              <strong>Auto EVM to Consensus:</strong> an EVM wallet such as <strong>MetaMask</strong> or
              Rabby, connected to Auto EVM (chain ID 870)
            </li>
            <li>
              <strong>Consensus to Auto EVM:</strong> a Substrate wallet such as <strong>SubWallet</strong>,
              <strong> Talisman</strong>, or <strong>Polkadot.js</strong>
            </li>
          </ul>
          <p className="mt-2">
            The recipient address is typed in manually, so you do not need both wallets connected at once.
          </p>
        </>
      ),
    },
    {
      id: 'recipient-address',
      question: 'What address do I send to?',
      answer: (
        <>
          <p>You enter the destination address yourself:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
            <li>
              Transferring <strong>to the consensus chain</strong>: enter your consensus (Substrate) address
              in <strong>"Recipient Substrate Address"</strong>
            </li>
            <li>
              Transferring <strong>to Auto EVM</strong>: enter your <strong>0x</strong> address in{' '}
              <strong>"Recipient EVM Address (0x…)"</strong>
            </li>
          </ul>
          <p className="mt-2">Double-check the address - transfers cannot be reversed.</p>
        </>
      ),
    },
    {
      id: 'track',
      question: 'How do I track my transfer?',
      answer: (
        <p>
          After sending, you are taken to the <strong>"XDM Transfer Status"</strong> page, which
          auto-refreshes every 30 seconds and shows the progress of your transfer until it completes.
        </p>
      ),
    },
    {
      id: 'fees',
      question: 'Are there fees?',
      answer: (
        <p>
          You pay a network transaction fee on the source chain. XDM transactions are charged at a higher
          weight than a standard transfer because they pay for execution on both chains, but the cost is
          still small.
        </p>
      ),
    },
    {
      id: 'next-step',
      question: 'I moved AI3 to the consensus chain - how do I stake it?',
      answer: (
        <p>
          Once your AI3 arrives on the consensus chain, follow the{' '}
          <a href="/stake" className="text-blue-600 hover:text-blue-800 underline font-medium">
            staking guide
          </a>
          {' '}to nominate an operator. If you still hold WAI3 on Auto EVM, first{' '}
          <a href="/wrap" className="text-blue-600 hover:text-blue-800 underline font-medium">
            unwrap it to native AI3
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

export function XdmFaqSection() {
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
    <div id="xdm-faq-section" className="bg-white rounded-lg shadow-sm p-6">
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
              Common questions about transferring AI3 across domains with XDM.
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
