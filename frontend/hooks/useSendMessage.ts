'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useSendMessage() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (userAddress: string, message: string) => {
    setIsPending(true);
    setError(null);
    setIsSuccess(false);

    try {
      const { error: err } = await supabase.from('messages').insert({
        user_address: userAddress,
        message,
        timestamp: Math.floor(Date.now() / 1000),
      });

      if (err) throw err;
      setIsSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to send'));
      throw e;
    } finally {
      setIsPending(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setError(null);
  };

  return { sendMessage, isPending, isSuccess, error, reset };
}
