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
          background: '#18181b',
          borderRadius: 256,
        }}
      >
        <div
          style={{
            fontSize: 320,
            fontWeight: 800,
            color: 'white',
          }}
        >
          GM
        </div>
      </div>
    ),
    { width: 1024, height: 1024 }
  );
}
