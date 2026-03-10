import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'GM World | Good Morning on Base',
  description: 'Send GM/GN messages on-chain. A global greeting dApp on Base.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrains.variable} font-sans bg-zinc-950 text-zinc-100 min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
