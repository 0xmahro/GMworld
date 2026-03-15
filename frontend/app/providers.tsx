'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, type State } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { MiniappWalletConnect } from '@/components/MiniappWalletConnect';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

type ProvidersProps = {
  children: React.ReactNode;
  initialState?: State;
};

export function Providers({ children, initialState }: ProvidersProps) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#14b8a6',
            accentColorForeground: 'white',
          })}
        >
          <MiniappWalletConnect />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
