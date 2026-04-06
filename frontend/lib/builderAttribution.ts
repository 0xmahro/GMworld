import { Attribution } from 'ox/erc8021';
import { base } from 'wagmi/chains';
import type { Hex } from 'viem';

/**
 * Base Builder Code (ERC-8021). Public; set in base.dev → Settings → Builder Code.
 * @see https://docs.base.org/base-chain/builder-codes/app-developers
 */
const BUILDER_CODE =
  process.env.NEXT_PUBLIC_BASE_BUILDER_CODE?.trim() || 'bc_v8nzoiyp';

let cachedSuffix: Hex | null = null;

export function getBuilderDataSuffix(): Hex {
  if (cachedSuffix) return cachedSuffix;
  cachedSuffix = Attribution.toDataSuffix({
    codes: [BUILDER_CODE],
  }) as Hex;
  return cachedSuffix;
}

/** Append ERC-8021 attribution suffix only on Base mainnet (matches Builder Code registration). */
export function appendBuilderAttributionIfBase(
  calldata: Hex,
  chainId: number
): Hex {
  if (chainId !== base.id) return calldata;
  const suffix = getBuilderDataSuffix().replace(/^0x/i, '');
  const body = calldata.replace(/^0x/i, '');
  return (`0x${body}${suffix}`) as Hex;
}
