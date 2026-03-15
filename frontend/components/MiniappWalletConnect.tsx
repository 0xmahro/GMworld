'use client';

import { useEffect, useRef } from 'react';
import { useAccount, useConnect } from 'wagmi';

/**
 * When the app runs inside Farcaster/Base Mini App (iframe), try to connect
 * using the Mini App connector (first in the list) so the host's wallet is used.
 * This runs once on mount when disconnected and in an iframe.
 */
export function MiniappWalletConnect() {
  const { isConnected, status } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const tried = useRef(false);

  useEffect(() => {
    if (tried.current || isConnected || status !== 'disconnected' || isPending) return;
    const inIframe = typeof window !== 'undefined' && window !== window.top;
    if (!inIframe) return;
    const miniAppConnector = connectors[0];
    if (!miniAppConnector) return;
    tried.current = true;
    connect({ connector: miniAppConnector });
  }, [connectors, connect, isConnected, status, isPending]);

  return null;
}
