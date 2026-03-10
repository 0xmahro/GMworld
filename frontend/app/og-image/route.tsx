import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #18181b 0%, #27272a 100%)',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            marginBottom: 16,
          }}
        >
          GM World
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#a1a1aa',
          }}
        >
          Good Morning on Base
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
