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
      this.baseURL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8080/api/graphql';
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
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
      }

      return result.data;
    } catch (error: any) {
      console.error('GraphQL request failed:', error);
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