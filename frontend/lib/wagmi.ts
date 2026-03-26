import { createConfig, createStorage, cookieStorage, http } from 'wagmi';
import { base, foundry } from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

// Sun emoji as SVG data URL for chain icon
const sunIconUrl =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fbbf24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/></svg>'
  );

const baseWithSunIcon = {
  ...base,
  iconUrl: sunIconUrl,
  iconBackground: '#1a1a1a',
};

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';
const { connectors: rainbowConnectors } = getDefaultWallets({
  appName: 'GM World',
  projectId,
});

/** Farcaster Mini App connector first: Base/Farcaster içinde cüzdan otomatik bağlanır. */
export const config = createConfig({
  // NOTE: Keep the config strongly typed for both dev & prod.
  // Using inline conditionals here confuses TS and breaks Vercel builds.
  ...(process.env.NODE_ENV === 'development'
    ? createConfig({
        chains: [foundry, baseWithSunIcon],
        transports: {
          [foundry.id]: http('http://127.0.0.1:8545'),
          [base.id]: http(),
        },
        connectors: [farcasterMiniApp(), ...rainbowConnectors],
        storage: createStorage({
          key: 'gmworld-wagmi',
          storage: cookieStorage,
        }),
        ssr: true,
      })
    : createConfig({
        chains: [baseWithSunIcon],
        transports: { [base.id]: http() },
        connectors: [farcasterMiniApp(), ...rainbowConnectors],
        storage: createStorage({
          key: 'gmworld-wagmi',
          storage: cookieStorage,
        }),
        ssr: true,
      })),
});
