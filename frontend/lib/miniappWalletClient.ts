import type { EIP1193Provider, Hex } from 'viem';

/** Returns an EIP-1193 provider from Farcaster/Base Mini App host, if available. */
export async function getMiniAppEip1193Provider(): Promise<EIP1193Provider | null> {
  try {
    const { sdk } = await import('@farcaster/miniapp-sdk');
    // getEthereumProvider returns an EIP-1193 provider when running inside the host.
    return (await sdk.wallet.getEthereumProvider()) as unknown as EIP1193Provider;
  } catch {
    return null;
  }
}

export async function getMiniAppChainId(): Promise<number | null> {
  const provider = await getMiniAppEip1193Provider();
  if (!provider) return null;
  const hexChainId = (await provider.request({ method: 'eth_chainId' })) as string;
  return Number.parseInt(hexChainId, 16);
}

export async function getMiniAppAccount(): Promise<`0x${string}` | null> {
  const provider = await getMiniAppEip1193Provider();
  if (!provider) return null;
  const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
  return (accounts?.[0] as `0x${string}` | undefined) ?? null;
}

function toHexChainId(chainId: number): Hex {
  return (`0x${chainId.toString(16)}`) as Hex;
}

function toHexWei(value: bigint): Hex {
  return (`0x${value.toString(16)}`) as Hex;
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

/**
 * Send a single call via EIP-5792 wallet_sendCalls and wait for receipts.
 * Returns the onchain transaction hash if the wallet provides it.
 */
export async function miniAppSendCall({
  to,
  data,
  value,
  chainId,
}: {
  to: `0x${string}`;
  data: Hex;
  value: bigint;
  chainId: number;
}): Promise<`0x${string}`> {
  const provider = await getMiniAppEip1193Provider();
  if (!provider) throw new Error('Mini App provider not available');
  const from = await getMiniAppAccount();
  if (!from) throw new Error('No wallet account');

  const result = (await provider.request({
    method: 'wallet_sendCalls',
    params: [
      {
        version: '1.0',
        from,
        chainId: toHexChainId(chainId),
        atomicRequired: true,
        calls: [
          {
            to,
            data,
            value: toHexWei(value),
          },
        ],
      },
    ],
  })) as { id: string };

  const id = result?.id;
  if (!id) throw new Error('wallet_sendCalls did not return id');

  // Poll wallet_getCallsStatus until confirmed (200) or failed (>=400)
  for (let i = 0; i < 30; i++) {
    const statusRes = (await provider.request({
      method: 'wallet_getCallsStatus',
      params: [id],
    })) as any;

    const status = Number(statusRes?.status);
    if (status === 200) {
      const txHash =
        statusRes?.receipts?.[0]?.transactionHash ??
        statusRes?.receipts?.[0]?.transaction?.hash ??
        null;
      if (typeof txHash === 'string' && txHash.startsWith('0x')) return txHash as `0x${string}`;
      // Some wallets might not include tx hash; still return the call bundle id for debugging.
      return id as `0x${string}`;
    }
    if (status >= 400) {
      throw new Error(`wallet_sendCalls failed (status ${status})`);
    }
    await sleep(500);
  }

  throw new Error('Timed out waiting for wallet_sendCalls confirmation');
}

