'use client';

import { useMessages } from '@/hooks/useMessages';

export function GlobalCounters() {
  const { gmToday, gnToday, gmTotal, gnTotal, isLoading } = useMessages();

  if (isLoading) {
    return (
      <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
        <div className="px-6 py-4 rounded-xl bg-zinc-800/50 animate-pulse w-36 h-20" />
        <div className="px-6 py-4 rounded-xl bg-zinc-800/50 animate-pulse w-36 h-20" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
      <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-zinc-800/80 border border-zinc-700/50 min-w-[140px]">
        <span className="text-2xl">☀</span>
        <div>
          <p className="text-2xl font-bold text-amber-400">{gmTotal}</p>
          <p className="text-xs text-zinc-500">GM total · {gmToday} today</p>
        </div>
      </div>
      <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-zinc-800/80 border border-zinc-700/50 min-w-[140px]">
        <span className="text-2xl">🌙</span>
        <div>
          <p className="text-2xl font-bold text-indigo-400">{gnTotal}</p>
          <p className="text-xs text-zinc-500">GN total · {gnToday} today</p>
        </div>
      </div>
    </div>
  );
}
