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

export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    // Fetch config from your API endpoint
    const response = await fetch('/api/config');
    if (response.ok) {
      cachedConfig = await response.json();
      return cachedConfig;
    }
  } catch (error) {
    console.warn('Failed to fetch runtime config:', error);
  }

  // If API config fails, throw error - no hardcoded fallbacks
  throw new Error('Configuration not available. Please ensure environment variables are set.');
}

// Clear cache when needed
export function clearConfigCache() {
  cachedConfig = null;
}