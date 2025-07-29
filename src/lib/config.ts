/**
 * Application configuration
 * This file centralizes all environment variables and configuration settings
 * No hardcoded URLs - all must come from environment variables
 */

// Validate required environment variables
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Please check your Docker configuration.`);
  }
  return value;
}

export const config = {
  apiUrls: {
    base: validateEnvVar('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL),
    auth: validateEnvVar('NEXT_PUBLIC_AUTH_API_URL', process.env.NEXT_PUBLIC_AUTH_API_URL),
    subscription: process.env.NEXT_PUBLIC_SUBSCRIPTION_API_URL,
    crm: process.env.NEXT_PUBLIC_CRM_API_URL,
    hrm: process.env.NEXT_PUBLIC_HRM_API_URL,
    accounting: process.env.NEXT_PUBLIC_ACCOUNTING_API_URL,
    inventory: process.env.NEXT_PUBLIC_INVENTORY_API_URL,
    projects: process.env.NEXT_PUBLIC_PROJECTS_API_URL,
    ai: process.env.NEXT_PUBLIC_AI_API_URL,
    integration: process.env.NEXT_PUBLIC_INTEGRATION_API_URL
  },
  graphql: {
    url: validateEnvVar('NEXT_PUBLIC_GRAPHQL_URL', process.env.NEXT_PUBLIC_GRAPHQL_URL)
  },
  websocket: {
    url: validateEnvVar('NEXT_PUBLIC_WEBSOCKET_URL', process.env.NEXT_PUBLIC_WEBSOCKET_URL)
  },
  elasticsearch: {
    url: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL
  },
  redis: {
    url: process.env.NEXT_PUBLIC_REDIS_URL
  },
  // Server-side URLs (for API routes and SSR - use container names)
  serverUrls: {
    apiGateway: process.env.API_GATEWAY_URL,
    authService: process.env.AUTH_SERVICE_URL,
    graphqlGateway: process.env.GRAPHQL_GATEWAY_URL,
    websocketServer: process.env.WEBSOCKET_SERVER_URL,
  },
  features: {
    aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
    realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true'
  },
  environment: process.env.NODE_ENV
};

export default config;