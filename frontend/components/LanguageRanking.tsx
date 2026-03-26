'use client';

import { useQuery } from '@tanstack/react-query';
import { LANGUAGES } from '@/lib/languages';
import { supabase } from '@/lib/supabase';

type Row = { lang: (typeof LANGUAGES)[0]; gm: number; gn: number; total: number };

export function LanguageRanking() {
  const { data: ranking = [], isLoading } = useQuery({
    queryKey: ['language-ranking'],
    queryFn: async () => {
      const rows = await Promise.all(
        LANGUAGES.map(async (lang): Promise<Row> => {
          const [{ count: gmCount, error: gmErr }, { count: gnCount, error: gnErr }] =
            await Promise.all([
              supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .eq('message', lang.gm),
              supabase
                .from('messages')
                .select('id', { count: 'exact', head: true })
                .eq('message', lang.gn),
            ]);

          if (gmErr) throw gmErr;
          if (gnErr) throw gnErr;

          const gm = gmCount ?? 0;
          const gn = gnCount ?? 0;
          return { lang, gm, gn, total: gm + gn };
        })
      );

      return rows.filter((r) => r.total > 0).sort((a, b) => b.total - a.total);
    },
    refetchInterval: 10_000,
    staleTime: 5_000,
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/30 px-6 py-8 text-center text-zinc-500 text-sm">
        Dil sıralaması yükleniyor...
      </div>
    );
  }

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
