import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FaqSectionHandle {
  expand: () => void;
  scrollToAndExpand: () => void;
}

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const faqItems: FaqItem[] = [
  {
    question: "Why am I here?",
    answer: (
      <>
        <p>You are here by invitation from the Subspace Foundation.</p>
        <p className="mt-2">
          You are a stakeholder in the Autonomys Network who is due a token allocation. 
          The Foundation previously collected and verified a wallet address from you that is linked to your identity. 
          This step is required to set up the wallet that will receive your allocation on Auto EVM.
        </p>
      </>
    ),
  },
  {
    question: "Why can't I collect my allocation using the wallet I provided previously?",
    answer: (
      <>
        <p>The wallet you previously provided works on the Autonomys consensus chain.</p>
        <p className="mt-2">
          Token vesting and unlocks are implemented on Auto EVM, which uses a different wallet format. 
          Because of this, the original wallet cannot be used to interact with vesting and lockup contracts.
        </p>
      </>
    ),
  },
  {
    question: "Why are there two different wallet address formats?",
    answer: (
      <>
        <p>The Autonomys Network consists of two environments:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>The consensus chain, which is Substrate-based and uses SS58 addresses</li>
          <li>Auto EVM, which is Ethereum-compatible and uses Ethereum-style (0x…) addresses</li>
        </ul>
        <p className="mt-2">Both are part of the same network, but they use different address formats and wallet technologies.</p>
      </>
    ),
  },
  {
    question: "Why do I need to provide an EVM address?",
    answer: (
      <>
        <p>Token vesting and lockups are executed using Hedgey contracts deployed on Auto EVM.</p>
        <p className="mt-2">
          An EVM address is required so that you can claim and receive vested or unlocked tokens from smart contracts.
        </p>
      </>
    ),
  },
  {
    question: "What kind of EVM address should I provide?",
    answer: (
      <>
        <p>You should provide an EVM address that:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>You personally control</li>
          <li>You can sign transactions from on Auto EVM</li>
          <li>Is managed using a supported wallet application</li>
        </ul>
        <p className="mt-2">This address will be used to claim and receive vested or unlocked tokens from smart contracts.</p>
      </>
    ),
  },
  {
    question: "Which wallets are supported?",
    answer: (
      <>
        <p>Standard EVM wallets that can interact with Auto EVM are supported e.g.</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>MetaMask</li>
          <li>Talisman</li>
          <li>SubWallet</li>
          <li>Hardware wallets via MetaMask (Ledger, Trezor)</li>
          <li>Safe multisig wallets (including Safe with Ledger or other hardware signers)</li>
        </ul>
        <p className="mt-2">These wallets allow you to sign transactions and interact with Auto EVM contracts.</p>
      </>
    ),
  },
  {
    question: "Which wallets should NOT be used?",
    answer: (
      <>
        <p>You must not use:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>Exchange deposit addresses (for example, Kraken, Coinbase, or BitMart)</li>
          <li>Custodial wallets where you do not control the private keys</li>
          <li>Any address you cannot sign transactions from</li>
        </ul>
        <p className="mt-2">
          Exchange and custodial addresses are not compatible with vesting contracts and may result in 
          permanent loss of access to your tokens.
        </p>
      </>
    ),
  },
  {
    question: "Do I need to use an EVM wallet derived from the same seed as my SS58 wallet?",
    answer: (
      <>
        <p>No.</p>
        <p className="mt-2">
          Your SS58 wallet and your EVM wallet can be completely independent. This portal exists to explicitly 
          associate the two addresses through an on-chain message sent from your verified SS58 account.
        </p>
      </>
    ),
  },
  {
    question: "How does the association between my SS58 address and EVM address work?",
    answer: (
      <>
        <p>You will submit a <code className="text-sm bg-white px-1 py-0.5 rounded border border-gray-200">system.remark</code> transaction on the Autonomys mainnet from your verified SS58 address.</p>
        <p className="mt-2">
          The remark contains your chosen EVM address. This creates an on-chain attestation that the owner of the 
          SS58 address has designated that EVM address as their beneficiary wallet.
        </p>
      </>
    ),
  },
  {
    question: "How do I pay for the association transaction?",
    answer: (
      <>
        <p>
          The Subspace Foundation has provided a small amount of AI3 to your verified Autonomys (SS58) 
          wallet to cover the cost of the association transaction.
        </p>
        <p className="mt-2">
          This balance is intended specifically to pay for the <code className="text-sm bg-white px-1 py-0.5 rounded border border-gray-200">system.remark</code> transaction 
          required to associate your SS58 address with your EVM beneficiary address.
        </p>
        <p className="mt-2">You do not need to obtain additional AI3 for this step.</p>
      </>
    ),
  },
  {
    question: "Does the on-chain remark move tokens or grant permissions?",
    answer: (
      <>
        <p>No.</p>
        <p className="mt-2">The remark transaction:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>Does not transfer any tokens</li>
          <li>Does not grant permissions</li>
          <li>Does not interact with smart contracts</li>
        </ul>
        <p className="mt-2">It simply records a message on-chain.</p>
      </>
    ),
  },
  {
    question: "What happens after I submit the remark?",
    answer: (
      <>
        <p>After submitting the remark, you will reply to your Foundation email with the transaction hash.</p>
        <p className="mt-2">
          The Subspace Foundation will then review the transaction to confirm the association between your 
          verified SS58 address and your EVM beneficiary address.
        </p>
      </>
    ),
  },
  {
    question: "Can I test that my EVM wallet is suitable before submitting it?",
    answer: (
      <>
        <p>Yes. To a point.</p>
        <p className="mt-2">
          The portal includes an optional, gasless signing check that allows you to confirm that you can sign 
          messages using your EVM wallet. This helps increase confidence that you control the wallet.
        </p>
        <p className="mt-2">
          This check is optional, is not reviewed by the Foundation, and does not guarantee compatibility with 
          Autonomys which could be a concern for certain custody solutions that do not support Auto EVM.
        </p>
      </>
    ),
  },
  {
    question: "What if I make a mistake when submitting my EVM address?",
    answer: (
      <>
        <p>If you believe you submitted an incorrect EVM address, do not submit additional remark transactions on your own.</p>
        <p className="mt-2">
          Contact the Subspace Foundation directly through{' '}
          <a href="mailto:claims@subspace.foundation" className="text-blue-600 hover:text-blue-800 underline">
            claims@subspace.foundation
          </a>. 
          Any correction or re-association is handled as a support request and may not be possible in all cases.
        </p>
      </>
    ),
  },
  {
    question: "Can I change my beneficiary address later?",
    answer: (
      <>
        <p>Changing a beneficiary address is not self-serve and is not guaranteed.</p>
        <p className="mt-2">
          Any change request requires review by the Subspace Foundation and may not be possible once vesting or 
          unlocks have begun. You should assume that the address you submit will be treated as final.
        </p>
      </>
    ),
  },
  {
    question: "Does the Subspace Foundation verify or custody my EVM wallet?",
    answer: (
      <>
        <p>No.</p>
        <p className="mt-2">
          The Subspace Foundation does not custody wallets, does not automatically verify EVM wallet ownership, 
          and cannot recover funds sent to an incorrect or inaccessible address.
        </p>
        <p className="mt-2">
          You are responsible for ensuring that the EVM address you provide is correct and under your control.
        </p>
      </>
    ),
  },
  {
    question: "What token will I receive, and where will I receive it?",
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
              Native token on Auto EVM (Ethereum-style addresses), used to execute EVM transactions and can be 
              sent to other chains such as Ethereum via the{' '}
              <a href="https://docs.autonomys.xyz/bridge" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                bridge
              </a>
            </span>
          </li>
          <li>
            <strong>WAI3 (Auto EVM)</strong>
            <br />
            <span className="text-gray-600">Wrapped AI3 used by smart contracts, including vesting and lockups</span>
          </li>
        </ul>
        <p className="mt-3">Vesting and unlocks distribute WAI3 on Auto EVM.</p>
      </>
    ),
  },
  {
    question: "Why does vesting use WAI3 instead of AI3 directly?",
    answer: (
      <>
        <p>Vesting and lockup contracts are implemented using smart contracts on Auto EVM.</p>
        <p className="mt-2">
          These contracts operate on ERC-20 tokens such as WAI3, a wrapped representation of AI3 that is compatible 
          with standard EVM contract patterns. This allows vesting logic to function safely and predictably.
        </p>
        <p className="mt-2">Native AI3 on Auto EVM is not an ERC-20 token - the same as ETH on Ethereum.</p>
      </>
    ),
  },
  {
    question: "What can I do with WAI3 after I claim it?",
    answer: (
      <>
        <p>After claiming WAI3 on Auto EVM, you have several options:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>Hold WAI3 on Auto EVM</li>
          <li>Unwrap WAI3 to native AI3 on Auto EVM</li>
          <li>Bridge AI3 from Auto EVM to the Autonomys consensus chain using XDM</li>
        </ul>
        <p className="mt-2">Unwrapping and bridging are optional steps that you control.</p>
      </>
    ),
  },
  {
    question: "Why might I want to move tokens to the consensus chain?",
    answer: (
      <>
        <p>You may want to move AI3 to the consensus chain if you plan to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
          <li>Stake AI3</li>
          <li>Participate in consensus-layer activities</li>
          <li>Interact with exchanges or services that support the consensus chain but not Auto EVM</li>
        </ul>
        <p className="mt-2">Some exchanges and network features operate only on the consensus chain.</p>
      </>
    ),
  },
  {
    question: "How do I unwrap WAI3 to AI3 on Auto EVM?",
    answer: (
      <>
        <p>WAI3 can be unwrapped into native Auto EVM AI3 using the official unwrapping process.</p>
        <p className="mt-2">
          A step-by-step guide is available here:{' '}
          <a 
            href="https://develop.autonomys.xyz/evm/wrapping_ai3#unwrapping-wai3" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            https://develop.autonomys.xyz/evm/wrapping_ai3#unwrapping-wai3
          </a>
        </p>
        <p className="mt-2">Unwrapping requires signing an EVM transaction and paying standard network gas fees.</p>
      </>
    ),
  },
  {
    question: "How do I move AI3 from Auto EVM to the consensus chain?",
    answer: (
      <>
        <p>
          After unwrapping WAI3 into native Auto EVM AI3, you can bridge AI3 to the consensus chain using{' '}
          <a 
            href="https://docs.autonomys.xyz/xdm" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            XDM (Cross-Domain Messaging)
          </a>.
        </p>
        <p className="mt-2">
          This process transfers the token representation from Auto EVM back to the consensus chain while 
          preserving the underlying asset.
        </p>
      </>
    ),
  },
  {
    question: "When will I be able to claim my tokens?",
    answer: (
      <>
        <p>Completing this beneficiary association step does not by itself release tokens.</p>
        <p className="mt-2">
          Tokens become claimable according to the vesting or unlock schedule that applies to your allocation. 
          The Subspace Foundation has published the distribution schedule here:{' '}
          <a 
            href="https://subspace.foundation/tokenomics" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            https://subspace.foundation/tokenomics
          </a>
        </p>
      </>
    ),
  },
  {
    question: "Do I need to complete this step immediately?",
    answer: (
      <>
        <p>You should complete this step as soon as reasonably possible.</p>
        <p className="mt-2">
          Your EVM beneficiary address is required before the Subspace Foundation can set up vesting or unlock 
          contracts for your allocation. Preparing allocations takes time, and delays in submitting your 
          beneficiary address may result in delays when tokens become claimable.
        </p>
        <p className="mt-2">
          Completing this step early helps ensure your allocation can be prepared in advance of any vesting or unlock events.
        </p>
      </>
    ),
  },
];

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onToggle }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left p-4"
      >
        <span className="text-base font-medium text-gray-900 pr-4">{item.question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-700 space-y-2">
          {item.answer}
        </div>
      )}
    </div>
  );
};

export const FaqSection = forwardRef<FaqSectionHandle>((_, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const handleToggle = (index: number) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setOpenIndices(new Set(faqItems.map((_, i) => i)));
  };

  const handleCollapseAll = () => {
    setOpenIndices(new Set());
  };

  useImperativeHandle(ref, () => ({
    expand: () => setIsExpanded(true),
    scrollToAndExpand: () => {
      setIsExpanded(true);
      // Small delay to allow render before scrolling
      setTimeout(() => {
        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    },
  }));

  return (
    <div id="faq-section" className="bg-white rounded-lg shadow-sm p-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-medium text-gray-900">
          {isExpanded ? 'Frequently Asked Questions' : 'Frequently Asked Questions (click to expand)'}
        </h2>
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
              Please review these questions and answers carefully before submitting your beneficiary address.
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
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                isOpen={openIndices.has(index)}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

FaqSection.displayName = 'FaqSection';

