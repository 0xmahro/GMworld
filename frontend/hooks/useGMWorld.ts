'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { GMWORLD_ABI, GMWORLD_ADDRESS } from '@/lib/contracts';

export type TxStatus = 'idle' | 'pending' | 'success' | 'failed';

export function useGMWorld() {
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    isSuccess: isWriteSuccess,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const isPending = isWritePending || isConfirming;
  const isSuccess = isWriteSuccess && isConfirmed;
  const error = writeError;

  const sendMessage = async (message: string) => {
    reset();
    return writeContract({
      address: GMWORLD_ADDRESS,
      abi: GMWORLD_ABI,
      functionName: 'sendMessage',
      args: [message],
    });
  };

  const getStatus = (): TxStatus => {
    if (error) return 'failed';
    if (isSuccess) return 'success';
    if (isPending) return 'pending';
    return 'idle';
  };

  return {
    sendMessage,
    isPending,
    isSuccess,
    error,
    reset,
    getStatus,
    hash,
  };
}
