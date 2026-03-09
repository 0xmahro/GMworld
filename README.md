# GM World

A Web3 dApp on **Base** where users send on-chain "Good Morning" or "Good Night" messages in their own language. Messages are stored on-chain and displayed globally with a live feed and world map.

## Project Structure

```
basemorning/
├── contracts/           # Solidity smart contract
│   ├── GMWorld.sol
│   └── foundry.toml
├── frontend/            # Next.js app
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── ...
└── README.md
```

## Smart Contract

### Compile (Foundry)

```bash
cd contracts
forge build
```

### Deploy (manual)

After compiling, deploy to Base:

```bash
# Using Foundry
forge create GMWorld --rpc-url https://mainnet.base.org --private-key $PRIVATE_KEY

# Base Sepolia testnet
forge create GMWorld --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY
```

Or use [Remix](https://remix.ethereum.org) or Hardhat. Paste `GMWorld.sol`, compile, and deploy.

### Add Contract Address

Once deployed, set the contract address:

1. **Option A (recommended):** Create `frontend/.env.local`:

   ```
   NEXT_PUBLIC_GMWORLD_ADDRESS=0xYourDeployedContractAddress
   ```

2. **Option B:** Edit `frontend/lib/contracts.ts` and replace the zero address:

   ```ts
   export const GMWORLD_ADDRESS = '0xYourDeployedContractAddress' as `0x${string}`;
   ```

## Frontend

### Setup

```bash
cd frontend
npm install
```

### Environment

Create `frontend/.env.local`:

```
NEXT_PUBLIC_GMWORLD_ADDRESS=0x...   # After deployment
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Get a WalletConnect Project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com).

### Run Locally

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Features

- **Wallet connect** — RainbowKit with Coinbase Wallet & WalletConnect
- **20 languages** — GM/GN in English, Spanish, French, German, and more
- **Send GM / Send GN** — One-click on-chain transactions
- **Global counters** — GM and GN sent today
- **Live feed** — Recent messages with flag and address
- **World map** — Activity by region based on message language

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, TailwindCSS
- **Web3:** wagmi, RainbowKit, viem, ethers
- **Chain:** Base
- **Map:** react-simple-maps
# GMworld
