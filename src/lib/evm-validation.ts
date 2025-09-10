/**
 * EVM Address Validation Utilities
 * 
 * Provides validation for Ethereum addresses including checksum verification
 * as defined in EIP-55: https://eips.ethereum.org/EIPS/eip-55
 */

import { keccak_256 } from '@noble/hashes/sha3';

/**
 * Check if a string is a valid Ethereum address format (0x + 40 hex characters)
 */
export function isValidEvmAddressFormat(address: string): boolean {
  // Must start with 0x and be followed by exactly 40 hexadecimal characters
  const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return evmAddressRegex.test(address);
}

/**
 * Calculate the checksum for an Ethereum address according to EIP-55
 */
export function calculateEvmAddressChecksum(address: string): string {
  // Remove 0x prefix and convert to lowercase
  const addressWithoutPrefix = address.slice(2).toLowerCase();
  
  // Calculate keccak256 hash of the lowercase address
  const addressBytes = new TextEncoder().encode(addressWithoutPrefix);
  const hash = keccak_256(addressBytes);
  const hashHex = Array.from(hash, byte => byte.toString(16).padStart(2, '0')).join('');
  
  let checksumAddress = '0x';
  
  for (let i = 0; i < addressWithoutPrefix.length; i++) {
    const char = addressWithoutPrefix[i];
    const hashChar = hashHex[i];
    
    // If the hash character is >= 8, capitalize the address character
    if (parseInt(hashChar, 16) >= 8) {
      checksumAddress += char.toUpperCase();
    } else {
      checksumAddress += char.toLowerCase();
    }
  }
  
  return checksumAddress;
}

/**
 * Validate an Ethereum address checksum according to EIP-55
 */
export function isValidEvmAddressChecksum(address: string): boolean {
  if (!isValidEvmAddressFormat(address)) {
    return false;
  }
  
  // If the address is all lowercase or all uppercase, it's valid (no checksum)
  const addressWithoutPrefix = address.slice(2);
  if (addressWithoutPrefix === addressWithoutPrefix.toLowerCase() || 
      addressWithoutPrefix === addressWithoutPrefix.toUpperCase()) {
    return true;
  }
  
  // Check if the address matches its checksum
  const checksumAddress = calculateEvmAddressChecksum(address);
  return address === checksumAddress;
}

/**
 * Comprehensive EVM address validation
 */
export function validateEvmAddress(address: string): {
  isValid: boolean;
  hasValidFormat: boolean;
  hasValidChecksum: boolean;
  normalizedAddress: string | null;
  error: string | null;
} {
  // Trim whitespace
  const trimmedAddress = address.trim();
  
  // Check if empty
  if (!trimmedAddress) {
    return {
      isValid: false,
      hasValidFormat: false,
      hasValidChecksum: false,
      normalizedAddress: null,
      error: 'EVM address is required'
    };
  }
  
  // Check if starts with 0x
  if (!trimmedAddress.startsWith('0x')) {
    return {
      isValid: false,
      hasValidFormat: false,
      hasValidChecksum: false,
      normalizedAddress: null,
      error: 'EVM address must start with 0x'
    };
  }
  
  // Check length
  if (trimmedAddress.length !== 42) {
    return {
      isValid: false,
      hasValidFormat: false,
      hasValidChecksum: false,
      normalizedAddress: null,
      error: `EVM address must be exactly 42 characters (got ${trimmedAddress.length})`
    };
  }
  
  // Check if contains only hex characters
  if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
    return {
      isValid: false,
      hasValidFormat: false,
      hasValidChecksum: false,
      normalizedAddress: null,
      error: 'EVM address contains invalid characters. Only hexadecimal characters (0-9, a-f, A-F) are allowed after 0x'
    };
  }
  
  // At this point format is valid
  // Check checksum
  const hasValidChecksum = isValidEvmAddressChecksum(trimmedAddress);
  if (!hasValidChecksum) {
    return {
      isValid: false,
      hasValidFormat: true,
      hasValidChecksum: false,
      normalizedAddress: null,
      error: 'Invalid EVM address checksum. Please verify the address is correct.'
    };
  }
  
  // Generate normalized (checksummed) address
  const normalizedAddress = calculateEvmAddressChecksum(trimmedAddress);
  
  return {
    isValid: true,
    hasValidFormat: true,
    hasValidChecksum: true,
    normalizedAddress,
    error: null
  };
}
