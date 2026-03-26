'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function ActiveUsersBadge() {
  const { data: activeUsers = 0 } = useQuery({
    queryKey: ['active-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('user_address')
        .not('user_address', 'is', null);

      if (error) throw error;
      return new Set((data ?? []).map((r) => r.user_address)).size;
    },
    refetchInterval: 10_000,
    staleTime: 5_000,
  });

  return (
    <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-300">
      Users: {activeUsers}
    </span>
  );
}

