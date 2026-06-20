export type WalletErrorType = 'not_found' | 'rejected' | 'insufficient' | 'unknown';

export interface WalletError {
  type: WalletErrorType;
  message: string;
  hint: string;
}

export function parseWalletError(error: unknown): WalletError {
  const msg =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  // Error Type 1: Wallet not installed / not found
  if (
    msg.includes('not found') ||
    msg.includes('not installed') ||
    msg.includes('install freighter') ||
    msg.includes('no wallet') ||
    msg.includes('extension')
  ) {
    return {
      type: 'not_found',
      message: '🔌 Wallet Not Found',
      hint: 'Freighter wallet is not installed. Click below to install it, then refresh this page.',
    };
  }

  // Error Type 2: User rejected / cancelled
  if (
    msg.includes('reject') ||
    msg.includes('cancel') ||
    msg.includes('denied') ||
    msg.includes('declined') ||
    msg.includes('user closed') ||
    msg.includes('refused')
  ) {
    return {
      type: 'rejected',
      message: '🚫 Transaction Rejected',
      hint: 'You cancelled the transaction in your wallet. Click Vote again and approve it.',
    };
  }

  // Error Type 3: Insufficient balance
  if (
    msg.includes('insufficient') ||
    msg.includes('underfunded') ||
    msg.includes('not enough') ||
    msg.includes('balance')
  ) {
    return {
      type: 'insufficient',
      message: '💸 Insufficient XLM Balance',
      hint: 'You need at least 1 XLM for transaction fees. Fund your testnet wallet using Friendbot.',
    };
  }

  return {
    type: 'unknown',
    message: '⚠️ Something Went Wrong',
    hint: msg || 'An unexpected error occurred. Please try again.',
  };
}
