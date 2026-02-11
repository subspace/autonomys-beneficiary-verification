import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { useWallet } from '@autonomys/auto-wallet-react';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { validateEvmAddress } from '../../lib/evm-validation';
import { type SelfCheckSummary } from '../../lib/evm-signing';
import { getAutonomysApi, type TransactionStatus } from '../../services/autonomys-api';
import { Copy, Check, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { WalletSelfCheck } from './wallet-self-check';

export const VerificationForm: React.FC = () => {
  const { isConnected, selectedAccount, injector } = useWallet();
  const [evmAddress, setEvmAddress] = useState('');
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateEvmAddress> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attestationConfirmed, setAttestationConfirmed] = useState(false);
  const [selfCheckResult, setSelfCheckResult] = useState<SelfCheckSummary | null>(null);

  // Callback for when self-check status changes
  const handleSelfCheckChange = useCallback((summary: SelfCheckSummary | null) => {
    setSelfCheckResult(summary);
  }, []);

  // Validate EVM address on input change
  useEffect(() => {
    if (evmAddress) {
      const result = validateEvmAddress(evmAddress);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [evmAddress]);

  const handleEvmAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvmAddress(e.target.value);
    // Clear previous transaction results when address changes
    if (transactionHash) {
      setTransactionHash(null);
      setTransactionStatus(null);
      setIsCompleted(false); // Reset completion state for new address
    }
    // Reset attestation when address changes
    setAttestationConfirmed(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !selectedAccount || !injector) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validationResult?.isValid) {
      alert('Please enter a valid EVM address');
      return;
    }

    if (!attestationConfirmed) {
      alert('Please confirm that you control the EVM wallet address');
      return;
    }

    setIsSubmitting(true);
    setTransactionHash(null);
    setTransactionStatus(null);

    try {
      const autonomysApi = getAutonomysApi('mainnet');
      
      const result = await autonomysApi.submitRemarkTransaction(
        validationResult.normalizedAddress!,
        selectedAccount.address,
        injector as unknown as InjectedExtension,
        (status) => {
          setTransactionStatus(status);
          if (status.hash) {
            setTransactionHash(status.hash);
          }
          // Update submitting state based on transaction status
          if (status.status === 'success' || status.status === 'error') {
            setIsSubmitting(false);
          }
          // Mark as completed when successful
          if (status.status === 'success') {
            setIsCompleted(true);
          }
        },
        selfCheckResult
      );

      setTransactionHash(result.hash);
    } catch (error) {
      console.error('Transaction failed:', error);
      setTransactionStatus({
        status: 'error',
        message: 'Transaction failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setIsSubmitting(false); // Handle error case immediately
    }
  };

  const handleCopyHash = async () => {
    if (transactionHash) {
      try {
        await navigator.clipboard.writeText(transactionHash);
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
      } catch (error) {
        console.error('Failed to copy hash:', error);
      }
    }
  };

  const getValidationIcon = () => {
    if (!validationResult) return null;
    
    if (validationResult.isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: TransactionStatus['status']) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'pending': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-4">EVM Beneficiary Address Association</h2>
      <p className="text-gray-600 mb-6">
        Submit your EVM address to create the on-chain association linking your Autonomys wallet to your EVM beneficiary address. 
        Transaction confirmation may take a short while depending on network conditions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wallet Requirement Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-xl font-semibold text-red-900 mb-2">Important - Wallet Requirements</h3>
              <div className="text-red-800">
                <p className="mb-2">
                  The EVM address you submit must be a wallet that <strong>you personally control and can sign transactions from</strong>.
                </p>
                <p className="mb-2 font-semibold">Suitable wallet types:</p>
                <ul className="space-y-2 mb-3">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                    A standard non-custodial wallet (e.g. MetaMask, Talisman)
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                    A hardware wallet (Ledger has been tested), used via a wallet app
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-600 mt-2 mr-3 flex-shrink-0"></span>
                    Safe wallets are supported, and you will be able to approve claim transactions using your Safe's configured signing policy
                  </li>
                </ul>
                <p className="font-semibold mb-2">
                  Do <strong>not</strong> use exchange deposit addresses (Binance, Coinbase, etc.) or any custodial wallet where you do not control the private keys.
                </p>
                <p>
                  If you provide an address you cannot sign from, you may permanently lose access to any vested tokens.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* EVM Address Input */}
        <div>
          <label htmlFor="evmAddress" className="block text-sm font-medium text-gray-700 mb-2">
            EVM Address
          </label>
          <div className="relative">
            <input
              type="text"
              id="evmAddress"
              value={evmAddress}
              onChange={handleEvmAddressChange}
              placeholder="0x742d35Cc6634C0532925a3b8D4e5D7e78c7c8e5B"
              maxLength={42}
              className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                validationResult && !validationResult.isValid 
                  ? 'border-red-300' 
                  : validationResult?.isValid 
                  ? 'border-green-300' 
                  : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {getValidationIcon()}
            </div>
          </div>
          
          {/* Validation Messages */}
          {validationResult && !validationResult.isValid && (
            <p className="mt-2 text-sm text-red-600">
              {validationResult.error}
            </p>
          )}
          
          {validationResult?.isValid && (
            <div className="mt-2">
              <p className="text-sm text-green-600">✓ Valid EVM address with correct checksum</p>
              {validationResult.normalizedAddress !== evmAddress && (
                <p className="text-xs text-gray-500 mt-1">
                  Normalized: {validationResult.normalizedAddress}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Optional Wallet Self-Check */}
        <WalletSelfCheck 
          beneficiaryAddress={evmAddress} 
          onSelfCheckChange={handleSelfCheckChange}
        />

        {/* Attestation Checkbox */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={attestationConfirmed}
              onChange={(e) => setAttestationConfirmed(e.target.checked)}
              disabled={isSubmitting || isCompleted}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1 text-sm text-amber-900">
              <span className="font-semibold">By submitting this EVM address you confirm that:</span>
              <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                <li>It is a wallet you control with access to the private keys;</li>
                <li>You are responsible for managing that wallet safely and for any subsequent claims;</li>
                <li>You understand that using an address you cannot sign from may result in permanent loss of your vested tokens.</li>
                <li>If you're unsure whether your wallet is appropriate, please contact us at <a href="mailto:claims@subspace.foundation" className="text-blue-600 hover:text-blue-800 underline">claims@subspace.foundation</a> before submitting.</li>
              </ol>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!validationResult?.isValid || !attestationConfirmed || isSubmitting || isCompleted}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : isCompleted ? (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Verification Complete</span>
            </div>
          ) : (
            'Submit Association Transaction'
          )}
        </Button>
      </form>

      {/* Transaction Status */}
      {transactionStatus && (
        <div className="mt-6">
          <Alert className={getStatusColor(transactionStatus.status)}>
            <AlertDescription>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{transactionStatus.message}</div>
                  {transactionStatus.error && (
                    <div className="mt-1 text-sm">{transactionStatus.error}</div>
                  )}
                  {transactionStatus.hash && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <span>Transaction Hash:</span>
                        <code className="bg-black bg-opacity-10 px-1 rounded text-xs">
                          {transactionStatus.hash.slice(0, 10)}...{transactionStatus.hash.slice(-8)}
                        </code>
                        <button
                          onClick={handleCopyHash}
                          className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
                          title="Copy full hash"
                        >
                          {copiedHash ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a
                          href={`https://autonomys.subscan.io/extrinsic/${transactionStatus.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Track on Subscan Explorer</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                {transactionStatus.status === 'preparing' || transactionStatus.status === 'signing' || transactionStatus.status === 'submitting' ? (
                  <div className="ml-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : null}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Success State with Transaction Hash */}
      {transactionHash && transactionStatus?.status === 'success' && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">✅ Verification Complete!</h3>
          <p className="text-sm text-green-700 mb-4">
            Your EVM address has been successfully recorded on the Autonomys Network. 
            Please save the transaction hash below and send it to the Subspace Foundation for validation.
          </p>
          
          <div className="bg-white rounded border p-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Transaction Hash:</label>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopyHash}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {copiedHash ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://autonomys.subscan.io/extrinsic/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View on Explorer</span>
                </a>
              </div>
            </div>
            <code className="block w-full p-2 bg-gray-50 border rounded text-xs font-mono break-all">
              {transactionHash}
            </code>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="text-sm font-medium text-blue-800 mb-2">What this means:</h4>
            <ul className="text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                Your Autonomys wallet has been permanently linked to the EVM address you provided.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                This address will be used as your beneficiary wallet for all vesting and lockup contracts.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                You are responsible for ensuring that this wallet remains under your control and capable of signing transactions required to claim tokens in the future.
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Next steps:</h4>
              <ul className="text-blue-700 space-y-2">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                  Copy the transaction hash above
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                  Reply to the Subspace Foundation email with your transaction hash
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                  Keep a note of this hash for your records
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-2 mr-3 flex-shrink-0"></span>
                  The submit button has been disabled to prevent duplicate submissions
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
