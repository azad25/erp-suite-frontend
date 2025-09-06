/**
 * Runtime configuration that can be changed without rebuilding
 * This fetches config from the server at runtime
 */

interface RuntimeConfig {
  apiUrls: {
    base: string;
    graphql: string;
    websocket: string;
  };
  features: {
    aiChatbot: boolean;
    realtimeUpdates: boolean;
  };
}

let cachedConfig: RuntimeConfig | null = null;
let configPromise: Promise<RuntimeConfig> | null = null;

// Pre-initialize config from environment variables for immediate availability
const fallbackConfig: RuntimeConfig = {
  apiUrls: {
    // Default to API gateway port in dev
    base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost',
    graphql: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost/graphql',
    websocket: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost/ws',
  },
  features: {
    aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
    realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
  },
};

// Initialize with fallback config immediately
cachedConfig = fallbackConfig;

export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  // Return cached config immediately if available
  if (cachedConfig) {
    // Asynchronously update config in background if needed
    if (typeof window !== 'undefined' && !configPromise) {
      configPromise = fetchConfig().then(config => {
        cachedConfig = config;
        configPromise = null;
        return config;
      }).catch(() => {
        configPromise = null;
        return cachedConfig!;
      });
    }
    return cachedConfig;
  }

  // Prevent multiple simultaneous config requests
  if (configPromise) {
    return configPromise;
  }

  configPromise = fetchConfig();

  try {
    cachedConfig = await configPromise;
    return cachedConfig;
  } finally {
    configPromise = null;
  }
}

async function fetchConfig(): Promise<RuntimeConfig> {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side: use environment variables directly
    return {
      apiUrls: {
        base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost',
        graphql: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost/graphql',
        websocket: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost/ws',
      },
      features: {
        aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
        realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
      },
    };
  }

  try {
    // Client-side: fetch from API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('/api/config', {
      signal: controller.signal,
      cache: 'force-cache' // Enable browser caching
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }

    throw new Error(`Config API returned ${response.status}`);
  } catch (error) {
    console.warn('Failed to fetch runtime config, falling back to environment variables:', error);

    // Fallback to environment variables
    return {
      apiUrls: {
        base: process.env.NEXT_PUBLIC_API_URL || 'http://localhost',
        graphql: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost/graphql',
        websocket: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost/ws',
      },
      features: {
        aiChatbot: process.env.NEXT_PUBLIC_ENABLE_AI_CHATBOT === 'true',
        realtimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
      },
    };
  }
}

// Clear cache when needed
export function clearConfigCache() {
  cachedConfig = null;
}