import { ImageResponse } from 'next/og';
import { decodeConfig } from '@/lib/codec';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get('data');
  const config = data ? decodeConfig(data) : null;
  const name = config?.senderName || 'Someone';

  let interData: ArrayBuffer | null = null;
  try {
    const response = await fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0I5nvw.woff',
      { signal: AbortSignal.timeout(5000) },
    );
    if (response.ok) {
      interData = await response.arrayBuffer();
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          fontFamily: interData ? 'Inter' : 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #e11d48, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(225, 29, 72, 0.2)',
            marginBottom: 28,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: '#64748b',
              margin: 0,
            }}
          >
            YesCard from
          </h1>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #e11d48, #7c3aed)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            {name}
          </span>
        </div>

        <p
          style={{
            fontSize: 24,
            color: '#94a3b8',
            textAlign: 'center',
            margin: '12px 0 0',
          }}
        >
          sent you a special invitation ✨
        </p>

        <p
          style={{
            position: 'absolute',
            bottom: 36,
            fontSize: 16,
            color: '#cbd5e1',
          }}
        >
          yescard.app
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: interData
        ? [{ name: 'Inter', data: interData, weight: 400, style: 'normal' }]
        : undefined,
    },
  );
}
