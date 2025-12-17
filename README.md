# Autonomys EVM Beneficiary Address Association

A React application that allows users to verify their EVM addresses by submitting them to the Autonomys Network through a `system.remark` transaction. This creates a permanent on-chain record linking a Substrate wallet to an EVM address for verification purposes.

## Features

### Core Functionality
✅ **EVM Beneficiary Address Association** - Submit EVM addresses to Autonomys Network via `system.remark` transactions  
✅ **Address Validation** - Full EIP-55 checksum validation for EVM addresses  
✅ **Transaction Tracking** - Real-time status updates and transaction hash display  
✅ **Network Integration** - Direct connection to Autonomys Network mainnet  
✅ **Wallet Suitability Self-Check** - Optional gasless message signing to verify wallet access (see below)  

### Wallet Integration
✅ **Multi-wallet support** - Talisman, SubWallet, and Polkadot.js extensions  
✅ **Persistent connections** - Auto-reconnect on page reload  
✅ **Multi-account management** - Easy account switching  
✅ **Transaction signing** - Secure transaction signing through wallet extensions  

### Technical Features
✅ **Error handling** - Comprehensive error handling and user-friendly messages  
✅ **TypeScript support** - Full type safety throughout the application  
✅ **Modern React patterns** - Hooks, functional components, Zustand state management  
✅ **Responsive UI** - Built with Tailwind CSS and Radix UI components  

## Quick Start

### Prerequisites

