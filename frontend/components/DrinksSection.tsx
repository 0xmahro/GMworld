'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  useAccount,
  useChainId,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { DRINKS_ABI, DRINKS_ADDRESS, DRINK_PRICE_WEI } from '@/lib/contracts';

const DRINKS = [
  { emoji: '☕', label: 'Coffee' },
  { emoji: '🍵', label: 'Tea' },
  { emoji: '💧', label: 'Water' },
  { emoji: '🍺', label: 'Beer' },
  { emoji: '🍷', label: 'Wine' },
  { emoji: '🥃', label: 'Soju' },
  { emoji: '🍂', label: 'Mate' },
  { emoji: '🌽', label: 'Horchata' },
  { emoji: '🧋', label: 'Thai Iced Tea' },
  { emoji: '🫖', label: 'Kahwa / Karkade' },
] as const;

type DrinkRow = {
  id: number;
  display: string;
  priceWei?: bigint;
  totalPurchased?: bigint;
};

export function DrinksSection() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  const [lastBought, setLastBought] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV === 'development';
  const requiredChainId = isDev ? 31337 : 8453; // Foundry locally, Base in prod
  const isWrongNetwork = chainId !== requiredChainId;

  const contracts = useMemo(
    () =>
      DRINKS.map((_, i) => ({
        address: DRINKS_ADDRESS,
        abi: DRINKS_ABI,
        functionName: 'drinks' as const,
        args: [BigInt(i)] as const,
      })),
    []
  );

  const { data: drinksData, refetch: refetchDrinks } = useReadContracts({
    contracts,
    query: {
      refetchInterval: 12_000,
    },
  });

  const rows: DrinkRow[] = useMemo(() => {
    return DRINKS.map((d, i) => {
      const r = drinksData?.[i]?.result as
        | { name: string; price: bigint; totalPurchased: bigint }
        | undefined;

      return {
        id: i,
        display: `${d.emoji} ${d.label}`,
        priceWei: r?.price,
        totalPurchased: r?.totalPurchased,
      };
    });
  }, [drinksData]);

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const isPending = isWritePending || isConfirming;
  const status: 'idle' | 'pending' | 'success' | 'failed' =
    writeError ? 'failed' : isConfirmed ? 'success' : isPending ? 'pending' : 'idle';

  const buy = async (row: DrinkRow) => {
    setLastBought(null);
    reset();

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (isWrongNetwork) return;

    const value = row.priceWei ?? DRINK_PRICE_WEI;
    setLastBought(row.display);
    writeContract({
      address: DRINKS_ADDRESS,
      abi: DRINKS_ABI,
      functionName: 'buyDrink',
      args: [BigInt(row.id)],
      value,
    });
  };

  const subtitle =
    status === 'success' && lastBought
      ? `You bought ${lastBought}! 🎉`
      : 'Buy a drink on-chain (Base) — just for fun.';

  // After a successful purchase, refetch counts quickly (indexer/cache can lag).
  useEffect(() => {
    if (status !== 'success') return;
    refetchDrinks();
    const t1 = setTimeout(refetchDrinks, 800);
    const t2 = setTimeout(refetchDrinks, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [status, refetchDrinks]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
            Drink Section
          </h2>
          <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={() => refetchDrinks()}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-zinc-800/60 bg-zinc-900/20 px-4 py-4 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="font-medium text-zinc-100 truncate">{row.display}</div>
              <div className="text-xs text-zinc-500 mt-1 flex items-center gap-3">
                <span>
                  Price:{' '}
                  <span className="text-zinc-300">
                    0.00003 ETH
                  </span>
                </span>
                <span>
                  Total:{' '}
                  <span className="text-teal-300">
                    {typeof row.totalPurchased === 'bigint'
                      ? row.totalPurchased.toString()
                      : '—'}
                  </span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => buy(row)}
              disabled={isPending || (isConnected && isWrongNetwork)}
              className="shrink-0 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-500/20 hover:border-amber-400/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && lastBought === row.display ? 'Confirm…' : 'Buy'}
            </button>
          </div>
        ))}
      </div>

      {isConnected && isWrongNetwork && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
          <div className="min-w-0">
            Wrong network. Switch to{' '}
            <span className="font-medium">
              {isDev ? 'Localhost (Foundry 31337)' : 'Base (8453)'}
            </span>{' '}
            to buy drinks.
          </div>
          <button
            type="button"
            onClick={() => switchChainAsync({ chainId: requiredChainId })}
            disabled={isSwitching}
            className="shrink-0 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 hover:bg-amber-400/20 hover:border-amber-300/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSwitching ? 'Switching…' : 'Switch network'}
          </button>
        </div>
      )}

      {status === 'failed' && (
        <div className="flex items-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          Transaction failed. Try again or check wallet.
        </div>
      )}
    </section>
  );
}

function formatEth(wei: bigint): string {
  // No extra deps; good enough for tiny values like 0.00003 ETH.
  const s = wei.toString().padStart(19, '0');
  const whole = s.slice(0, -18).replace(/^0+/, '') || '0';
  const frac = s.slice(-18).replace(/0+$/, '').slice(0, 6);
  return frac ? `${whole}.${frac}` : whole;
}

