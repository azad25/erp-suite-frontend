/**
 * Runtime configuration that can be changed without rebuilding
 * This fetches config from the server at runtime
 */

interface RuntimeConfig {
  apiUrls: {
    base: string;
    auth: string;
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

export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  if (cachedConfig) {
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
  try {
    // Add timeout to prevent hanging requests
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
    console.warn('Failed to fetch runtime config:', error);
    throw new Error('Configuration not available. Please ensure environment variables are set.');
  }
}

// Clear cache when needed
export function clearConfigCache() {
  cachedConfig = null;
}