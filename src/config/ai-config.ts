// AI Service Configuration
export const AI_CONFIG = {
  // WebSocket endpoint for real-time AI chat (via API Gateway)
  // Note: The API Gateway WebSocket endpoint is /ws/chat
  WEBSOCKET_URL: process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL || 
                'ws://localhost/ws',
  
  // REST API endpoint for AI chat (via API Gateway)
  AI_COPILOT_URL: process.env.NEXT_PUBLIC_AI_WEBSOCKET_URL || 
                 'ws://localhost/ws/chat',
  
  // API Gateway base URL
  API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 
                  'http://localhost',
  
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
  return AI_CONFIG.WEBSOCKET_URL;
};

// Helper function to get AI Copilot URL (via API Gateway)
export const getAICopilotUrl = (): string => {
  return AI_CONFIG.AI_COPILOT_URL;
};

// Helper function to get API Gateway URL
export const getAPIGatewayUrl = (): string => {
  return AI_CONFIG.API_GATEWAY_URL;
};
