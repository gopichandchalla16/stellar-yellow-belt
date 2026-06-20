'use client';
import { WalletError } from '@/lib/errors';

interface Props {
  error: WalletError;
  onClose: () => void;
}

const ERROR_ICONS: Record<string, string> = {
  not_found:    '🔌',
  rejected:     '🚫',
  insufficient: '💸',
  unknown:      '⚠️',
};

export default function ErrorBanner({ error, onClose }: Props) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{ERROR_ICONS[error.type]}</span>
          <div>
            <p className="font-semibold text-red-400 text-sm">{error.message}</p>
            <p className="text-xs text-gray-400 mt-1">{error.hint}</p>
            {error.type === 'not_found' && (
              <a href="https://freighter.app" target="_blank" rel="noopener noreferrer"
                className="text-xs text-yellow-400 hover:underline mt-2 inline-block">Install Freighter →</a>
            )}
            {error.type === 'insufficient' && (
              <a href="https://laboratory.stellar.org/#account-creator?network=test" target="_blank" rel="noopener noreferrer"
                className="text-xs text-yellow-400 hover:underline mt-2 inline-block">Fund via Friendbot →</a>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none">✕</button>
      </div>
    </div>
  );
}
