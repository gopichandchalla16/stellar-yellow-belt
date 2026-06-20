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
    <div className={`card animate-fade-in ${
      status === 'pending'  ? 'glow-yellow' :
      status === 'success'  ? 'glow-teal'   : ''
    }`} style={status === 'error' ? { borderColor: 'rgba(248,113,113,0.25)', boxShadow: '0 0 0 1px rgba(248,113,113,0.1)' } : {}}>

      {status === 'pending' && (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="relative mb-5">
            <div className="w-14 h-14 rounded-full border-2 border-white/10 flex items-center justify-center">
              <div className="w-10 h-10 border-[3px] border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <p className="font-bold text-white mb-1">Broadcasting Transaction</p>
          <p className="text-xs text-gray-400 mb-4">Waiting for Stellar Testnet confirmation...</p>
          <span className="badge-pending">⏳ Pending</span>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-3xl mb-4">
            ✅
          </div>
          <p className="font-bold text-white text-lg mb-1">Vote Confirmed!</p>
          <p className="text-xs text-gray-400 mb-4">Your vote is permanently recorded on-chain</p>
          <span className="badge-success mb-4">Transaction Successful</span>
          {txHash && (
            <div className="w-full bg-black/30 rounded-2xl p-3 text-left border border-white/[0.05] mb-4">
              <p className="text-xs text-gray-500 mb-1.5">Transaction Hash</p>
              <p className="text-xs font-mono text-teal-400 break-all leading-relaxed">{txHash}</p>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 font-medium"
              >
                🔍 View on Stellar Explorer ↗
              </a>
            </div>
          )}
          <button onClick={onReset} className="btn-outline max-w-xs">Vote Again</button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mb-4">
            ❌
          </div>
          <p className="font-bold text-white mb-1">Transaction Failed</p>
          <p className="text-xs text-gray-400 mb-4">Check the error message above and try again</p>
          <span className="badge-error mb-4">Failed</span>
          <button onClick={onReset} className="btn-outline max-w-xs">Try Again</button>
        </div>
      )}
    </div>
  );
}
