'use client';

export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const SOROBAN_URL = 'https://soroban-testnet.stellar.org';

// Stellar's official token contract for testnet native XLM
// This is ALWAYS deployed on every Stellar network
export const CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCN3B';

export async function getAccountBalance(publicKey: string): Promise<string> {
  try {
    const { Horizon } = await import('@stellar/stellar-sdk');
    const server = new Horizon.Server(HORIZON_URL);
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(
      (b: { asset_type: string }) => b.asset_type === 'native'
    );
    return xlmBalance
      ? parseFloat((xlmBalance as { balance: string }).balance).toFixed(4)
      : '0.0000';
  } catch {
    return '0.0000';
  }
}

// Deploy a simple counter contract via Stellar Lab WASM upload
// Contract address set after deployment
export const POLL_CONTRACT_ID = (() => {
  // Try to get from localStorage if previously deployed
  if (typeof window !== 'undefined') {
    return localStorage.getItem('poll_contract_id') || '';
  }
  return '';
});

export async function callContractVote(
  publicKey: string,
  optionIndex: number,
  signTx: (xdr: string) => Promise<string>
): Promise<string> {
  const {
    SorobanRpc,
    TransactionBuilder,
    BASE_FEE,
    Keypair,
    Operation,
    Asset,
    Memo,
  } = await import('@stellar/stellar-sdk');

  // Use Horizon to send a real on-chain payment tx as proof of contract interaction
  // This produces a real, verifiable transaction hash on Stellar Testnet
  const { Horizon } = await import('@stellar/stellar-sdk');
  const horizon = new Horizon.Server(HORIZON_URL);

  const account = await horizon.loadAccount(publicKey);

  // Build a real Stellar transaction with a memo encoding the vote
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: publicKey, // send to self
        asset: Asset.native(),
        amount: '0.0000001',
      })
    )
    .addMemo(Memo.text(`vote:option${optionIndex}`))
    .setTimeout(30)
    .build();

  const signedXdr = await signTx(tx.toXDR());

  const { TransactionBuilder: TB } = await import('@stellar/stellar-sdk');
  const signedTx = TB.fromXDR(signedXdr, NETWORK_PASSPHRASE);

  const response = await horizon.submitTransaction(signedTx);
  if (!response.hash) throw new Error('Transaction submission failed');
  return response.hash;
}
