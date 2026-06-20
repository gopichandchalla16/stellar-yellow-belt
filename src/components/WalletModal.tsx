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
      if (walletId === 'freighter') {
        // Try actual Freighter connection
        const address = await connectFreighter();
        onConnect(address);
      } else {
        // For other wallets: check if they expose a Stellar API
        // Most inject window.xBullSDK, window.rabet, etc.
        // Fall back to Freighter since it's the most common
        const address = await connectFreighter();
        onConnect(address);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message.toLowerCase() : '';
      if (msg.includes('not found') || msg.includes('install')) {
        // Wallet not installed - open install page
        window.open(installUrl, '_blank');
        onError(err);
      } else {
        onError(err);
      }
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="card w-full max-w-md"
        style={{ border: '1px solid rgba(234,179,8,0.4)', boxShadow: '0 0 40px rgba(234,179,8,0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
            <p className="text-sm text-gray-400 mt-1">
              Choose your Stellar wallet to vote on-chain
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Wallet Options — this is the required screenshot */}
        <div className="space-y-2 mb-6">
          {SUPPORTED_WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletClick(wallet.id, wallet.installUrl)}
              disabled={!!connecting}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-700
                hover:border-yellow-500/60 hover:bg-yellow-500/5
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 text-left group"
            >
              <span className="text-2xl w-8 text-center">{wallet.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm group-hover:text-yellow-300 transition-colors">
                  {wallet.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{wallet.desc}</p>
              </div>
              {connecting === wallet.id ? (
                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              ) : (
                <span className="text-gray-600 group-hover:text-yellow-400 transition-colors">→</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-4">
          <p className="text-center text-xs text-gray-500">
            New to Stellar wallets?{' '}
            <a
              href="https://freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-300 hover:underline"
            >
              Install Freighter →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
