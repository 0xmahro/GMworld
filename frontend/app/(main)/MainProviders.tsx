'use client';

import { useEffect, useState } from 'react';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/lib/wagmi';
import { Providers } from '../providers';

export default function MainProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialState, setInitialState] = useState<import('wagmi').State | undefined>();

  useEffect(() => {
    try {
      const c = typeof document !== 'undefined' ? document.cookie : '';
      setInitialState(c ? cookieToInitialState(config, c) : undefined);
    } catch {
      setInitialState(undefined);
    }
  }, []);

  return <Providers initialState={initialState}>{children}</Providers>;
}
