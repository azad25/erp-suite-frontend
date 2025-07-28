/**
 * Application configuration
 * This file centralizes all environment variables and configuration settings
 */

export const config = {
  apiUrls: {
    base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    auth: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8001',
    subscription: process.env.NEXT_PUBLIC_SUBSCRIPTION_API_URL || 'http://localhost:8002',
    crm: process.env.NEXT_PUBLIC_CRM_API_URL || 'http://localhost:8003',
    hrm: process.env.NEXT_PUBLIC_HRM_API_URL || 'http://localhost:8004',
    accounting: process.env.NEXT_PUBLIC_ACCOUNTING_API_URL || 'http://localhost:8005',
    inventory: process.env.NEXT_PUBLIC_INVENTORY_API_URL || 'http://localhost:8006',
    projects: process.env.NEXT_PUBLIC_PROJECTS_API_URL || 'http://localhost:8007',
    ai: process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8008',
    integration: process.env.NEXT_PUBLIC_INTEGRATION_API_URL || 'http://localhost:8009'
  },
  graphql: {
    url: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8010/graphql'
  },
  websocket: {
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8011'
  },
  elasticsearch: {
    url: process.env.NEXT_PUBLIC_ELASTICSEARCH_URL || 'http://localhost:9200'
  },
  redis: {
    url: process.env.NEXT_PUBLIC_REDIS_URL || 'redis://localhost:6379'
  },
  features: {
    aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
    realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true'
  },
  environment: process.env.NODE_ENV || 'development'
};

export default config;