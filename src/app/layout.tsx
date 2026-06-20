import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StellarPoll — Live On-Chain Voting',
  description: 'Level 2 Yellow Belt — Multi-wallet Soroban dApp on Stellar Testnet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="gradient-bg min-h-screen">{children}</body>
    </html>
  );
}
