import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error('TinyURL request failed');
    const shortUrl = await res.text();
    return NextResponse.json({ url: shortUrl.trim() });
  } catch {
    return NextResponse.json({ url: url }, { status: 200 });
  }
}
