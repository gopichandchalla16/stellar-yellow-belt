# 🗳️ StellarPoll — Live On-Chain Voting dApp

> 🟡 Level 2 Yellow Belt Submission — Rise In Stellar Journey to Mastery

A live on-chain polling dApp built on **Stellar Testnet** using a **Soroban smart contract**. Users connect any Stellar wallet via **StellarWalletsKit**, cast votes that are stored on-chain, and see real-time results.

---

## ✅ Requirements Checklist

| Requirement | Status |
|---|---|
| StellarWalletsKit multi-wallet integration | ✅ Done |
| 3 error types handled (not found, rejected, insufficient) | ✅ Done |
| Soroban contract deployed on testnet | ✅ Done |
| Contract called from frontend | ✅ Done |
| Transaction status tracking (pending/success/fail) | ✅ Done |
| 2+ meaningful commits | ✅ Done |

---

## 🚀 Features

- ✅ **StellarWalletsKit** — multi-wallet modal (Freighter, Hana, xBull, Lobstr, Rabet)
- ✅ **Soroban Smart Contract** — poll contract deployed on Stellar Testnet
- ✅ **On-chain voting** — each vote is a signed contract call transaction
- ✅ **Real-time results** — live vote percentages with animated progress bars
- ✅ **Transaction status** — pending → success/fail with tx hash
- ✅ **3 Error types handled:**
  - 🔌 Wallet not found / not installed
  - 🚫 Transaction rejected by user
  - 💸 Insufficient XLM balance
- ✅ **Wallet connect/disconnect** with XLM balance display

---

## 📸 Screenshots

### Wallet Options Modal (StellarWalletsKit)
![Wallet Modal](public/screenshot-wallet-modal.jpeg)

### Poll Voting Interface
![Poll Interface](public/screenshot-poll.jpeg)

### Transaction Success with Hash
![Transaction Success](public/screenshot-tx-success.jpeg)

---

## 📋 Contract Details

| Field | Value |
|---|---|
| **Deployed Contract Address** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCN3B` |
| **Network** | Stellar Testnet |
| **Contract Type** | Soroban (Rust) |
| **Explorer** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCN3B) |

### Sample Transaction Hash (contract call)
```
78a7f33328e47960ebee07b1c3d7efd91c9c9be694189ef0e4444addb05a87aa
```
[View on Stellar Explorer](https://stellar.expert/explorer/testnet/tx/78a7f33328e47960ebee07b1c3d7efd91c9c9be694189ef0e4444addb05a87aa)

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS**
- **@creit.tech/stellar-wallets-kit** — multi-wallet modal
- **@stellar/stellar-sdk** — Soroban contract calls
- **Soroban (Rust)** — on-chain poll smart contract
- **Stellar Horizon + Soroban RPC** — testnet APIs

---

## ⚙️ Setup & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/gopichandchalla16/stellar-yellow-belt.git
cd stellar-yellow-belt

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Prerequisites
- Node.js 18+
- [Freighter Wallet](https://freighter.app) (or any Stellar wallet)
- Switch wallet to **Testnet** network

---

## 🪨 Deploying the Smart Contract (Optional - Already Deployed)

```bash
# Install Rust + Stellar CLI
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli --features opt

# Add testnet
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Run deployment script
bash deploy/deploy.sh
```

---

## 🗂️ Project Structure

```
├── contracts/
│   └── poll/
│       └── src/lib.rs        # Soroban smart contract (Rust)
├── deploy/
│   └── deploy.sh          # One-click deployment script
└── src/
    ├── app/
    │   ├── page.tsx          # Main app
    │   └── globals.css       # Styles
    ├── components/
    │   ├── WalletModal.tsx   # StellarWalletsKit modal
    │   ├── PollCard.tsx      # Poll UI with real-time results
    │   ├── TransactionStatus.tsx # Pending/success/fail states
    │   └── ErrorBanner.tsx   # 3 error types display
    └── lib/
        ├── walletKit.ts      # StellarWalletsKit setup
        ├── stellar.ts        # Horizon + Soroban RPC calls
        └── errors.ts         # Error type parsing
```

---

Built with ❤️ for the **Rise In Stellar Journey to Mastery** program.
