# Substrate Wallet Integration Demo

A standalone demo project showcasing the Substrate wallet integration extracted from the Autonomys staking portal. This project demonstrates how to integrate multiple Substrate wallets (Talisman, SubWallet, Polkadot.js) into a React application.

## Features

✅ **Multi-wallet support** - Talisman, SubWallet, and Polkadot.js extensions  
✅ **Persistent connections** - Auto-reconnect on page reload  
✅ **Multi-account management** - Easy account switching  
✅ **Error handling** - User-friendly error messages and retry logic  
✅ **TypeScript support** - Full type safety  
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

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Base UI components (Button, Dialog, Alert)
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
│   └── utils.ts             # Utility functions
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
