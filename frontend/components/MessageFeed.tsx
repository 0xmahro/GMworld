'use client';

import { useMessages } from '@/hooks/useMessages';
import { LANGUAGES } from '@/lib/languages';

function shortAddress(addr: string) {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getFlag(message: string) {
  const lang = LANGUAGES.find((l) => l.gm === message || l.gn === message);
  return lang?.flag ?? '🌍';
}

export function MessageFeed() {
  const { messages, isLoading } = useMessages();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-zinc-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <p className="text-center text-zinc-500 py-8">
        No messages yet. Be the first to send GM or GN!
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {messages.slice(0, 50).map((m, i) => (
        <div
          key={`${m.user}-${m.timestamp}-${i}`}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
        >
          <span className="text-xl">{getFlag(m.message)}</span>
          <span className="text-lg">{m.message}</span>
          <span className="text-zinc-500 text-sm font-mono">
            {shortAddress(m.user)}
          </span>
        </div>
      ))}
    </div>
  );
}
