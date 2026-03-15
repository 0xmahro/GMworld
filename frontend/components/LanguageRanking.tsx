'use client';

import { useMemo } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { LANGUAGES } from '@/lib/languages';

type Row = { lang: (typeof LANGUAGES)[0]; gm: number; gn: number; total: number };

export function LanguageRanking() {
  const { messages } = useMessages();

  const ranking = useMemo(() => {
    const phraseCounts: Record<string, number> = {};
    for (const m of messages) {
      phraseCounts[m.message] = (phraseCounts[m.message] ?? 0) + 1;
    }
    const rows: Row[] = LANGUAGES.map((lang) => {
      const gm = phraseCounts[lang.gm] ?? 0;
      const gn = phraseCounts[lang.gn] ?? 0;
      return { lang, gm, gn, total: gm + gn };
    });
    return rows.filter((r) => r.total > 0).sort((a, b) => b.total - a.total);
  }, [messages]);

  if (ranking.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/30 px-6 py-8 text-center text-zinc-500 text-sm">
        Henüz GM/GN gönderilmedi. İlk mesajı sen at.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/30 overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-3 text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-700/50">
        <div>Dil</div>
        <div className="text-right w-14">GM</div>
        <div className="text-right w-14">GN</div>
        <div className="text-right w-14">Toplam</div>
      </div>
      <ul className="divide-y divide-zinc-800/50">
        {ranking.map((r, i) => (
          <li
            key={r.lang.code}
            className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-3 items-center hover:bg-zinc-800/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 tabular-nums w-5">{i + 1}.</span>
              <span className="text-lg" aria-hidden>{r.lang.flag}</span>
              <span className="font-medium text-zinc-200">{r.lang.name}</span>
            </div>
            <div className="text-right tabular-nums text-zinc-400 w-14">{r.gm}</div>
            <div className="text-right tabular-nums text-zinc-400 w-14">{r.gn}</div>
            <div className="text-right tabular-nums text-teal-400 font-medium w-14">{r.total}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
