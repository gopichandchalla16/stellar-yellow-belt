import * as StellarSdk from '@stellar/stellar-sdk';

export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
export const HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const SOROBAN_URL = 'https://soroban-testnet.stellar.org';

// Deployed Soroban poll contract on Stellar Testnet
export const CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCN3B';

export const server = new StellarSdk.Horizon.Server(HORIZON_URL);
export const rpc = new StellarSdk.SorobanRpc.Server(SOROBAN_URL);

export async function getAccountBalance(publicKey: string): Promise<string> {
  try {
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

export async function callContractVote(
  publicKey: string,
  optionIndex: number,
  signTx: (xdr: string) => Promise<string>
): Promise<string> {
  const account = await rpc.getAccount(publicKey);
  const contract = new StellarSdk.Contract(CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call('vote', StellarSdk.nativeToScVal(optionIndex, { type: 'u32' }))
    )
    .setTimeout(30)
    .build();

  const preparedTx = await rpc.prepareTransaction(tx);
  const signedXdr = await signTx(preparedTx.toXDR());
  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

  const response = await rpc.sendTransaction(signedTx);
  if (response.status === 'ERROR')
    throw new Error('Transaction failed: ' + JSON.stringify(response.errorResult));

  let getResponse = await rpc.getTransaction(response.hash);
  let attempts = 0;
  while (getResponse.status === 'NOT_FOUND' && attempts < 20) {
    await new Promise((r) => setTimeout(r, 1500));
    getResponse = await rpc.getTransaction(response.hash);
    attempts++;
  }
  if (getResponse.status === 'FAILED') throw new Error('Transaction failed on-chain');
  return response.hash;
}
