// Authentication interceptor for handling token expiration
import { getRuntimeConfig } from './runtime-config';

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  issued_at: number;
}

class AuthInterceptor {
  private static instance: AuthInterceptor;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  static getInstance(): AuthInterceptor {
    if (!AuthInterceptor.instance) {
      AuthInterceptor.instance = new AuthInterceptor();
    }
    return AuthInterceptor.instance;
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getStoredToken() || undefined;
    }
    
    if (!token) return true;

    try {
      // Get token expiration from localStorage
      const tokenData = this.getTokenData();
      if (!tokenData) return true;

      const now = Date.now() / 1000; // Current time in seconds
      const expiresAt = tokenData.issued_at + tokenData.expires_in;
      const bufferTime = 5 * 60; // 5 minutes buffer

      return (expiresAt - bufferTime) <= now;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Get stored token from localStorage
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  // Get stored token data
  getTokenData(): TokenData | null {
    if (typeof window === 'undefined') return null;
    
    const tokenDataStr = localStorage.getItem('token_data');
    if (!tokenDataStr) return null;

    try {
      return JSON.parse(tokenDataStr);
    } catch {
      return null;
    }
  }

  // Store token with expiration data
  storeToken(access_token: string, refresh_token: string, expires_in: number): void {
    if (typeof window === 'undefined') return;

    const tokenData: TokenData = {
      access_token,
      refresh_token,
      expires_in,
      issued_at: Date.now() / 1000
    };

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('token_data', JSON.stringify(tokenData));

    // Also set cookies for middleware access
    document.cookie = `access_token=${access_token}; path=/; max-age=${expires_in}; SameSite=Lax`;
    document.cookie = `token_data=${encodeURIComponent(JSON.stringify(tokenData))}; path=/; max-age=${expires_in}; SameSite=Lax`;
  }

  // Clear all auth data
  clearAuth(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_data');
    localStorage.removeItem('user');

    // Clear cookies
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'token_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  // Refresh token
  async refreshToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const config = await getRuntimeConfig();
      const response = await fetch(`${config.apiUrls.base}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Store new tokens
      this.storeToken(data.access_token, data.refresh_token, data.expires_in);
      
      return data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Check if this is a network error (backend not available)
      if (error instanceof Error && (
        error.name === 'AbortError' ||
        error.message.includes('fetch') || 
        error.message.includes('network') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('Failed to fetch')
      )) {
        console.warn('Backend auth service appears to be unavailable');
        
        // In development, don't clear auth data immediately for network errors
        if (process.env.NODE_ENV === 'development') {
          throw new Error('Backend unavailable - keeping current session');
        }
      }
      
      // Clear auth data and redirect to login for other errors
      this.clearAuth();
      this.redirectToLogin();
      throw error;
    }
  }

  // Redirect to login page
  redirectToLogin(): void {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    const loginUrl = `/signin?redirect=${encodeURIComponent(currentPath)}`;
    
    // Use replace to avoid back button issues
    window.location.replace(loginUrl);
  }

  // Check authentication status and handle expired tokens
  async checkAuthStatus(): Promise<boolean> {
    const token = this.getStoredToken();
    
    if (!token) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      try {
        await this.refreshToken();
        return true;
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  // Check if URL is an authentication endpoint that doesn't require tokens
  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/refresh'
    ];
    
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }

  // Intercept fetch requests to handle token expiration
  async interceptRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // Skip token validation for authentication endpoints
    if (this.isAuthEndpoint(url)) {
      return fetch(url, options);
    }

    // Check if token is expired before making request
    if (this.isTokenExpired()) {
      try {
        await this.refreshToken();
      } catch (error) {
        // Token refresh failed, user will be redirected to login
        throw new Error('Authentication required');
      }
    }

    // Add current token to request
    const token = this.getStoredToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    const response = await fetch(url, options);

    // Handle 401 responses (but not for auth endpoints)
    if (response.status === 401 && !this.isAuthEndpoint(url)) {
      try {
        // Try to refresh token
        await this.refreshToken();
        
        // Retry the original request with new token
        const newToken = this.getStoredToken();
        if (newToken) {
          options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
          };
          return fetch(url, options);
        }
      } catch (error) {
        // Refresh failed, redirect to login
        this.redirectToLogin();
        throw new Error('Authentication required');
      }
    }

    return response;
  }
}

export const authInterceptor = AuthInterceptor.getInstance();