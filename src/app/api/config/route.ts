import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
  const config = {
    apiUrls: {
      base: apiBase,
      graphql: process.env.NEXT_PUBLIC_GRAPHQL_URL || `${apiBase.replace(/\/$/, '')}/graphql`,
      websocket:
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || `${apiBase.replace(/^http/, 'ws').replace(/\/$/, '')}/ws`,
    },
    features: {
      aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
      realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
    },
  };

  const configString = JSON.stringify(config);
  const etag = `"${crypto.createHash('md5').update(configString).digest('hex')}"`;

  const clientETag = request.headers.get('if-none-match');
  if (clientETag === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
      },
    });
  }

  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
      ETag: etag,
      Vary: 'Accept-Encoding',
      'Content-Type': 'application/json',
    },
  });
}