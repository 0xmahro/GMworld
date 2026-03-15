/**
 * GMWorld Contract Configuration
 * V2: payable - fee (0.000025 ETH) goes to owner
 * Set NEXT_PUBLIC_GMWORLD_ADDRESS after deploying GMWorldV2.
 *
 * IMPORTANT: There is deliberately NO fallback address here.
 * If the env var is missing, build will fail instead of silently
 * sending transactions to a wrong contract.
 */
if (!process.env.NEXT_PUBLIC_GMWORLD_ADDRESS) {
  throw new Error('NEXT_PUBLIC_GMWORLD_ADDRESS is not set');
}

export const GMWORLD_ADDRESS = process.env
  .NEXT_PUBLIC_GMWORLD_ADDRESS as `0x${string}`;

/** Fee in wei: 0.000025 ETH */
export const GMWORLD_FEE_WEI = 25000000000000n;

export const GMWORLD_ABI = [
  {
    inputs: [{ name: 'message', type: 'string', internalType: 'string' }],
    name: 'sendMessage',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'message', type: 'string', indexed: false, internalType: 'string' },
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    name: 'MessageSent',
    type: 'event',
  },
] as const;
