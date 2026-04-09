'use client';

import { useMemo, useState } from 'react';
import {
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { encodeFunctionData } from 'viem';
import { appendBuilderAttributionIfBase } from '@/lib/builderAttribution';
import { GMWORLD_ABI, GMWORLD_ADDRESS, GMWORLD_FEE_WEI } from '@/lib/contracts';

export type TxStatus = 'idle' | 'pending' | 'success' | 'failed';

export function useGMWorld() {
  const chainId = useChainId();
  const [txMode, setTxMode] = useState<'send' | 'write'>('send');
  const [localHash, setLocalHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    sendTransaction,
    data: sendHash,
    isPending: isSendPending,
    isSuccess: isSendSubmitted,
    error: sendError,
    reset: resetSend,
  } = useSendTransaction();
  const {
    writeContract,
    data: writeHash,
    isPending: isWritePending,
    isSuccess: isWriteSubmitted,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const effectiveHash = (localHash ?? (txMode === 'write' ? writeHash : sendHash)) as
    | `0x${string}`
    | undefined;
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: effectiveHash });

  const basePending = txMode === 'write' ? isWritePending : isSendPending;
  const baseSubmitted = txMode === 'write' ? isWriteSubmitted : isSendSubmitted;
  const error = txMode === 'write' ? writeError : sendError;
  const isPending = basePending || isConfirming;
  const isSuccess = baseSubmitted && isConfirmed;

  const reset = () => {
    resetSend();
    resetWrite();
    setLocalHash(undefined);
  };

  const sendMessage = async (message: string) => {
    reset();
    const data = encodeFunctionData({
      abi: GMWORLD_ABI,
      functionName: 'sendMessage',
      args: [message],
    });

    // In Farcaster/Base Mini App, use writeContract path (connector-compatible).
    const inIframe = typeof window !== 'undefined' && window !== window.top;
    if (inIframe) {
      setTxMode('write');
      return writeContract({
        address: GMWORLD_ADDRESS,
        abi: GMWORLD_ABI,
        functionName: 'sendMessage',
        args: [message],
        value: GMWORLD_FEE_WEI,
      });
    }

    setTxMode('send');
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
    hash: effectiveHash,
  };
}