- Node.js 18+
- Yarn 4+
- At least one Substrate wallet extension installed:
  - [Talisman](https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld)
  - [SubWallet](https://chrome.google.com/webstore/detail/subwallet-polkadot-extens/onhogfjeacnfoofkfgppdlbmlmnplgbn)
  - [Polkadot.js](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd)
- For the optional wallet self-check: an EVM wallet extension:
  - [MetaMask](https://metamask.io/)
  - [Rabby](https://rabby.io/)
  - [Frame](https://frame.sh/) (for hardware wallet support)

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

The app will be available at `http://localhost:5173`

## How Verification Works

### The Process
1. **Connect Wallet**: Connect your Substrate wallet (Talisman, SubWallet, or Polkadot.js)
2. **Enter EVM Address**: Input your EVM address with automatic checksum validation
3. **Submit Transaction**: Sign and submit a `system.remark` transaction to Autonomys Network
4. **Get Transaction Hash**: Receive the transaction hash as proof of verification
5. **Share with Team**: Send the transaction hash to the project team for validation

### What Happens On-Chain
- The application creates a `system.remark` extrinsic with a structured association record
- This transaction is permanently recorded on the Autonomys blockchain
- The transaction links your Substrate account to your EVM address with full audit trail
- The transaction hash serves as cryptographic proof of this link

### Transaction Content Format
```
SUBSPACE_ASSOC:v1
ss58=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
evm=0x742d35Cc6634C0532925a3b8D4e5D7e78c7c8e5B
evm_self_check=matched
scope=beneficiary
nonce=550e8400-e29b-41d4-a716-446655440000
ts=2024-01-15T10:30:00.000Z
```

**Schema Details:**
- `SUBSPACE_ASSOC:v1` - Stable prefix and version for reliable parsing
- `ss58` - Your Substrate address (automatically filled)
- `evm` - Your EVM address with EIP-55 checksum validation
- `evm_self_check` - Result of the optional wallet self-check:
  - `not_performed` - User did not run the self-check
  - `matched` - Self-check passed (signer matches beneficiary for EOA, or owner signed for Safe)
  - `not_matched` - Self-check failed (signer does not match entered beneficiary address)
- `scope=beneficiary` - Indicates this is for beneficiary verification
- `nonce` - UUIDv4 for replay protection
- `ts` - ISO8601 timestamp for audit trail

### Explorer Integration
Successful transactions can be viewed on the Autonomys Network explorer:
```
https://autonomys.subscan.io/extrinsic/[transaction-hash]
```

## Wallet Suitability Self-Check (Optional)

Before submitting the verification transaction, users can perform an **optional gasless self-check** to confirm they control the EVM wallet they're entering. This feature uses EIP-191 `personal_sign` message signing.

### Purpose

- **User Confidence**: Helps users verify they have signing access to their wallet before committing to the on-chain verification
- **No Cost**: Uses gasless message signing (no transaction fees)
- **Privacy**: The signature is never submitted anywhere—it's purely for local verification
- **Safe Multisig Support**: Works with Safe wallets by allowing owner EOAs to sign

### Important Limitations

> ⚠️ **This check does not guarantee connectivity to Auto EVM or any specific network.**

The self-check uses off-chain message signing (EIP-191 `personal_sign`), which:
- Works regardless of which network your wallet is connected to
- Only confirms you can sign messages with your private key
- Does not verify your wallet can interact with Auto EVM
- Does not verify your wallet has funds or can submit transactions on any chain

To interact with Auto EVM, you will need to add the Auto EVM network to your wallet and ensure you have the necessary funds for gas when claiming tokens in the future.

### How It Works

1. **Select Wallet Type**: Choose between "EOA (single wallet)" or "Safe multisig"
2. **Click Sign Button**: The app connects to your EVM wallet (MetaMask, Rabby, etc.)
3. **Sign Message**: Your wallet prompts you to sign a human-readable message
4. **View Results**: The app recovers the signer address from the signature

### Message Format

```
Subspace Foundation — Wallet Suitability Self-Check (no gas)

I control the wallet that is currently connected to this browser.

Beneficiary address entered: 0x742d35Cc6634C0532925a3b8D4e5D7e78c7c8e5B
Wallet type selected: EOA
Date: 2024-01-15T10:30:00.000Z
Site: beneficiary.subspace.foundation

This signature is optional and is not submitted to the Subspace Foundation.
```

### EOA vs Safe Multisig Mode

| Mode | Behavior |
|------|----------|
| **EOA** | Signs message and checks if recovered address matches the entered beneficiary address |
| **Safe multisig** | Signs message using an owner EOA; no address match check (Safe addresses cannot sign directly) |

### Safe Multisig Considerations

Safe (formerly Gnosis Safe) addresses are smart contracts and cannot sign messages directly. When using Safe mode:

- An owner EOA wallet signs the message
- The recovered address will be the owner's address, not the Safe address
- This confirms you can sign as an owner, which is required for Safe transaction approval
- The address match check is intentionally skipped to avoid confusion

### Technical Implementation

The self-check uses the `ethers` library:

```typescript
import { BrowserProvider, verifyMessage, getAddress } from 'ethers';

const provider = new BrowserProvider(window.ethereum);
await provider.send('eth_requestAccounts', []);
const signer = await provider.getSigner();
const signature = await signer.signMessage(message);
const recovered = verifyMessage(message, signature);
```

### Copy Details

After signing, users can copy the full details to clipboard including:
- The signed message
- The signature
- The recovered signer address
- Match status (for EOA mode)

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Base UI components (Button, Dialog, Alert)
│   ├── verification/        # Verification-specific components
│   │   ├── verification-form.tsx  # Main EVM address verification form
│   │   └── wallet-self-check.tsx  # Optional gasless wallet self-check
│   └── wallet/              # Wallet-specific components
│       ├── wallet-button.tsx    # Connect button with account dropdown
│       ├── wallet-modal.tsx     # Connection modal
│       ├── wallet-option.tsx    # Individual wallet option
│       └── index.ts            # Component exports
├── hooks/
│   └── use-wallet.ts        # Main wallet hook
├── stores/
│   └── wallet-store.ts      # Zustand store for wallet state
├── types/
│   └── wallet.ts            # TypeScript interfaces
├── constants/
│   └── wallets.ts           # Wallet configuration
├── lib/
│   ├── evm-signing.ts       # EVM message signing utilities (ethers)
│   ├── evm-validation.ts    # EVM address validation (EIP-55 checksum)
│   └── utils.ts             # General utility functions
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles
```

## How It Works

### Core Architecture

1. **State Management**: Uses Zustand with persistence middleware
2. **Wallet Detection**: Automatically detects installed wallet extensions
3. **Connection Flow**: Handles wallet connection, account selection, and error states
4. **Persistence**: Saves wallet preferences and auto-reconnects on page load
5. **Address Formatting**: Converts addresses to the correct SS58 format

### Key Components

- **`useWallet` Hook**: Primary interface for wallet functionality
- **`WalletButton`**: Connect button that shows account info when connected
- **`WalletModal`**: Modal for selecting and connecting to wallets
- **`useWalletStore`**: Zustand store managing all wallet state

### Connection Flow

1. User clicks "Connect Wallet"
2. Modal opens showing available wallets
3. User selects a wallet extension
4. Extension prompts for authorization
5. App receives account list and selects first account
6. Connection state is persisted for future sessions

## Customization

### For Different Substrate Chains

1. **Update Address Format**: Modify the `address()` function call in `wallet-store.ts`:
   ```typescript
   // Change from Autonomys format (6094) to your chain's SS58 format
   address: address(account.address, YOUR_CHAIN_SS58_PREFIX)
   ```

2. **Update Chain Configuration**: Modify constants in `constants/wallets.ts`:
   ```typescript
   export const DAPP_NAME = 'Your DApp Name';
   export const WALLET_STORAGE_KEY = 'your-dapp-wallet-preferences';
   ```

3. **Add Custom Wallets**: Add new wallet extensions to the supported list:
   ```typescript
   export const SUPPORTED_WALLET_EXTENSIONS = [
     'talisman',
     'subwallet-js', 
     'polkadot-js',
     'your-custom-wallet'
   ] as const;
   ```

### UI Customization

- **Styling**: Modify Tailwind classes in components
- **Colors**: Update CSS custom properties in `index.css`
- **Layout**: Customize the `App.tsx` component structure

## Integration Guide

### Adding to Existing Project

1. **Copy Core Files**:
   ```
   src/stores/wallet-store.ts
   src/hooks/use-wallet.ts
   src/types/wallet.ts
   src/constants/wallets.ts
   ```

2. **Install Dependencies**:
   ```bash
   yarn add @talismn/connect-wallets @autonomys/auto-utils zustand
   ```

3. **Use in Components**:
   ```tsx
   import { useWallet } from './hooks/use-wallet';
   
   function MyComponent() {
     const { isConnected, selectedAccount, connectWallet } = useWallet();
     // Your component logic
   }
   ```

### API Reference

#### `useWallet` Hook

```typescript
const {
  // State
  isConnected: boolean;
  isLoading: boolean;
  connectionError: string | null;
  selectedAccount: WalletAccount | null;
  accounts: WalletAccount[];
  injector: InjectedExtension | null;
  availableWallets: Wallet[];
  
  // Actions
  connectWallet: (extensionName: string) => Promise<void>;
  disconnectWallet: () => void;
  selectAccount: (address: string) => void;
  clearError: () => void;
  
  // Computed
  hasWallets: boolean;
  selectedAddress: string | null;
  isConnecting: boolean;
  isInitializing: boolean;
  canConnect: boolean;
} = useWallet();
```

## Troubleshooting

### Common Issues

1. **"No wallets detected"**
   - Ensure wallet extensions are installed and enabled
   - Refresh the page after installing extensions

2. **"Connection timeout"**
   - Check if wallet popup was blocked
   - Try approving the connection request faster

3. **"Account no longer exists"**
   - Account was removed from the wallet extension
   - Clear browser storage and reconnect

### Development

```bash
# Type checking
yarn type-check

# Linting (if configured)
yarn lint

# Clean build
rm -rf dist node_modules && yarn install
```

## Dependencies

### Core Dependencies
- `@talismn/connect-wallets` - Wallet connection library
- `@autonomys/auto-utils` - Autonomys network utilities
- `ethers` - EVM wallet interaction and message signing
- `zustand` - State management
- `react` & `react-dom` - React framework

### UI Dependencies
- `@radix-ui/react-dialog` - Modal component
- `tailwindcss` - Styling framework
- `lucide-react` - Icons

## License

This demo project is based on code from the Autonomys staking portal. Check the original repository for license information.

## Contributing

This is a demo project extracted for educational purposes. For production use, consider:

1. Adding comprehensive error handling
2. Implementing proper logging
3. Adding unit tests
4. Customizing for your specific chain requirements

## Next Steps

- **Transaction Signing**: Use the `injector` to sign and submit transactions
- **Balance Integration**: Add balance fetching for connected accounts  
- **Chain Integration**: Connect to your specific Substrate chain
- **Advanced Features**: Add features like account creation, backup, etc.

For questions or issues, refer to the original Autonomys staking portal repository or Substrate wallet documentation.
