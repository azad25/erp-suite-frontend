# Environment Variables Setup

## Overview

This document describes the environment variables used in the Unibase ERP frontend application. These variables are used to configure various services and features of the application.

## Setup Instructions

1. Create a `.env.local` file in the root directory of the project
2. Copy the environment variables from the template below
3. Adjust the values according to your environment

## Environment Variables Template

```env
# API Endpoints
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001
NEXT_PUBLIC_SUBSCRIPTION_API_URL=http://localhost:8002
NEXT_PUBLIC_CRM_API_URL=http://localhost:8003
NEXT_PUBLIC_HRM_API_URL=http://localhost:8004
NEXT_PUBLIC_ACCOUNTING_API_URL=http://localhost:8005
NEXT_PUBLIC_INVENTORY_API_URL=http://localhost:8006
NEXT_PUBLIC_PROJECTS_API_URL=http://localhost:8007
NEXT_PUBLIC_AI_API_URL=http://localhost:8008
NEXT_PUBLIC_INTEGRATION_API_URL=http://localhost:8009

# GraphQL
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8010/graphql

# WebSocket
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8011

# Elasticsearch
NEXT_PUBLIC_ELASTICSEARCH_URL=http://localhost:9200

# Redis
NEXT_PUBLIC_REDIS_URL=redis://localhost:6379

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_CHATBOT=true
NEXT_PUBLIC_ENABLE_REALTIME=true
```

## Usage in Code

The environment variables are centralized in the `src/lib/config.ts` file. To use them in your code, import the config object:

```typescript
import config from '@/lib/config';

// Examples
const apiUrl = config.apiUrls.base;
const graphqlUrl = config.graphql.url;
const websocketUrl = config.websocket.url;
const elasticsearchUrl = config.elasticsearch.url;
const redisUrl = config.redis.url;

// Feature flags
if (config.features.aiChatbot) {
  // Enable AI chatbot feature
}

if (config.features.realtimeUpdates) {
  // Enable realtime updates feature
}
```

## Environment Variables Description

### API Endpoints

- `NEXT_PUBLIC_API_URL`: Base API URL for the application
- `NEXT_PUBLIC_AUTH_API_URL`: Authentication service API URL
- `NEXT_PUBLIC_SUBSCRIPTION_API_URL`: Subscription service API URL
- `NEXT_PUBLIC_CRM_API_URL`: CRM service API URL
- `NEXT_PUBLIC_HRM_API_URL`: HRM service API URL
- `NEXT_PUBLIC_ACCOUNTING_API_URL`: Accounting service API URL
- `NEXT_PUBLIC_INVENTORY_API_URL`: Inventory service API URL
- `NEXT_PUBLIC_PROJECTS_API_URL`: Projects service API URL
- `NEXT_PUBLIC_AI_API_URL`: AI service API URL
- `NEXT_PUBLIC_INTEGRATION_API_URL`: Integration service API URL

### GraphQL

- `NEXT_PUBLIC_GRAPHQL_URL`: GraphQL endpoint URL

### WebSocket

- `NEXT_PUBLIC_WEBSOCKET_URL`: WebSocket server URL for real-time communication

### Elasticsearch

- `NEXT_PUBLIC_ELASTICSEARCH_URL`: Elasticsearch server URL for search functionality

### Redis

- `NEXT_PUBLIC_REDIS_URL`: Redis server URL for caching and session management

### Feature Flags

- `NEXT_PUBLIC_ENABLE_AI_CHATBOT`: Enable/disable AI chatbot feature
- `NEXT_PUBLIC_ENABLE_REALTIME`: Enable/disable real-time updates feature