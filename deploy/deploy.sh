#!/bin/bash
# =============================================================
# StellarPoll - Soroban Contract Deployment Script
# Run this ONCE to deploy your poll contract to testnet
# =============================================================

set -e

echo "🚀 Deploying StellarPoll contract to Stellar Testnet..."

# 1. Build the contract
echo "🔨 Building Rust contract..."
cd contracts/poll
cargo build --target wasm32-unknown-unknown --release
cd ../..

WASM_PATH="contracts/poll/target/wasm32-unknown-unknown/release/poll.wasm"

# 2. Check identity exists, create if not
if ! stellar keys show mykey 2>/dev/null; then
  echo "🔑 Creating identity 'mykey'..."
  stellar keys generate --global mykey --network testnet
  echo "💸 Funding account via Friendbot..."
  stellar keys fund mykey --network testnet
fi

# 3. Deploy the contract
echo "📤 Deploying contract..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm $WASM_PATH \
  --source mykey \
  --network testnet)

echo ""
echo "✅ Contract deployed successfully!"
echo "📋 CONTRACT_ID: $CONTRACT_ID"
echo ""
echo "⚡ Initializing poll with 3 options..."
stellar contract invoke \
  --id $CONTRACT_ID \
  --source mykey \
  --network testnet \
  -- init --num_options 3

echo ""
echo "🎉 Done! Update these values in your code:"
echo "   src/lib/stellar.ts  → CONTRACT_ID = '$CONTRACT_ID'"
echo "   src/app/page.tsx    → contract address display"
echo "   README.md           → Deployed contract address section"
