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
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)',
          borderRadius: 256,
        }}
      >
        <div style={{ fontSize: 480 }}>☀️</div>
      </div>
    ),
    {
      width: 1024,
      height: 1024,
      headers: { 'Cache-Control': 'public, max-age=86400, immutable' },
    }
  );
}
