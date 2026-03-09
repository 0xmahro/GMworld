/**
 * GMWorld Contract Configuration
 * Deployed on Base: 0x37b0F43D003e0593266747a55F6AEC3709A7bE20
 */
export const GMWORLD_ADDRESS = (
  process.env.NEXT_PUBLIC_GMWORLD_ADDRESS || '0x37b0F43D003e0593266747a55F6AEC3709A7bE20'
) as `0x${string}`;

export const GMWORLD_ABI = [
  {
    inputs: [{ name: 'message', type: 'string', internalType: 'string' }],
    name: 'sendMessage',
    outputs: [],
    stateMutability: 'nonpayable',
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
