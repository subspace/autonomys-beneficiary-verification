import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Copy, Check, AlertCircle, CheckCircle, ShieldCheck, Info } from 'lucide-react';
import {
  type WalletType,
  type SigningResult,
  type SelfCheckSummary,
  isEvmWalletAvailable,
  getDetectedWalletName,
  buildSelfCheckMessage,
  signMessageAndRecover,
  formatResultForClipboard,
} from '../../lib/evm-signing';
import { validateEvmAddress } from '../../lib/evm-validation';

interface WalletSelfCheckProps {
  beneficiaryAddress: string;
  onSelfCheckChange?: (summary: SelfCheckSummary | null) => void;
}

type CheckStatus = 'idle' | 'connecting' | 'signing' | 'success' | 'error';

export const WalletSelfCheck: React.FC<WalletSelfCheckProps> = ({
  beneficiaryAddress,
  onSelfCheckChange,
}) => {
  const [walletType, setWalletType] = useState<WalletType>('EOA');
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [result, setResult] = useState<SigningResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Track the address that was checked to detect changes
  const checkedAddressRef = useRef<string | null>(null);

  const validationResult = beneficiaryAddress ? validateEvmAddress(beneficiaryAddress) : null;
  const hasValidAddress = validationResult?.isValid ?? false;
  const normalizedBeneficiary = validationResult?.normalizedAddress ?? beneficiaryAddress;

  // Reset check if beneficiary address changes after a successful check
  useEffect(() => {
    if (status === 'success' && checkedAddressRef.current && checkedAddressRef.current !== normalizedBeneficiary) {
      // Address changed, reset the check
      setStatus('idle');
      setResult(null);
      setErrorMessage(null);
      checkedAddressRef.current = null;
      onSelfCheckChange?.(null);
    }
  }, [normalizedBeneficiary, status, onSelfCheckChange]);

  const handleSelfCheck = useCallback(async () => {
    if (!hasValidAddress) {
      setErrorMessage('Please enter a valid EVM address first.');
      setStatus('error');
      return;
    }

    if (!isEvmWalletAvailable()) {
      setErrorMessage('No EVM wallet detected. Please install MetaMask, Rabby, or another compatible wallet.');
      setStatus('error');
      return;
    }

    setStatus('connecting');
    setErrorMessage(null);
    setResult(null);

    try {
      const message = buildSelfCheckMessage(normalizedBeneficiary, walletType);
      
      setStatus('signing');
      const signingResult = await signMessageAndRecover(message, normalizedBeneficiary, walletType);

      if (signingResult.success) {
        const timestamp = new Date().toISOString();
        setResult(signingResult);
        setStatus('success');
        checkedAddressRef.current = normalizedBeneficiary;
        
        // Report the successful check to parent
        onSelfCheckChange?.({
          performed: true,
          walletType,
          signerAddress: signingResult.recoveredAddress,
          matchesBeneficiary: signingResult.matchesBeneficiary,
          timestamp,
        });
      } else {
        setErrorMessage(signingResult.error ?? 'An unexpected error occurred.');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
      setStatus('error');
    }
  }, [hasValidAddress, normalizedBeneficiary, walletType, onSelfCheckChange]);

  const handleCopyDetails = useCallback(async () => {
    if (!result) return;

    const textToCopy = formatResultForClipboard(result, walletType, normalizedBeneficiary);
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [result, walletType, normalizedBeneficiary]);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setErrorMessage(null);
    checkedAddressRef.current = null;
    onSelfCheckChange?.(null);
  }, [onSelfCheckChange]);

  const detectedWallet = getDetectedWalletName();

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-slate-800">
            Optional: Wallet Suitability Self-Check
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            This optional step asks your connected wallet to sign a short message. 
            It costs no gas and is not submitted to the Subspace Foundation.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            <strong>Note:</strong> This check confirms you can sign messages with your wallet. 
            It does not verify connectivity to Auto EVM or any specific network.
          </p>
        </div>
      </div>

      {/* Wallet Type Toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Beneficiary wallet type
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setWalletType('EOA')}
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
              walletType === 'EOA'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            EOA (single wallet)
          </button>
          <button
            type="button"
            onClick={() => setWalletType('SAFE_MULTISIG')}
            className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
              walletType === 'SAFE_MULTISIG'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            Safe multisig
          </button>
        </div>
      </div>

      {/* Safe Multisig Note */}
      {walletType === 'SAFE_MULTISIG' && (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-sm text-amber-800">
            Safe addresses do not sign messages directly. This self-check will be performed 
            using an owner wallet (signer) and is for your assurance only.
          </AlertDescription>
        </Alert>
      )}

      {/* Sign Button */}
      {(status === 'idle' || status === 'error') && (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSelfCheck}
            disabled={!hasValidAddress}
            className="w-full"
          >
            Optional: Sign a message (no gas) to confirm wallet access
          </Button>
          {!hasValidAddress && beneficiaryAddress && (
            <p className="text-xs text-slate-500 text-center">
              Enter a valid EVM address above to enable this check
            </p>
          )}
          {detectedWallet && hasValidAddress && (
            <p className="text-xs text-slate-500 text-center">
              Detected wallet: {detectedWallet}
            </p>
          )}
        </div>
      )}

      {/* Connecting/Signing State */}
      {(status === 'connecting' || status === 'signing') && (
        <div className="flex items-center justify-center gap-2 py-4 text-slate-600">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">
            {status === 'connecting' ? 'Connecting to wallet...' : 'Waiting for signature...'}
          </span>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && errorMessage && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-sm text-red-800">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Success State */}
      {status === 'success' && result && (
        <div className="space-y-3">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              <strong>Self-check complete!</strong>
            </AlertDescription>
          </Alert>

          <div className="bg-white border border-slate-200 rounded-md p-3 space-y-2">
            {/* Signer Address */}
            <div className="flex items-start gap-2">
              <span className="text-sm text-slate-600 flex-shrink-0 min-w-[100px]">Signed by:</span>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded break-all">
                {result.recoveredAddress}
              </code>
            </div>

            {/* Match Status for EOA */}
            {walletType === 'EOA' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 flex-shrink-0 min-w-[100px]">Status:</span>
                {result.matchesBeneficiary ? (
                  <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Matches entered beneficiary address
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Does not match entered beneficiary address
                  </span>
                )}
              </div>
            )}

            {/* Safe Multisig Explanation */}
            {walletType === 'SAFE_MULTISIG' && (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-slate-600 flex-shrink-0 min-w-[100px]">Status:</span>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Signed by owner wallet (expected for Safe)
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic pl-[108px]">
                  Safe addresses do not sign messages directly. This self-check confirms you 
                  can sign as an owner wallet.
                </p>
              </div>
            )}

            {/* Copy Details Button */}
            <div className="pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyDetails}
                className="text-slate-600 hover:text-slate-800"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy details
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-slate-500 hover:text-slate-700 ml-2"
              >
                Reset
              </Button>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center italic">
            This signature was not submitted anywhere. It is for your personal verification only.
            This check does not guarantee connectivity to Auto EVM or any specific network.
          </p>
        </div>
      )}
    </div>
  );
};

