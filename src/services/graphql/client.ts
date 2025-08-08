// ============================================================================
// GRAPHQL CLIENT
// ============================================================================

import { getRuntimeConfig } from '@/lib/runtime-config';

// Simple GraphQL client that uses the API Gateway GraphQL endpoint
export class GraphQLClient {
  private baseURL: string = '';
  private configLoaded: boolean = false;

  constructor() {
    this.initializeConfig();
  }

  private async initializeConfig(): Promise<void> {
    try {
      const config = await getRuntimeConfig();
      this.baseURL = config.apiUrls.graphql;
      this.configLoaded = true;
    } catch (error) {
      console.error('Failed to load GraphQL config:', error);
      // Default to API Gateway directly in development to avoid nginx proxy health issues
      this.baseURL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql';
      this.configLoaded = true;
    }
  }

  private async ensureConfigLoaded(): Promise<void> {
    if (this.configLoaded) return;
    await this.initializeConfig();
  }

  // Execute GraphQL query via API Gateway GraphQL endpoint
  async request<T = any>(query: string, variables?: any): Promise<T> {
    try {
      await this.ensureConfigLoaded();

      const token = this.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const doFetch = async (url: string) => fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      let response = await doFetch(this.baseURL);

      if (!response.ok) {
        // Handle 401 specifically for better error messages
        if (response.status === 401) {
          throw new Error(`GraphQL request failed: 401 Unauthorized - Please check your authentication token`);
        }
        // Auto-retry against API Gateway directly in dev if we hit proxy issues
        const isLocalhost = this.baseURL.includes('localhost') || this.baseURL.includes('127.0.0.1');
        const isNotGateway = !this.baseURL.includes(':8000');
        const shouldRetryToGateway = isLocalhost && isNotGateway && [422, 502, 503, 504].includes(response.status);
        if (shouldRetryToGateway) {
          const gatewayURL = this.baseURL
            .replace('http://localhost', 'http://localhost:8000')
            .replace('http://127.0.0.1', 'http://127.0.0.1:8000');
          try {
            response = await doFetch(gatewayURL);
          } catch {
            // ignore and fall through
          }
        }

        if (!response.ok) {
          throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        // Special-case: common not-found scenario without extensions
        const lowerMessages = result.errors.map((e: any) => String(e.message || '').toLowerCase());
        const hasNotFound = lowerMessages.some((m: string) => m.includes('not found'));
        const hasUserPath = result.errors.some((e: any) => Array.isArray(e.path) && e.path.includes('user'));
        if (hasNotFound && hasUserPath) {
          const notFoundError: any = new Error('User not found');
          notFoundError.code = 'NOT_FOUND';
          throw notFoundError;
        }

        // Provide more detailed error information
        const errorMessages = result.errors.map((e: any) => {
          const code = e.extensions?.code;
          if (code === 'UNAUTHENTICATED') {
            return 'Authentication required - please log in';
          }
          if (code === 'FORBIDDEN') {
            return 'Insufficient permissions for this operation';
          }
          if (code === 'NOT_FOUND') {
            return e.message || 'Requested resource not found';
          }
          return e.message;
        });
        const genericError: any = new Error(`GraphQL errors: ${errorMessages.join(', ')}`);
        // If any error had an extension code, preserve the first
        const firstWithCode = (result.errors as any[]).find(e => e.extensions?.code);
        if (firstWithCode) genericError.code = firstWithCode.extensions.code;
        throw genericError;
      }

      return result.data;
    } catch (error: any) {
      console.error('GraphQL request failed:', error);

      // If it's a 401 error, try to refresh the token
      if (error.message.includes('401') && typeof window !== 'undefined') {
        try {
          // Try to refresh the token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data?.access_token) {
                localStorage.setItem('access_token', data.data.access_token);
                // Retry the original request with the new token
                return this.request(query, variables);
              }
            }
          }

          // If refresh fails, signal auth error; middleware will handle redirects
          throw new Error('Authentication required - please sign in');
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw new Error('Authentication required - please sign in');
        }
      }

      throw error;
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('access_token');
    if (token === 'undefined' || token === 'null') {
      localStorage.removeItem('access_token');
      return null;
    }
    return token;
  }
}