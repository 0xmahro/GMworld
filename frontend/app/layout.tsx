import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://worldgm.xyz';
const ogImage = `${baseUrl}/og-image.png`;
const embedImage = `${baseUrl}/embed-image.png`;

const fcMiniappEmbed = {
  version: '1',
  imageUrl: embedImage,
  button: {
    title: 'Open GM World',
    action: {
      type: 'launch_miniapp',
      name: 'GM World',
      url: baseUrl,
      splashImageUrl: `${baseUrl}/og-icon.png`,
      splashBackgroundColor: '#18181b',
    },
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'GM World | Good Morning on Base',
  description: 'Say GM or GN on-chain. A global greeting dApp on Base.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'GM World | Good Morning on Base',
    description: 'Say GM or GN on-chain. A global greeting dApp on Base.',
    url: baseUrl,
    siteName: 'GM World',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GM World' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GM World | Good Morning on Base',
    description: 'Say GM or GN on-chain. A global greeting dApp on Base.',
  },
  other: {
    'base:app_id': 'bc_v8nzoiyp',
    'fc:miniapp': JSON.stringify(fcMiniappEmbed),
    'fc:frame': JSON.stringify(fcMiniappEmbed),
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
