import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/** Base embed requires 3:2 aspect ratio (1200x800) */
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
          background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
        }}
      >
        <div style={{ fontSize: 200, marginBottom: 24 }}>☀️</div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#78350f',
            marginBottom: 16,
          }}
        >
          GM World
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#92400e',
          }}
        >
          Good Morning on Base
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
      headers: { 'Cache-Control': 'public, max-age=86400, immutable' },
    }
  );
}
