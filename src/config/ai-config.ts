// AI Service Configuration
export const API_GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000';

// Compute a sane default WebSocket URL from the API gateway URL
const computeDefaultWebSocketUrl = (): string => {
  try {
    const base = new URL(API_GATEWAY_URL);
    const wsProtocol = base.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProtocol}//${base.host}/ws/chat`;
  } catch (e) {
    return 'ws://localhost/ws/chat';
  }
};

export const AI_CONFIG = {
  // WebSocket endpoint for real-time AI chat with reasoning support
  // Updated to connect through nginx proxy WebSocket
  WEBSOCKET_URL: process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL || 'ws://localhost/ws/chat',

  // REST API endpoint for AI chat (via API Gateway)
  // Updated to point through API Gateway for proper authentication and routing
  AI_COPILOT_URL: process.env.NEXT_PUBLIC_AI_COPILOT_URL || 'http://localhost/api/v1/ai/chat',

  // API Gateway base URL
  API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost',

  // Default context for AI requests
  DEFAULT_CONTEXT: {
    application: 'erp-suite',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // WebSocket message types
  MESSAGE_TYPES: {
    AI_CHAT: 'ai_chat',
    AI_STREAM: 'ai_stream',
    AI_STATUS: 'ai_status',
    CONNECTION_STATUS: 'connection_status',
  },

  // Reconnection settings
  RECONNECTION: {
    MAX_ATTEMPTS: 5,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 30000,
    BACKOFF_MULTIPLIER: 2,
  },
} as const;

// Helper function to get WebSocket URL
export const getWebSocketUrl = (): string => {
  // Ensure we're using the API Gateway WebSocket URL via NGINX proxy
  const baseUrl = AI_CONFIG.API_GATEWAY_URL;
  const wsProtocol = baseUrl.startsWith('https') ? 'wss:' : 'ws:';
  const host = baseUrl.replace(/^https?:\/\//, '');
  return `${wsProtocol}//${host}/ws/chat`;
};

// Helper function to get AI Copilot URL (via API Gateway)
export const getAICopilotUrl = (): string => {
  // Ensure we're using the API Gateway URL
  const baseUrl = AI_CONFIG.API_GATEWAY_URL;
  return `${baseUrl}/api/v1/ai/chat`;
};

// Helper function to get API Gateway URL
export const getAPIGatewayUrl = (): string => {
  return AI_CONFIG.API_GATEWAY_URL;
};
