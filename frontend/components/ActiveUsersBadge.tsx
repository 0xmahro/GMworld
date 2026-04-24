'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const PAGE = 1000;

async function countDistinctUserAddresses(): Promise<number> {
  const seen = new Set<string>();
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from('messages')
      .select('user_address')
      .not('user_address', 'is', null)
      .order('timestamp', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1);

    if (error) throw error;
    const rows = data ?? [];
    for (const r of rows) {
      if (r.user_address) seen.add(r.user_address);
    }
    if (rows.length < PAGE) break;
    from += PAGE;
  }

  return seen.size;
}

export function ActiveUsersBadge() {
  const { data: activeUsers = 0 } = useQuery({
    queryKey: ['active-users'],
    queryFn: countDistinctUserAddresses,
    refetchInterval: 10_000,
    staleTime: 5_000,
    refetchOnWindowFocus: true,
  });

  return (
    <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-300">
      Users: {activeUsers}
    </span>
  );
}

