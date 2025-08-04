import { NextResponse } from 'next/server';

/**
 * Runtime configuration endpoint
 * This allows changing config without rebuilding the frontend
 * No hardcoded URLs - all must come from environment variables
 */
export async function GET() {
  // Required environment variables
  const requiredEnvVars = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
  };

  // Check for missing environment variables
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    return NextResponse.json(
      { 
        error: 'Missing required environment variables', 
        missing: missingVars,
        message: 'Please ensure all required environment variables are set in your Docker configuration'
      },
      { status: 500 }
    );
  }

  const config = {
    apiUrls: {
      base: process.env.NEXT_PUBLIC_API_URL!,
      auth: process.env.NEXT_PUBLIC_AUTH_API_URL!,
      graphql: process.env.NEXT_PUBLIC_GRAPHQL_URL!,
      websocket: process.env.NEXT_PUBLIC_WEBSOCKET_URL!,
    },
    features: {
      aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
      realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
    },
  };

  return NextResponse.json(config);
}