# Deploying the Poll Contract

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Add testnet config
stellar network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

## Deploy

```bash
bash deploy/deploy.sh
```

Copy the CONTRACT_ID from the output and update `src/lib/stellar.ts`.
