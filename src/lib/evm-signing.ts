/**
 * EVM Message Signing Utilities
 * 
 * Provides gasless message signing (EIP-191 personal_sign) via the injected
 * wallet provider (window.ethereum) using ethers.
 * 
 * This is used for the optional wallet suitability self-check feature.
 */

import { BrowserProvider, verifyMessage, getAddress } from 'ethers';

export type WalletType = 'EOA' | 'SAFE_MULTISIG';

export interface SigningResult {
  success: boolean;
  message?: string;
  signature?: string;
  recoveredAddress?: string;
  signerAddress?: string;
  matchesBeneficiary?: boolean;
  error?: string;
}

/**
 * Self-check result summary for inclusion in on-chain transactions
 */
export interface SelfCheckSummary {
  performed: boolean;
  walletType: WalletType;
  signerAddress?: string;
  matchesBeneficiary?: boolean;
  timestamp?: string;
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isRabby?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

/**
 * Check if an EVM wallet provider is available
 */
export function isEvmWalletAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Get the name of the detected wallet
 */
export function getDetectedWalletName(): string | null {
  if (!isEvmWalletAvailable()) return null;
  
  if (window.ethereum?.isRabby) return 'Rabby';
  if (window.ethereum?.isMetaMask) return 'MetaMask';
  return 'EVM Wallet';
}

/**
 * Build the message to be signed for the wallet suitability self-check
 */
export function buildSelfCheckMessage(
  beneficiaryAddress: string,
  walletType: WalletType
): string {
  const timestamp = new Date().toISOString();
  const walletTypeDisplay = walletType === 'EOA' ? 'EOA' : 'SAFE_MULTISIG';
  
  return `Subspace Foundation — Wallet Suitability Self-Check (no gas)

I control the wallet that is currently connected to this browser.

Beneficiary address entered: ${beneficiaryAddress}
Wallet type selected: ${walletTypeDisplay}
Date: ${timestamp}
Site: beneficiary.subspace.foundation

This signature is optional and is not submitted to the Subspace Foundation.`;
}

/**
 * Connect to EVM wallet and request accounts
 */
export async function connectEvmWallet(): Promise<string> {
  if (!isEvmWalletAvailable()) {
    throw new Error('No EVM wallet detected. Please install MetaMask, Rabby, or another compatible wallet.');
  }

  const provider = new BrowserProvider(window.ethereum!);
  const accounts = await provider.send('eth_requestAccounts', []);
  
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts returned from wallet. Please unlock your wallet and try again.');
  }

  return getAddress(accounts[0] as string);
}

/**
 * Request the user to sign a message and recover the signer address
 */
export async function signMessageAndRecover(
  message: string,
  beneficiaryAddress: string,
  walletType: WalletType
): Promise<SigningResult> {
  try {
    if (!isEvmWalletAvailable()) {
      return {
        success: false,
        error: 'No EVM wallet detected. Please install MetaMask, Rabby, or another compatible wallet.'
      };
    }

    const provider = new BrowserProvider(window.ethereum!);
    
    // Request accounts (connects wallet if not connected)
    const accounts = await provider.send('eth_requestAccounts', []);
    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        error: 'No accounts returned from wallet. Please unlock your wallet and try again.'
      };
    }

    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Sign the message
    const signature = await signer.signMessage(message);
    
    // Recover the address from the signature
    const recoveredAddress = verifyMessage(message, signature);
    
    // Normalize addresses for comparison
    const normalizedRecovered = getAddress(recoveredAddress);
    const normalizedBeneficiary = getAddress(beneficiaryAddress);
    const normalizedSigner = getAddress(signerAddress);
    
    // Only perform match check for EOA mode
    const matchesBeneficiary = walletType === 'EOA' 
      ? normalizedRecovered === normalizedBeneficiary 
      : undefined;

    return {
      success: true,
      message,
      signature,
      recoveredAddress: normalizedRecovered,
      signerAddress: normalizedSigner,
      matchesBeneficiary
    };
  } catch (error: unknown) {
    // Handle specific error cases
    if (error && typeof error === 'object' && 'code' in error) {
      const ethError = error as { code: number | string; message?: string };
      
      // User rejected the connection or signature
      if (ethError.code === 4001 || ethError.code === 'ACTION_REJECTED') {
        return {
          success: false,
          error: 'You declined the request. The self-check was cancelled.'
        };
      }
      
      // User rejected request (alternative code)
      if (ethError.code === -32603) {
        return {
          success: false,
          error: 'Request was rejected. Please try again.'
        };
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during signing.'
    };
  }
}

/**
 * Format the signing result for clipboard copy
 */
export function formatResultForClipboard(
  result: SigningResult,
  walletType: WalletType,
  beneficiaryAddress: string
): string {
  if (!result.success || !result.message || !result.signature || !result.recoveredAddress) {
    return 'Signing was not completed successfully.';
  }

  const lines = [
    '=== Wallet Suitability Self-Check Details ===',
    '',
    'Message:',
    result.message,
    '',
    '---',
    '',
    `Signature: ${result.signature}`,
    '',
    `Recovered Address: ${result.recoveredAddress}`,
    `Signer Address: ${result.signerAddress}`,
    `Beneficiary Address: ${beneficiaryAddress}`,
    `Wallet Type: ${walletType === 'EOA' ? 'EOA (single wallet)' : 'Safe multisig'}`,
  ];

  if (walletType === 'EOA') {
    lines.push('');
    lines.push(`Address Match: ${result.matchesBeneficiary ? 'YES ✓' : 'NO ✗'}`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('Note: This signature was NOT submitted to the Subspace Foundation.');
  lines.push('It is for your personal verification only.');
  lines.push('');
  lines.push('Important: This check does not guarantee connectivity to Auto EVM or any specific network.');

  return lines.join('\n');
}

