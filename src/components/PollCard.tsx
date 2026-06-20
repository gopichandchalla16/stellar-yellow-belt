'use client';
import { TxStatus } from '@/app/page';

const POLL_QUESTION = 'What is the most exciting use case for Stellar Soroban?';
const POLL_OPTIONS = [
  { label: 'DeFi & Token Swaps', emoji: '💱', color: 'teal' },
  { label: 'NFTs & Digital Assets', emoji: '🎨', color: 'yellow' },
  { label: 'Cross-border Payments', emoji: '🌍', color: 'purple' },
];

const MOCK_VOTES = [42, 31, 27]; // Displayed when no wallet connected

interface Props {
  walletAddress: string;
  onVote: (index: number) => void;
  votedOption: number | null;
  txStatus: TxStatus;
  onConnectWallet: () => void;
}

export default function PollCard({ walletAddress, onVote, votedOption, txStatus, onConnectWallet }: Props) {
  const totalVotes = MOCK_VOTES.reduce((a, b) => a + b, 0);
  const isVoting = txStatus === 'pending';

  const getBarColor = (color: string) => {
    if (color === 'teal')   return 'progress-fill-teal';
    if (color === 'yellow') return 'progress-fill-yellow';
    return 'progress-fill-purple';
  };

  return (
    <div className="card glow-yellow" style={{ border: '1px solid rgba(234,179,8,0.2)' }}>
      {/* Poll Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="badge-success">🔴 LIVE</span>
        <span className="text-xs text-gray-400">On-chain · Stellar Testnet</span>
      </div>
      <h2 className="text-lg font-bold text-white mb-6">{POLL_QUESTION}</h2>

      {/* Options */}
      <div className="space-y-4 mb-6">
        {POLL_OPTIONS.map((option, index) => {
          const pct = Math.round((MOCK_VOTES[index] / totalVotes) * 100);
          const isVoted = votedOption === index;
          const isWinner = index === 0;

          return (
            <div key={index} className={`rounded-xl p-4 border transition-all ${
              isVoted
                ? 'border-yellow-500/50 bg-yellow-500/5'
                : 'border-gray-700 hover:border-gray-600'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{option.emoji}</span>
                  <span className="font-semibold text-white text-sm">{option.label}</span>
                  {isWinner && <span className="text-xs text-yellow-400">👑</span>}
                  {isVoted && <span className="badge-success">✓ Your Vote</span>}
                </div>
                <span className="text-sm font-bold text-gray-300">{pct}%</span>
              </div>
              <div className="progress-bar mb-3">
                <div className={getBarColor(option.color)} style={{ width: `${pct}%` }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{MOCK_VOTES[index]} votes</span>
                {!votedOption && (
                  walletAddress ? (
                    <button
                      onClick={() => onVote(index)}
                      disabled={isVoting}
                      className={`text-xs px-4 py-2 rounded-lg font-semibold transition-all ${
                        isVoting
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30'
                      }`}
                    >
                      {isVoting ? '⏳ Voting...' : 'Vote →'}
                    </button>
                  ) : (
                    <button
                      onClick={onConnectWallet}
                      className="text-xs px-4 py-2 rounded-lg font-semibold bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30 transition-all"
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

      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4">
        <span>Total votes: {totalVotes}</span>
        <span>Results update in real-time</span>
      </div>
    </div>
  );
}
