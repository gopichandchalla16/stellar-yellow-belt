'use client';
import { TxStatus } from '@/app/page';

interface Props {
  status: TxStatus;
  txHash: string;
  onReset: () => void;
}

export default function TransactionStatus({ status, txHash, onReset }: Props) {
  if (status === 'idle') return null;

  return (
    <div className={`card ${
      status === 'pending' ? 'border-yellow-500/30' :
      status === 'success' ? 'border-teal-500/30 glow-teal' :
      'border-red-500/30'
    }`} style={{ borderWidth: 1, borderStyle: 'solid' }}>
      {status === 'pending' && (
        <div className="text-center py-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-400 font-semibold">Broadcasting Transaction...</p>
          <p className="text-xs text-gray-400 mt-1">Waiting for Stellar Testnet confirmation</p>
          <span className="badge-pending mt-3 inline-block">⏳ Pending</span>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center py-2">
          <div className="text-5xl mb-3">🎉</div>
          <p className="text-teal-400 font-bold text-lg">Vote Confirmed!</p>
          <p className="text-xs text-gray-400 mb-4">Your vote is recorded on Stellar Testnet</p>
          <span className="badge-success mb-4 inline-block">✅ Success</span>
          {txHash && (
            <div className="bg-gray-900 rounded-xl p-3 mt-3 text-left">
              <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
              <p className="text-xs font-mono text-teal-400 break-all">{txHash}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-2 block text-xs text-yellow-400 hover:underline"
              >🔍 View on Stellar Explorer ↗</a>
            </div>
          )}
          <button onClick={onReset} className="btn-outline mt-4 max-w-xs mx-auto">Vote Again</button>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-2">
          <div className="text-5xl mb-3">❌</div>
          <p className="text-red-400 font-bold">Transaction Failed</p>
          <p className="text-xs text-gray-400 mb-4">Check the error above and try again</p>
          <span className="badge-error mb-4 inline-block">❌ Failed</span>
          <button onClick={onReset} className="btn-outline mt-2 max-w-xs mx-auto">Try Again</button>
        </div>
      )}
    </div>
  );
}
