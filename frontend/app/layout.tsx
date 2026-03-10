import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/lib/wagmi';
import { Providers } from './providers';
import '@/styles/globals.css';

export const dynamic = 'force-dynamic';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'GM World | Good Morning on Base',
  description: 'Send GM/GN messages on-chain. A global greeting dApp on Base.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png', sizes: '32x32' },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialState;
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join('; ');
    initialState = cookie ? cookieToInitialState(config, cookie) : undefined;
  } catch {
    initialState = undefined;
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrains.variable} font-sans bg-zinc-950 text-zinc-100 min-h-screen antialiased`}
      >
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
