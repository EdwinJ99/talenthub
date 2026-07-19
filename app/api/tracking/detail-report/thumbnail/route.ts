import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

const ALLOWED_HOST_SUFFIXES = [
  '.cdninstagram.com', '.fbcdn.net', '.tiktokcdn.com', '.tiktokcdn-us.com',
  '.byteoversea.com', '.ibytedtos.com', '.muscdn.com',
];

export async function GET(request: Request) {
  if (!(await getServerSession(authOptions))?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const source = new URL(new URL(request.url).searchParams.get('url') ?? '');
    const hostname = source.hostname.toLowerCase();
    if (source.protocol !== 'https:' || !ALLOWED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
      return NextResponse.json({ error: 'Thumbnail host is not allowed' }, { status: 400 });
    }

    const response = await fetch(source, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TalentHub/1.0)',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      cache: 'no-store',
    });
    if (!response.ok || !response.body) throw new Error(`Image responded with ${response.status}`);
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) throw new Error('Remote resource is not an image');

    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Thumbnail could not be loaded' }, { status: 502 });
  }
}
