export type WalletErrorType = 'not_found' | 'rejected' | 'insufficient' | 'unknown';

export interface WalletError {
  type: WalletErrorType;
  message: string;
  hint: string;
}

export function parseWalletError(error: unknown): WalletError {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Error Type 1: Wallet not found / not installed
  if (
    msg.includes('not found') ||
    msg.includes('not installed') ||
    msg.includes('no wallet') ||
    msg.includes('extension') ||
    msg.includes('freighter') && msg.includes('install')
  ) {
    return {
      type: 'not_found',
      message: 'Wallet not found',
      hint: 'Please install Freighter or another Stellar wallet extension and refresh the page.',
    };
  }

  // Error Type 2: User rejected / cancelled
  if (
    msg.includes('reject') ||
    msg.includes('cancel') ||
    msg.includes('denied') ||
    msg.includes('declined') ||
    msg.includes('user closed') ||
    msg.includes('user refused')
  ) {
    return {
      type: 'rejected',
      message: 'Transaction rejected',
      hint: 'You cancelled the transaction. Click the vote button again and approve it in your wallet.',
    };
  }

  // Error Type 3: Insufficient balance / funds
  if (
    msg.includes('insufficient') ||
    msg.includes('balance') ||
    msg.includes('underfunded') ||
    msg.includes('not enough')
  ) {
    return {
      type: 'insufficient',
      message: 'Insufficient XLM balance',
      hint: 'You need at least 1 XLM to pay for transaction fees. Use the Friendbot to fund your testnet wallet.',
    };
  }

  return {
    type: 'unknown',
    message: 'Something went wrong',
    hint: msg || 'An unexpected error occurred. Please try again.',
  };
}
