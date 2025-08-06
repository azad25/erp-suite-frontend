import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    apiUrls: {
      base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost',
      auth: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost',
      graphql: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost/graphql', // API Gateway GraphQL endpoint
      websocket: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost/socket.io',
    },
    features: {
      aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
      realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
    },
  };

  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
    },
  });
}