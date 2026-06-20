'use client';
import { TxStatus } from '@/app/page';

const POLL_QUESTION = 'What is the most exciting use case for Stellar Soroban?';
const POLL_OPTIONS = [
  { label: 'DeFi & Token Swaps',      emoji: '💱', color: 'teal',   votes: 42 },
  { label: 'NFTs & Digital Assets',   emoji: '🎨', color: 'yellow', votes: 31 },
  { label: 'Cross-border Payments',   emoji: '🌍', color: 'purple', votes: 27 },
];

interface Props {
  walletAddress: string;
  onVote: (index: number) => void;
  votedOption: number | null;
  txStatus: TxStatus;
  onConnectWallet: () => void;
}

export default function PollCard({ walletAddress, onVote, votedOption, txStatus, onConnectWallet }: Props) {
  const totalVotes = POLL_OPTIONS.reduce((a, o) => a + o.votes, 0);
  const isVoting = txStatus === 'pending';

  const colorMap: Record<string, { fill: string; btn: string; border: string; glow: string }> = {
    teal:   { fill: 'progress-fill-teal',   btn: 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:bg-teal-500/25',   border: 'border-teal-500/40',   glow: 'shadow-teal-500/10' },
    yellow: { fill: 'progress-fill-yellow', btn: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/25', border: 'border-yellow-500/40', glow: 'shadow-yellow-500/10' },
    purple: { fill: 'progress-fill-purple', btn: 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25', border: 'border-purple-500/40', glow: 'shadow-purple-500/10' },
  };

  return (
    <div className="card glow-yellow animate-fade-in">
      {/* Poll Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-live">Live</span>
            <span className="text-xs text-gray-500">On-chain · Soroban Testnet</span>
          </div>
          <h2 className="text-base font-bold text-white leading-snug">{POLL_QUESTION}</h2>
        </div>
        <span className="text-3xl ml-4">🗳️</span>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-5">
        {POLL_OPTIONS.map((option, index) => {
          const pct = Math.round((option.votes / totalVotes) * 100);
          const isVoted = votedOption === index;
          const isWinner = option.votes === Math.max(...POLL_OPTIONS.map(o => o.votes));
          const c = colorMap[option.color];

          return (
            <div
              key={index}
              className={`rounded-2xl p-4 border transition-all duration-300 ${
                isVoted
                  ? `${c.border} bg-white/[0.03] shadow-lg ${c.glow}`
                  : 'border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{option.emoji}</span>
                  <span className="font-semibold text-sm text-white">{option.label}</span>
                  {isWinner && <span className="text-xs">👑</span>}
                  {isVoted && <span className="badge-success">✓ Voted</span>}
                </div>
                <span className="text-sm font-bold text-gray-300 tabular-nums">{pct}%</span>
              </div>

              <div className="progress-bar mb-3">
                <div className={c.fill} style={{ width: `${pct}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{option.votes} votes</span>
                {votedOption === null && (
                  walletAddress ? (
                    <button
                      onClick={() => onVote(index)}
                      disabled={isVoting}
                      className={`text-xs px-4 py-1.5 rounded-xl font-semibold border transition-all ${
                        isVoting ? 'opacity-40 cursor-not-allowed bg-white/5 text-gray-400 border-white/10'
                        : c.btn
                      }`}
                    >
                      {isVoting ? '⏳ Voting...' : 'Cast Vote →'}
                    </button>
                  ) : (
                    <button
                      onClick={onConnectWallet}
                      className="text-xs px-4 py-1.5 rounded-xl font-semibold border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 transition-all"
                    >
                      Connect to Vote
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-white/[0.05]">
        <span>{totalVotes} total votes</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block" />
          Results update in real-time
        </span>
      </div>
    </div>
  );
}
