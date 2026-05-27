# Autonomys EVM Beneficiary Address Association

A React application that allows users to verify their EVM addresses by submitting them to the Autonomys Network through a `system.remark` transaction. This creates a permanent on-chain record linking a Substrate wallet to an EVM address for beneficiary verification purposes.

Live at [beneficiary.subspace.foundation](https://beneficiary.subspace.foundation).

## Features

### Core Functionality
- **EVM Beneficiary Address Association** — Submit EVM addresses to Autonomys Network via `system.remark` transactions
- **Address Validation** — Full EIP-55 checksum validation for EVM addresses
- **Transaction Tracking** — Real-time status updates and transaction hash display
- **Network Integration** — Direct connection to Autonomys Network mainnet
- **Wallet Suitability Self-Check** — Optional gasless message signing to verify wallet access (see below)

### Wallet Integration (Auto SDK)
- **`@autonomys/auto-wallet-react`** — Provides `WalletProvider`, `WalletButton`, `WalletModal`, and `useWallet` hook out of the box
- **Multi-wallet support** — Talisman, SubWallet, Polkadot.js, and other Substrate wallet extensions
- **Persistent connections** — Auto-reconnect on page reload via the provider's built-in storage
- **Multi-account management** — Easy account switching through the wallet modal

### Technical Features
- **TypeScript** — Full type safety throughout the application
- **React 19** with functional components and hooks
- **Vite 7** — Fast builds and development server
- **react-router-dom 7** — Client-side routing (`/` and `/claim` pages)
- **Tailwind CSS** with Radix UI components for a responsive UI

## Quick Start

### Prerequisites

- Node.js 20+
- Yarn 1.x (pinned via `packageManager` field)
- A Substrate wallet browser extension:
  - [Talisman](https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld)
  - [SubWallet](https://chrome.google.com/webstore/detail/subwallet-polkadot-extens/onhogfjeacnfoofkfgppdlbmlmnplgbn)
  - [Polkadot.js](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd)
- For the optional wallet self-check, an EVM wallet extension:
  - [MetaMask](https://metamask.io/)
  - [Rabby](https://rabby.io/)
  - [Frame](https://frame.sh/) (hardware wallet support)

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

# Type checking
yarn type-check
```

The dev server starts at `http://localhost:5173`.

## How Verification Works

### The Process
1. **Connect Wallet** — Connect your Substrate wallet via the header button (powered by `@autonomys/auto-wallet-react`)
2. **Enter EVM Address** — Input your EVM address with automatic checksum validation
3. **Optional Self-Check** — Optionally sign a gasless message to verify you control the EVM wallet
4. **Confirm Attestation** — Acknowledge that you control the address and understand the implications
5. **Submit Transaction** — Sign and submit a `system.remark` transaction to Autonomys Network mainnet
6. **Get Transaction Hash** — Receive the transaction hash as proof of association
7. **Share with Team** — Send the transaction hash to the Subspace Foundation

### What Happens On-Chain
- A `system.remark` extrinsic is created with a structured association record
- This transaction is permanently recorded on the Autonomys blockchain
- The transaction links your Substrate account to your EVM address with a full audit trail
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
- `SUBSPACE_ASSOC:v1` — Stable prefix and version for reliable parsing
- `ss58` — Your Substrate address (automatically filled from the connected wallet)
- `evm` — Your EVM address with EIP-55 checksum validation
- `evm_self_check` — Result of the optional wallet self-check:
  - `not_performed` — User did not run the self-check
  - `matched` — Self-check passed (signer matches beneficiary for EOA, or owner signed for Safe)
  - `not_matched` — Self-check failed (signer does not match entered beneficiary address)
- `scope=beneficiary` — Indicates this is for beneficiary verification
- `nonce` — UUIDv4 for replay protection
- `ts` — ISO8601 timestamp for audit trail

### Explorer Integration
Successful transactions can be viewed on the Autonomys Network explorer:
```
https://autonomys.subscan.io/extrinsic/[transaction-hash]
```

## Wallet Suitability Self-Check (Optional)

Before submitting the verification transaction, users can perform an **optional gasless self-check** to confirm they control the EVM wallet they're entering. This feature uses EIP-191 `personal_sign` message signing.

### Purpose

- **User Confidence** — Helps users verify they have signing access to their wallet before committing to the on-chain verification
- **No Cost** — Uses gasless message signing (no transaction fees)
- **Privacy** — The signature is never submitted anywhere; it's purely for local verification
- **Safe Multisig Support** — Works with Safe wallets by allowing owner EOAs to sign

### Important Limitations

> **This check does not guarantee connectivity to Auto EVM or any specific network.**

The self-check uses off-chain message signing (EIP-191 `personal_sign`), which:
- Works regardless of which network your wallet is connected to
- Only confirms you can sign messages with your private key
- Does not verify your wallet can interact with Auto EVM
- Does not verify your wallet has funds or can submit transactions on any chain

To interact with Auto EVM, you will need to add the Auto EVM network to your wallet and ensure you have the necessary funds for gas when claiming tokens in the future.

### How It Works

1. **Select Wallet Type** — Choose between "EOA (single wallet)" or "Safe multisig"
2. **Click Sign Button** — The app connects to your EVM wallet (MetaMask, Rabby, etc.)
3. **Sign Message** — Your wallet prompts you to sign a human-readable message
4. **View Results** — The app recovers the signer address from the signature

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

## Project Structure

```
src/
├── App.tsx                         # Root: WalletProvider + BrowserRouter + Routes
├── main.tsx                        # Application entry point
├── index.css                       # Global styles
├── pages/
│   ├── HomePage.tsx                # Main verification page (wallet status + form + FAQ)
│   ├── ClaimGuidePage.tsx          # Token claim instructions page
│   └── index.ts
├── components/
│   ├── layout/
│   │   ├── Layout.tsx              # Header with WalletButton/WalletModal, page shell
│   │   └── index.ts
│   ├── verification/
│   │   ├── verification-form.tsx   # EVM address input, attestation, remark submission
│   │   ├── wallet-self-check.tsx   # Optional gasless EVM signing self-check
│   │   ├── faq-section.tsx         # Verification FAQ accordion
│   │   └── index.ts
│   ├── claim/
│   │   ├── ClaimFaqSection.tsx     # Claim guide FAQ
│   │   └── index.ts
│   └── ui/                         # Base UI components (Button, Dialog, Alert)
├── lib/
│   ├── evm-validation.ts           # EIP-55 checksum validation (@noble/hashes)
│   ├── evm-signing.ts              # EVM message signing utilities (ethers)
│   └── utils.ts                    # General utilities (cn helper)
└── services/
    └── autonomys-api.ts            # Polkadot ApiPromise connection + remark submission
```

## Architecture

### Wallet Integration

Wallet functionality is provided entirely by `@autonomys/auto-wallet-react`. The app wraps everything in a `WalletProvider`:

```tsx
<WalletProvider config={{
  dappName: 'Autonomys Beneficiary Verification',
  storageKey: 'autonomys-beneficiary-wallet',
  ss58Prefix: 42,
}}>
  {/* app content */}
</WalletProvider>
```

Components use the `useWallet` hook from the same package to access connection state, the selected account, and the injector for transaction signing:

```tsx
import { useWallet } from '@autonomys/auto-wallet-react';

const { isConnected, selectedAccount, injector } = useWallet();
```

The `WalletButton` and `WalletModal` components are also imported directly from `@autonomys/auto-wallet-react` and used in the `Layout` component.

### Address Formatting

The app displays addresses in both standard SS58 format (prefix 42, starting with "5") and Subspace format (prefix 6094, starting with "su") using `@autonomys/auto-utils`:

```tsx
import { address } from '@autonomys/auto-utils';

const subspaceAddress = address(selectedAccount.address, 6094);
```

### Transaction Submission

The `AutonomysApiService` in `src/services/autonomys-api.ts` manages the WebSocket connection to the Autonomys mainnet RPC (`wss://rpc.mainnet.subspace.foundation/ws`) and handles `system.remark` extrinsic creation, signing via the wallet extension injector, and status tracking.

### Routing

| Route | Page | Wallet UI |
|-------|------|-----------|
| `/` | `HomePage` — verification form, wallet status, FAQ | Shown |
| `/claim` | `ClaimGuidePage` — token claim instructions | Hidden |

## Dependencies

### Runtime
| Package | Purpose |
|---------|---------|
| `@autonomys/auto-wallet-react` | Wallet UI components and `useWallet` hook |
| `@autonomys/auto-wallet` | Wallet connection internals (peer dependency) |
| `@autonomys/auto-utils` | Address formatting utilities |
| `@autonomys/auto-consensus` | Autonomys consensus utilities |
| `@polkadot/api` | Substrate RPC and transaction construction |
| `@polkadot/extension-dapp` | Wallet extension injection |
| `ethers` | EVM wallet interaction and message signing for self-check |
| `@noble/hashes` | EIP-55 checksum validation |
| `react` / `react-dom` | React 19 |
| `react-router-dom` | Client-side routing |
| `zustand` | State management |
| `@radix-ui/react-dialog` | Modal component |
| `tailwindcss` | Styling |
| `lucide-react` | Icons |

### Dev
| Package | Purpose |
|---------|---------|
| `vite` | Build tool (v7) |
| `@vitejs/plugin-react` | React plugin for Vite |
| `typescript` | Type checking (v5.7) |
| `eslint` | Linting |
| `gh-pages` | Manual deployment helper |

## Deployment

The app is deployed to **GitHub Pages** via a GitHub Actions workflow (`.github/workflows/deploy.yml`):

- **Trigger:** Push to `main` builds and deploys; pull requests build only
- **Node version:** 20
- **Build:** `yarn install --frozen-lockfile && yarn build`
- **Custom domain:** `beneficiary.subspace.foundation` (configured via `CNAME` file)
- **SPA routing:** The build script copies `index.html` to `404.html` for client-side route support on GitHub Pages

## Configuration

No environment variables are required. Key configuration is hardcoded:

- **Dapp name / storage key / SS58 prefix:** Set in the `WalletProvider` config in `src/App.tsx`
- **RPC endpoint:** `wss://rpc.mainnet.subspace.foundation/ws` in `src/services/autonomys-api.ts`
- **Remark schema version:** `SUBSPACE_ASSOC:v1` in `src/services/autonomys-api.ts`

## Troubleshooting

### Common Issues

1. **"No wallets detected"**
   - Ensure a Substrate wallet extension is installed and enabled
   - Refresh the page after installing an extension

2. **Transaction signing fails**
   - Check if the wallet popup was blocked by the browser
   - Try approving the connection request promptly

3. **EVM self-check shows wrong address**
   - In EOA mode, the recovered address must match the entered beneficiary address
   - In Safe mode, the recovered address will be the owner's EOA, not the Safe address — this is expected

## License

This project is based on code from the Autonomys staking portal. Check the original repository for license information.
