'use client';
import { useState } from 'react';
import { SUPPORTED_WALLETS, connectFreighter } from '@/lib/walletKit';

interface Props {
  onConnect: (address: string) => void;
  onError: (error: unknown) => void;
  onClose: () => void;
}

export default function WalletModal({ onConnect, onError, onClose }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleWalletClick = async (walletId: string, installUrl: string) => {
    setConnecting(walletId);
    try {
      const address = await connectFreighter();
      onConnect(address);
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : '';
      if (msg.includes('not found') || msg.includes('install')) {
        window.open(installUrl, '_blank');
      }
      onError(err);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(4,8,18,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md animate-fade-in" style={{
        border: '1px solid rgba(245,197,24,0.25)',
        boxShadow: '0 0 0 1px rgba(245,197,24,0.08), 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,197,24,0.06)'
      }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-lg font-bold text-white">Connect a Wallet</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select your Stellar wallet to cast a vote on-chain</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all text-sm"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] my-4" />

        {/* Wallet Options */}
        <div className="space-y-2 mb-5">
          {SUPPORTED_WALLETS.map((wallet, i) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletClick(wallet.id, wallet.installUrl)}
              disabled={!!connecting}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-white/[0.06]
                hover:border-yellow-500/30 hover:bg-yellow-500/[0.04]
                disabled:opacity-40 disabled:cursor-not-allowed
                transition-all duration-200 text-left group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-yellow-500/10 transition-colors">
                {wallet.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white group-hover:text-yellow-200 transition-colors">
                  {wallet.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{wallet.desc}</p>
              </div>
              {connecting === wallet.id ? (
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              ) : (
                <span className="text-gray-600 group-hover:text-yellow-400 transition-colors text-sm">→</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3 text-center">
          <p className="text-xs text-gray-500">
            Don&apos;t have a wallet?{' '}
            <a href="https://freighter.app" target="_blank" rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 font-medium underline underline-offset-2">
              Install Freighter →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
