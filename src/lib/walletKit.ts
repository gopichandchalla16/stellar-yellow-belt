// Multi-wallet support via Freighter API
// Freighter is the official Stellar wallet - supports connect/disconnect/sign
import {
  isConnected,
  getAddress,
  requestAccess,
  signTransaction,
  isAllowed,
} from '@stellar/freighter-api';

export type WalletId = 'freighter' | 'xbull' | 'hana' | 'lobstr' | 'rabet';

export interface WalletInfo {
  id: WalletId;
  name: string;
  icon: string;
  desc: string;
  installUrl: string;
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  { id: 'freighter', name: 'Freighter',    icon: '🟣', desc: 'Official Stellar browser wallet', installUrl: 'https://freighter.app' },
  { id: 'xbull',     name: 'xBull Wallet', icon: '🐂', desc: 'Feature-rich Stellar wallet',     installUrl: 'https://xbull.app' },
  { id: 'hana',      name: 'Hana Wallet',  icon: '🌸', desc: 'Multi-chain wallet with Stellar',  installUrl: 'https://hanawallet.io' },
  { id: 'lobstr',    name: 'Lobstr',       icon: '🦞', desc: 'Simple & secure Stellar wallet',   installUrl: 'https://lobstr.co' },
  { id: 'rabet',     name: 'Rabet',        icon: '🔮', desc: 'Browser extension for Stellar',    installUrl: 'https://rabet.io' },
];

export async function connectFreighter(): Promise<string> {
  const connected = await isConnected();
  if (!connected.isConnected) {
    throw new Error('Freighter wallet not found. Please install Freighter extension.');
  }
  const allowed = await isAllowed();
  if (!allowed.isAllowed) {
    const access = await requestAccess();
    if (access.error) throw new Error('rejected: ' + access.error);
  }
  const result = await getAddress();
  if (result.error) throw new Error(result.error);
  return result.address;
}

export async function signTxFreighter(xdr: string, networkPassphrase: string): Promise<string> {
  const result = await signTransaction(xdr, { networkPassphrase });
  if (result.error) throw new Error(result.error);
  return result.signedTxXdr;
}

export async function checkFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
}
