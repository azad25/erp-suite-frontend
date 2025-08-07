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

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        // Handle 401 specifically for better error messages
        if (response.status === 401) {
          throw new Error(`GraphQL request failed: 401 Unauthorized - Please check your authentication token`);
        }
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        // Provide more detailed error information
        const errorMessages = result.errors.map((e: any) => {
          if (e.extensions?.code === 'UNAUTHENTICATED') {
            return 'Authentication required - please log in';
          }
          if (e.extensions?.code === 'FORBIDDEN') {
            return 'Insufficient permissions for this operation';
          }
          return e.message;
        });
        throw new Error(`GraphQL errors: ${errorMessages.join(', ')}`);
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

          // If refresh fails, redirect to login
          window.location.href = '/signin';
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          window.location.href = '/signin';
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