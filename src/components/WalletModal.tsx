'use client';
import { useState } from 'react';
import { getWalletKit } from '@/lib/walletKit';

interface Props {
  onConnect: (address: string) => void;
  onError: (error: unknown) => void;
  onClose: () => void;
}

const WALLETS = [
  { id: 'freighter', name: 'Freighter', icon: '🟣', desc: 'Most popular Stellar wallet', installUrl: 'https://freighter.app' },
  { id: 'hana',      name: 'Hana Wallet', icon: '🌸', desc: 'Multi-chain wallet with Stellar support', installUrl: 'https://hana.finance' },
  { id: 'xbull',     name: 'xBull Wallet', icon: '🐂', desc: 'Feature-rich Stellar wallet', installUrl: 'https://xbull.app' },
  { id: 'lobstr',    name: 'Lobstr',      icon: '🦞', desc: 'Simple & secure Stellar wallet', installUrl: 'https://lobstr.co' },
  { id: 'rabet',     name: 'Rabet',       icon: '🔮', desc: 'Browser extension for Stellar', installUrl: 'https://rabet.io' },
];

export default function WalletModal({ onConnect, onError, onClose }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const connectWallet = async (walletId: string) => {
    setConnecting(walletId);
    try {
      const kit = getWalletKit();
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            onConnect(address);
          } catch (err) {
            onError(err);
          }
        },
      });
    } catch (err) {
      onError(err);
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
      <div className="card w-full max-w-md glow-yellow" style={{ border: '1px solid rgba(234,179,8,0.3)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
            <p className="text-sm text-gray-400">Choose your Stellar wallet to continue</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">✕</button>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3 mb-6">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => connectWallet(wallet.id)}
              disabled={!!connecting}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-700 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all text-left disabled:opacity-50"
            >
              <span className="text-2xl">{wallet.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{wallet.name}</p>
                <p className="text-xs text-gray-400">{wallet.desc}</p>
              </div>
              {connecting === wallet.id ? (
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-gray-500 text-sm">→</span>
              )}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500">
          Don&apos;t have a wallet?{' '}
          <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Install Freighter →</a>
        </p>
      </div>
    </div>
  );
}
