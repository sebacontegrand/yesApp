import { ImageResponse } from 'next/og';

export const alt = 'YesCard — Custom Shareable Interactive Invitations';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  let interData: ArrayBuffer | null = null;
  try {
    const response = await fetch(
      'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0I5nvw.woff',
      { signal: AbortSignal.timeout(5000) }
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
        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '28px',
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
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #e11d48, #7c3aed)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            YesCard
          </h1>
        </div>

        <p
          style={{
            fontSize: 28,
            color: '#475569',
            textAlign: 'center',
            maxWidth: 640,
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Create a fun invitation where your recipient can only say YES!
        </p>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '36px',
          }}
        >
          {['💌', '✨', '🎉', '😍', '🎁'].map((emoji) => (
            <span key={emoji} style={{ fontSize: 36 }}>{emoji}</span>
          ))}
        </div>

        <p
          style={{
            position: 'absolute',
            bottom: 36,
            fontSize: 16,
            color: '#94a3b8',
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
