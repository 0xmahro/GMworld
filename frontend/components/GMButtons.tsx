'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useGMWorld } from '@/hooks/useGMWorld';
import { useMessages } from '@/hooks/useMessages';
import { supabase } from '@/lib/supabase';
import { ShareOnFarcaster } from '@/components/ShareOnFarcaster';
import type { Language } from '@/lib/languages';

interface GMButtonsProps {
  language: Language;
}

function SingleButton({
  emoji,
  label,
  variant,
  onSend,
  isPending,
  status,
}: {
  emoji: string;
  label: string;
  variant: 'gm' | 'gn';
  onSend: () => void;
  isPending: boolean;
  status: 'idle' | 'pending' | 'success' | 'failed';
}) {
  const isThisSuccess = status === 'success';
  const borderClass =
    variant === 'gm'
      ? 'border-amber-500/40 hover:border-amber-400/60 from-amber-500/20 to-orange-500/20'
      : 'border-indigo-500/40 hover:border-indigo-400/60 from-indigo-500/20 to-purple-500/20';

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onSend}
        disabled={isPending}
        className={`group flex flex-col items-center justify-center gap-1 px-10 py-5 rounded-2xl bg-gradient-to-br ${borderClass} border transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]`}
      >
        {isPending ? (
          <span className="flex items-center gap-2 text-lg font-semibold">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Confirm in wallet...
          </span>
        ) : isThisSuccess ? (
          <span className="flex items-center gap-2 text-lg font-semibold text-emerald-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {label} sent!
          </span>
        ) : (
          <>
            <span className="text-3xl">{emoji}</span>
            <span className="text-lg font-semibold">{label}</span>
          </>
        )}
        {!isPending && !isThisSuccess && (
          <span className="text-xs text-zinc-500 mt-1">~0.000025 ETH</span>
        )}
      </button>
    </div>
  );
}

export function GMButtons({ language }: GMButtonsProps) {
  const { isConnected, address } = useAccount();
  const { sendMessage, isPending, isSuccess, error, reset } = useGMWorld();
  const { refetch } = useMessages();
  const [lastSent, setLastSent] = useState<'gm' | 'gn' | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const status = error ? 'failed' : isSuccess ? 'success' : isPending ? 'pending' : 'idle';

  useEffect(() => {
    if (status === 'success' && address && lastMessage) {
      supabase.from('messages').insert({
        user_address: address,
        message: lastMessage,
        timestamp: Math.floor(Date.now() / 1000),
      }).then(() => refetch());
    }
  }, [status, address, lastMessage, refetch]);

  useEffect(() => {
    if (status === 'success') {
      refetch();
      const t1 = setTimeout(refetch, 500);
      const t2 = setTimeout(() => {
        reset();
        setLastSent(null);
        setLastMessage(null);
      }, 3000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [status, reset, refetch]);

  const handleSend = async (message: string, type: 'gm' | 'gn') => {
    if (!address) return;
    setLastSent(type);
    setLastMessage(message);
    try {
      await sendMessage(message);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-8 text-zinc-500">
        Connect your wallet to send GM or GN
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500 text-center">
        Network: Base · Confirm in wallet (~0.000025 ETH)
      </p>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-start">
        <SingleButton
          emoji="☀"
          label="Send GM"
          variant="gm"
          onSend={() => handleSend(language.gm, 'gm')}
          isPending={isPending}
          status={lastSent === 'gm' ? status : 'idle'}
        />
        <SingleButton
          emoji="🌙"
          label="Send GN"
          variant="gn"
          onSend={() => handleSend(language.gn, 'gn')}
          isPending={isPending}
          status={lastSent === 'gn' ? status : 'idle'}
        />
      </div>
      {status === 'success' && lastMessage && (
        <div className="flex justify-center pt-2">
          <ShareOnFarcaster
            text={`Just said ${lastMessage} on GM World ☀️\n${process.env.NEXT_PUBLIC_APP_URL || 'https://worldgm.xyz'}`}
            label="Share on Farcaster"
          />
        </div>
      )}
      {status === 'failed' && (
        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
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
    </div>
  );
}
