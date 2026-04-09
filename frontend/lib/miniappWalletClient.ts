import { createWalletClient, custom, type EIP1193Provider } from 'viem';

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

export async function getMiniAppWalletClient() {
  const provider = await getMiniAppEip1193Provider();
  if (!provider) return null;
  const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
  const account = accounts?.[0] as `0x${string}` | undefined;
  if (!account) return null;
  return createWalletClient({
    account,
    transport: custom(provider),
  });
}

export async function getMiniAppChainId(): Promise<number | null> {
  const provider = await getMiniAppEip1193Provider();
  if (!provider) return null;
  const hexChainId = (await provider.request({ method: 'eth_chainId' })) as string;
  return Number.parseInt(hexChainId, 16);
}

