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
      style={{ background: 'rgba(4,8,20,0.92)', backdropFilter: 'blur(20px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md animate-fade-in rounded-3xl p-6"
        style={{
          background: 'linear-gradient(145deg, #141B2D 0%, #0F1525 100%)',
          border: '1px solid rgba(245,197,24,0.35)',
          boxShadow: '0 0 0 1px rgba(245,197,24,0.1), 0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(245,197,24,0.08)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Connect a Wallet
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
              Select your Stellar wallet to cast a vote on-chain
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#CBD5E1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '14px', fontWeight: 600
            }}
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '16px' }} />

        {/* Wallet Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {SUPPORTED_WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletClick(wallet.id, wallet.installUrl)}
              disabled={!!connecting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                cursor: connecting ? 'not-allowed' : 'pointer',
                opacity: connecting && connecting !== wallet.id ? 0.5 : 1,
                transition: 'all 0.15s ease',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(245,197,24,0.5)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,197,24,0.07)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
              }}
            >
              {/* Icon */}
              <div style={{
                width: '42px', height: '42px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0
              }}>
                {wallet.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#F1F5F9', marginBottom: '2px' }}>
                  {wallet.name}
                </p>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  {wallet.desc}
                </p>
              </div>

              {/* Arrow / Spinner */}
              {connecting === wallet.id ? (
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid #F5C518',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  flexShrink: 0
                }} />
              ) : (
                <span style={{ color: '#475569', fontSize: '16px', flexShrink: 0 }}>→</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '12px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: '#64748B' }}>
            Don&apos;t have a wallet?{' '}
            <a
              href="https://freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#F5C518', fontWeight: 600, textDecoration: 'underline' }}
            >
              Install Freighter →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
