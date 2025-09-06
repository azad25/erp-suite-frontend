// ============================================================================
// GRAPHQL CLIENT
// ============================================================================

import { getRuntimeConfig } from '@/lib/runtime-config';
import { apiClient as unifiedApiClient } from '@/lib/api';

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
      this.baseURL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost/graphql';
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

        // Handle different types of errors
        const errorMessages = result.errors.map((e: any) => {
          const code = e.extensions?.code;
          const message = e.message || '';

          if (code === 'UNAUTHENTICATED' || message.toLowerCase().includes('not authenticated')) {
            // Clear potentially corrupted tokens
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('user');
            }
            return 'Authentication required - please sign in';
          }
          if (code === 'FORBIDDEN') {
            return 'Insufficient permissions for this operation';
          }
          if (code === 'NOT_FOUND' || message.toLowerCase().includes('not found')) {
            return message || 'Requested resource not found';
          }
          return message;
        });

        // Create error with appropriate code
        const firstError = result.errors[0];
        const errorCode = firstError?.extensions?.code;
        const isUnauthenticated = errorCode === 'UNAUTHENTICATED' ||
          result.errors.some((e: any) => String(e.message || '').toLowerCase().includes('not authenticated'));
        const isNotFound = errorCode === 'NOT_FOUND' ||
          result.errors.some((e: any) => String(e.message || '').toLowerCase().includes('not found'));

        if (isUnauthenticated) {
          const authError: any = new Error(errorMessages[0] || 'Authentication required');
          authError.code = 'UNAUTHENTICATED';
          // Redirect to sign in if we're in the browser
          if (typeof window !== 'undefined') {
            // Ensure cookie + localStorage are cleared so middleware and client agree
            unifiedApiClient.clearAuth();
            window.location.href = '/signin';
          }
          throw authError;
        }

        if (isNotFound) {
          const notFoundError: any = new Error(errorMessages[0] || 'Resource not found');
          notFoundError.code = 'NOT_FOUND';
          throw notFoundError;
        }

        const genericError: any = new Error(`GraphQL errors: ${errorMessages.join(', ')}`);
        if (errorCode) genericError.code = errorCode;
        throw genericError;
      }

      // Handle cases where data is null or undefined but no errors
      if (result.data === null || result.data === undefined) {
        console.warn('GraphQL returned null data without errors');
        return {} as T;
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
            const response = await fetch('/api/v1/auth/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.data?.access_token) {
                // Keep cookie and local storage in sync
                unifiedApiClient.setAccessToken(data.data.access_token);
                // Retry the original request with the new token
                return this.request(query, variables);
              }
            }
          }

          // If refresh fails, signal auth error; middleware will handle redirects
          throw new Error('Authentication required - please sign in');
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Ensure auth state is cleared so middleware redirects correctly
          unifiedApiClient.clearAuth();
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