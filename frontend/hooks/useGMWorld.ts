'use client';

import {
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { encodeFunctionData } from 'viem';
import { appendBuilderAttributionIfBase } from '@/lib/builderAttribution';
import { GMWORLD_ABI, GMWORLD_ADDRESS, GMWORLD_FEE_WEI } from '@/lib/contracts';

export type TxStatus = 'idle' | 'pending' | 'success' | 'failed';

export function useGMWorld() {
  const chainId = useChainId();
  const {
    sendTransaction,
    data: hash,
    isPending: isSendPending,
    isSuccess: isSubmitted,
    error: sendError,
    reset,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const isPending = isSendPending || isConfirming;
  const isSuccess = isSubmitted && isConfirmed;
  const error = sendError;

  const sendMessage = async (message: string) => {
    reset();
    const data = encodeFunctionData({
      abi: GMWORLD_ABI,
      functionName: 'sendMessage',
      args: [message],
    });
    return sendTransaction({
      to: GMWORLD_ADDRESS,
      data: appendBuilderAttributionIfBase(data, chainId),
      value: GMWORLD_FEE_WEI,
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
