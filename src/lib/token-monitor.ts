'use client';

import { authInterceptor } from './auth-interceptor';

class TokenMonitor {
  private static instance: TokenMonitor;
  private intervalId: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private checkInterval = 60000; // Check every minute

  static getInstance(): TokenMonitor {
    if (!TokenMonitor.instance) {
      TokenMonitor.instance = new TokenMonitor();
    }
    return TokenMonitor.instance;
  }

  // Start monitoring token expiration
  startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') {
      return;
    }

    this.isMonitoring = true;
    
    // Check immediately
    this.checkTokenStatus();
    
    // Set up periodic checks
    this.intervalId = setInterval(() => {
      this.checkTokenStatus();
    }, this.checkInterval);

    // Also check when the page becomes visible again (user returns from another tab)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Check when user becomes active again
    window.addEventListener('focus', this.handleWindowFocus);
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  private handleVisibilityChange = (): void => {
    if (!document.hidden) {
      // Page became visible, check token status
      this.checkTokenStatus();
    }
  };

  private handleWindowFocus = (): void => {
    // Window gained focus, check token status
    this.checkTokenStatus();
  };

  private async checkTokenStatus(): Promise<void> {
    try {
      const token = authInterceptor.getStoredToken();
      
      if (!token) {
        // No token, user is not authenticated
        return;
      }

      // Check if token is expired
      if (authInterceptor.isTokenExpired(token)) {
        console.log('Token expired, attempting refresh...');
        
        try {
          await authInterceptor.refreshToken();
          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Token refresh failed, user will be redirected to login
          // The auth interceptor handles this automatically
        }
      }
    } catch (error) {
      console.error('Token status check failed:', error);
    }
  }

  // Force an immediate token check
  async forceCheck(): Promise<boolean> {
    try {
      return await authInterceptor.checkAuthStatus();
    } catch (error) {
      console.error('Force token check failed:', error);
      return false;
    }
  }
}

export const tokenMonitor = TokenMonitor.getInstance();