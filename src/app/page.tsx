'use client';
import { useState, useEffect, useCallback } from 'react';
import WalletModal from '@/components/WalletModal';
import PollCard from '@/components/PollCard';
import TransactionStatus from '@/components/TransactionStatus';
import ErrorBanner from '@/components/ErrorBanner';
import { getAccountBalance } from '@/lib/stellar';
import { parseWalletError, WalletError } from '@/lib/errors';
import { getWalletKit } from '@/lib/walletKit';

export type TxStatus = 'idle' | 'pending' | 'success' | 'error';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0.0000');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [walletError, setWalletError] = useState<WalletError | null>(null);
  const [votedOption, setVotedOption] = useState<number | null>(null);

  const fetchBalance = useCallback(async (addr: string) => {
    const bal = await getAccountBalance(addr);
    setBalance(bal);
  }, []);

  useEffect(() => {
    if (walletAddress) fetchBalance(walletAddress);
  }, [walletAddress, fetchBalance]);

  const handleConnect = async (address: string) => {
    setWalletAddress(address);
    setShowWalletModal(false);
    setWalletError(null);
    await fetchBalance(address);
  };

  const handleConnectError = (error: unknown) => {
    setWalletError(parseWalletError(error));
    setShowWalletModal(false);
  };

  const handleDisconnect = async () => {
    try {
      const kit = getWalletKit();
      await kit.disconnect();
    } catch {}
    setWalletAddress('');
    setBalance('0.0000');
    setVotedOption(null);
    setTxStatus('idle');
    setTxHash('');
    setWalletError(null);
  };

  const handleVote = async (optionIndex: number) => {
    if (!walletAddress) { setShowWalletModal(true); return; }
    setWalletError(null);
    setTxStatus('pending');
    setTxHash('');
    try {
      const kit = getWalletKit();
      const { signTransaction } = kit;
      const { callContractVote } = await import('@/lib/stellar');
      const hash = await callContractVote(
        walletAddress,
        optionIndex,
        (xdr: string) => signTransaction(xdr, { networkPassphrase: 'Test SDF Network ; September 2015' })
      );
      setTxHash(hash);
      setTxStatus('success');
      setVotedOption(optionIndex);
      await fetchBalance(walletAddress);
    } catch (err) {
      setWalletError(parseWalletError(err));
      setTxStatus('error');
    }
  };

  return (
    <main className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-xl font-bold text-gray-900">🗳️</div>
            <div>
              <h1 className="text-lg font-bold text-white">StellarPoll</h1>
              <p className="text-xs text-gray-400">Live On-Chain Voting · Testnet</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full px-3 py-1">🟡 Testnet</span>
            {walletAddress ? (
              <button onClick={handleDisconnect} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3 py-1 hover:bg-red-500/20 transition-colors">
                Disconnect
              </button>
            ) : (
              <button onClick={() => setShowWalletModal(true)} className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full px-3 py-1 hover:bg-teal-500/20 transition-colors">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Error Banner */}
        {walletError && <ErrorBanner error={walletError} onClose={() => setWalletError(null)} />}

        {/* Wallet Card */}
        {walletAddress ? (
          <div className="card glow-teal">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span className="text-sm font-semibold text-teal-400">Wallet Connected</span>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-900 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Wallet Address</p>
                <p className="text-sm font-mono text-gray-200 truncate">{walletAddress}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">XLM Balance</p>
                <p className="text-2xl font-bold text-white">{balance} <span className="text-sm text-gray-400">XLM</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card border-dashed border-2 border-gray-700 text-center py-10">
            <div className="text-5xl mb-4">🗳️</div>
            <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet to Vote</h2>
            <p className="text-gray-400 text-sm mb-6">Use Freighter, Hana, xBull, or any Stellar wallet</p>
            <button onClick={() => setShowWalletModal(true)} className="btn-yellow max-w-xs mx-auto">
              🔌 Connect Wallet
            </button>
          </div>
        )}

        {/* Poll Card */}
        <PollCard
          walletAddress={walletAddress}
          onVote={handleVote}
          votedOption={votedOption}
          txStatus={txStatus}
          onConnectWallet={() => setShowWalletModal(true)}
        />

        {/* Transaction Status */}
        {txStatus !== 'idle' && (
          <TransactionStatus
            status={txStatus}
            txHash={txHash}
            onReset={() => { setTxStatus('idle'); setTxHash(''); setWalletError(null); }}
          />
        )}

        {/* Contract Info */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">📋 Contract Info</h3>
          <div className="space-y-2">
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Deployed Contract ID</p>
              <p className="text-xs font-mono text-teal-400 break-all">CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCN3B</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">Network</p>
              <p className="text-sm text-white">Stellar Testnet</p>
            </div>
            <a
              href="https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCN3B"
              target="_blank" rel="noopener noreferrer"
              className="block text-center text-xs text-teal-400 hover:text-teal-300 underline py-2"
            >🔍 View on Stellar Explorer ↗</a>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      {showWalletModal && (
        <WalletModal
          onConnect={handleConnect}
          onError={handleConnectError}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </main>
  );
}
