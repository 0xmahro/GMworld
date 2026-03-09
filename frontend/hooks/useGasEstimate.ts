'use client';

import { useState, useEffect } from 'react';

// Base network typical fee for simple tx
const FIXED_FEE_ETH = 0.000025;
const FIXED_FEE_USD = 0.05;

export function useGasEstimate(_message: string) {
  const [gasCostUsd, setGasCostUsd] = useState<number>(FIXED_FEE_USD);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Optional: fetch live ETH price for USD
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .then((r) => r.json())
      .then((d) => {
        if (d?.ethereum?.usd) {
          setGasCostUsd(FIXED_FEE_ETH * d.ethereum.usd);
        }
      })
      .catch(() => {});
  }, []);

  return {
    gasCostEth: FIXED_FEE_ETH,
    gasCostUsd,
    isLoading: false,
    error: null,
  };
}
