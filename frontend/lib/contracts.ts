/**
 * GMWorld Contract Configuration
 * V2: payable - fee (0.000025 ETH) goes to owner
 * Set NEXT_PUBLIC_GMWORLD_ADDRESS after deploying GMWorldV2
 */
export const GMWORLD_ADDRESS = (
  process.env.NEXT_PUBLIC_GMWORLD_ADDRESS || '0x37b0F43D003e0593266747a55F6AEC3709A7bE20'
) as `0x${string}`;

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
