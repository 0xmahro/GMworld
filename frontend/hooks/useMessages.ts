'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface GMMessage {
  user: string;
  message: string;
  timestamp: number;
  country?: string;
}

const GM_PHRASES = new Set([
  'Good morning', 'Buenos días', 'Bonjour', 'Guten Morgen', 'Buongiorno',
  'Bom dia', 'Доброе утро', 'صباح الخير', 'Günaydın', 'सुप्रभात', 'おはよう',
  '좋은 아침', '早上好', 'Selamat pagi', 'Chào buổi sáng', 'สวัสดีตอนเช้า',
  'Καλημέρα', 'Goedemorgen', 'Dzień dobry', 'Habari za asubuhi',
]);
const GN_PHRASES = new Set([
  'Good night', 'Buenas noches', 'Bonne nuit', 'Gute Nacht', 'Buona notte',
  'Boa noite', 'Спокойной ночи', 'تصبح على خير', 'İyi geceler', 'शुभ रात्रि',
  'おやすみ', '안녕히 주무세요', '晚安', 'Selamat malam', 'Chúc ngủ ngon',
  'ราตรีสวัสดิ์', 'Καληνύχτα', 'Goedenacht', 'Dobranoc', 'Usiku mwema',
]);

function getTodayStart() {
  const now = new Date();
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000
  );
}

export function useMessages() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['gm-messages'],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from('messages')
        .select('user_address, message, timestamp')
        .order('timestamp', { ascending: false })
        .limit(200);

      if (error) throw error;

      const todayStart = getTodayStart();
      let gmToday = 0;
      let gnToday = 0;
      let gmTotal = 0;
      let gnTotal = 0;

      const messages: GMMessage[] = (rows ?? []).map((r) => {
        const msg = r.message;
        if (GM_PHRASES.has(msg)) {
          gmTotal++;
          if (r.timestamp >= todayStart) gmToday++;
        }
        if (GN_PHRASES.has(msg)) {
          gnTotal++;
          if (r.timestamp >= todayStart) gnToday++;
        }
        return {
          user: r.user_address,
          message: msg,
          timestamp: r.timestamp,
        };
      });

      return { messages, gmToday, gnToday, gmTotal, gnTotal };
    },
    refetchInterval: 5000,
    staleTime: 2000,
  });

  return {
    messages: data?.messages ?? [],
    gmToday: data?.gmToday ?? 0,
    gnToday: data?.gnToday ?? 0,
    gmTotal: data?.gmTotal ?? 0,
    gnTotal: data?.gnTotal ?? 0,
    refetch,
    isLoading,
  };
}
