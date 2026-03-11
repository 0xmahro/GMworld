import { NextResponse } from 'next/server';

/**
 * Base Mini App & Farcaster manifest.
 * Served at /.well-known/farcaster.json via next.config rewrite.
 *
 * Setup:
 * 1. Set NEXT_PUBLIC_APP_URL (e.g. https://worldgm.xyz)
 * 2. Generate accountAssociation at https://base.dev/preview (tab: Account association)
 * 3. Add FC_ACCOUNT_HEADER, FC_ACCOUNT_PAYLOAD, FC_ACCOUNT_SIGNATURE to env
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://worldgm.xyz';
  const header = process.env.FC_ACCOUNT_HEADER || '';
  const payload = process.env.FC_ACCOUNT_PAYLOAD || '';
  const signature = process.env.FC_ACCOUNT_SIGNATURE || '';

  const manifest = {
    ...(header && payload && signature
      ? {
          accountAssociation: {
            header,
            payload,
            signature,
          },
        }
      : {}),
    miniapp: {
      version: '1',
      name: 'GM World',
      subtitle: 'Good Morning on Base',
      description:
        'Say GM or GN on-chain. A global greeting dApp on Base. Join the morning wave.',
      homeUrl: baseUrl,
      iconUrl: `${baseUrl}/og-icon.png`,
      splashImageUrl: `${baseUrl}/og-icon.png`,
      splashBackgroundColor: '#18181b',
      screenshotUrls: [`${baseUrl}/og-image.png`],
      primaryCategory: 'social',
      tags: ['social', 'gm', 'greetings', 'base'],
      heroImageUrl: `${baseUrl}/og-image.png`,
      tagline: 'GM GN greetings',
      ogTitle: 'GM World',
      ogDescription: 'Say Good Morning or Good Night on-chain. A global dApp.',
      ogImageUrl: `${baseUrl}/og-image.png`,
      noindex: false,
      requiredChains: ['eip155:8453'],
      canonicalDomain: 'worldgm.xyz',
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
