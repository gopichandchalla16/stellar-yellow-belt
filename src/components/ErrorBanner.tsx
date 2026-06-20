'use client';
import { WalletError } from '@/lib/errors';

interface Props {
  error: WalletError;
  onClose: () => void;
}

const ERROR_META: Record<string, { icon: string; accent: string }> = {
  not_found:    { icon: '🔌', accent: 'border-orange-500/30 bg-orange-500/[0.07]' },
  rejected:     { icon: '🚫', accent: 'border-red-500/30 bg-red-500/[0.07]' },
  insufficient: { icon: '💸', accent: 'border-yellow-500/30 bg-yellow-500/[0.07]' },
  unknown:      { icon: '⚠️', accent: 'border-gray-500/30 bg-gray-500/[0.07]' },
};

export default function ErrorBanner({ error, onClose }: Props) {
  const meta = ERROR_META[error.type] ?? ERROR_META.unknown;
  return (
    <div className={`rounded-2xl border p-4 animate-fade-in ${meta.accent}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">{meta.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm">{error.message}</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{error.hint}</p>
          {error.type === 'not_found' && (
            <a href="https://freighter.app" target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 font-medium">
              Install Freighter →
            </a>
          )}
          {error.type === 'insufficient' && (
            <a href="https://laboratory.stellar.org/#account-creator?network=test" target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 font-medium">
              Fund via Friendbot →
            </a>
          )}
        </div>
        <button onClick={onClose}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-xs transition-all flex-shrink-0">
          ✕
        </button>
      </div>
    </div>
  );
}
