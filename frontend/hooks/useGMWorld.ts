'use client';

import { useMemo, useState } from 'react';
import {
  useChainId,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { encodeFunctionData } from 'viem';
import { appendBuilderAttributionIfBase } from '@/lib/builderAttribution';
import { getMiniAppChainId, miniAppSendCall } from '@/lib/miniappWalletClient';
import { GMWORLD_ABI, GMWORLD_ADDRESS, GMWORLD_FEE_WEI } from '@/lib/contracts';

export type TxStatus = 'idle' | 'pending' | 'success' | 'failed';

export function useGMWorld() {
  const chainId = useChainId();
  const [localHash, setLocalHash] = useState<`0x${string}` | undefined>(undefined);
  const {
    sendTransaction,
    data: hash,
    isPending: isSendPending,
    isSuccess: isSubmitted,
    error: sendError,
    reset,
  } = useSendTransaction();

  const effectiveHash = (localHash ?? hash) as `0x${string}` | undefined;
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: effectiveHash });

  const isPending = isSendPending || isConfirming;
  const isSuccess = isSubmitted && isConfirmed;
  const error = sendError;

  const sendMessage = async (message: string) => {
    reset();
    setLocalHash(undefined);
    const data = encodeFunctionData({
      abi: GMWORLD_ABI,
      functionName: 'sendMessage',
      args: [message],
    });

    // In Farcaster/Base Mini App, some connectors don't implement getChainId().
    // Use host EIP-1193 provider directly.
    const inIframe = typeof window !== 'undefined' && window !== window.top;
    if (inIframe) {
      const miniChainId = await getMiniAppChainId();
      if (miniChainId) {
        const txHash = await miniAppSendCall({
          to: GMWORLD_ADDRESS,
          data: appendBuilderAttributionIfBase(data, miniChainId),
          value: GMWORLD_FEE_WEI,
          chainId: miniChainId,
        });
        setLocalHash(txHash);
        return txHash;
      }
    }

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
