'use client';

import { useEffect } from 'react';

/**
 * Calls sdk.actions.ready() when opened as Farcaster/Base Mini App.
 * Hides the loading splash so the app displays.
 * Mounted in root layout so it runs before dynamic MainProviders.
 * @see https://miniapps.farcaster.xyz/docs/guides/loading
 */
export function MiniAppReady() {
  useEffect(() => {
    import('@farcaster/miniapp-sdk')
      .then(({ sdk }) => {
        sdk.actions.ready();
      })
      .catch(() => {
        // Not in miniapp or SDK failed; no-op
      });
  }, []);

  return null;
}
