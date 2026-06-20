import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StellarPoll — Live On-Chain Voting',
  description: 'A live on-chain polling dApp built on Stellar Soroban Testnet. Level 2 Yellow Belt — Rise In Stellar Journey to Mastery.',
  keywords: ['Stellar', 'Soroban', 'dApp', 'blockchain', 'voting', 'poll'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
