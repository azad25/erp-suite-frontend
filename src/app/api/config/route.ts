import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const config = {
    apiUrls: {
      // Prefer API Gateway directly in dev to avoid nginx proxy 422s
      base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      graphql: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql',
      websocket: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8000/ws',
    },
    features: {
      aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
      realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
    },
  };

  // Generate ETag based on config content
  const configString = JSON.stringify(config);
  const etag = `"${crypto.createHash('md5').update(configString).digest('hex')}"`;

  // Check if client has the same version
  const clientETag = request.headers.get('if-none-match');
  if (clientETag === etag) {
    return new NextResponse(null, { 
      status: 304,
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
      }
    });
  }

  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
      'ETag': etag,
      'Vary': 'Accept-Encoding',
      'Content-Type': 'application/json',
    },
  });
}