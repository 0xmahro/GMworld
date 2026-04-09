'use client';

import { useMemo, useState } from 'react';
import {
  useChainId,
  useSendCalls,
  useSendTransaction,
  useWaitForCallsStatus,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { encodeFunctionData } from 'viem';
import { appendBuilderAttributionIfBase, getBuilderDataSuffix } from '@/lib/builderAttribution';
import { GMWORLD_ABI, GMWORLD_ADDRESS, GMWORLD_FEE_WEI } from '@/lib/contracts';

export type TxStatus = 'idle' | 'pending' | 'success' | 'failed';

export function useGMWorld() {
  const chainId = useChainId();
  const [txMode, setTxMode] = useState<'send' | 'calls'>('send');
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
    sendCalls,
    data: callsData,
    isPending: isCallsPending,
    isSuccess: isCallsSubmitted,
    error: callsError,
    reset: resetCalls,
  } = useSendCalls();
  const callsId = txMode === 'calls' ? callsData?.id : undefined;
  const { data: callsStatusData, isLoading: isCallsConfirming, isSuccess: isCallsConfirmed } =
    useWaitForCallsStatus({
      id: callsId as any,
      query: { enabled: Boolean(callsId) },
    } as any);

  const callsTxHash =
    (callsStatusData as any)?.receipts?.[0]?.transactionHash as `0x${string}` | undefined;
  const effectiveHash = (localHash ?? (txMode === 'calls' ? callsTxHash : sendHash)) as
    | `0x${string}`
    | undefined;
  const { isLoading: isSendConfirming, isSuccess: isSendConfirmed } =
    useWaitForTransactionReceipt({
      hash: txMode === 'send' ? (effectiveHash as any) : undefined,
      query: { enabled: txMode === 'send' && Boolean(effectiveHash) } as any,
    } as any);

  const isPending = txMode === 'calls' ? isCallsPending || isCallsConfirming : isSendPending || isSendConfirming;
  const isSuccess = txMode === 'calls' ? isCallsSubmitted && isCallsConfirmed : isSendSubmitted && isSendConfirmed;
  const error = txMode === 'calls' ? callsError : sendError;

  const reset = () => {
    resetSend();
    resetCalls();
    setLocalHash(undefined);
  };

  const sendMessage = async (message: string) => {
    reset();
    const data = encodeFunctionData({
      abi: GMWORLD_ABI,
      functionName: 'sendMessage',
      args: [message],
    });

    // In Farcaster/Base Mini App, use wallet_sendCalls path via connector.
    const inIframe = typeof window !== 'undefined' && window !== window.top;
    if (inIframe) {
      setTxMode('calls');
      return sendCalls({
        chainId: 8453,
        calls: [
          {
            to: GMWORLD_ADDRESS,
            data,
            value: GMWORLD_FEE_WEI,
          },
        ],
        capabilities: {
          dataSuffix: {
            value: getBuilderDataSuffix(),
            optional: true,
          },
        },
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
