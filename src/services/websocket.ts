// WebSocket service for real-time communication
import { io, Socket } from 'socket.io-client';
import { getRuntimeConfig } from '@/lib/runtime-config';

export interface WebSocketMessage {
  type: string;
  channel: string;
  data: any;
  timestamp: string;
}

export interface UserActivityMessage {
  type: 'user_activity';
  data: {
    id: string;
    userId: string;
    action: string;
    resource: string;
    details: Record<string, any>;
    ipAddress: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface UserStatusMessage {
  type: 'user_status';
  data: {
    userId: string;
    status: 'online' | 'offline' | 'away';
    lastSeen: string;
  };
}

export interface SecurityAlertMessage {
  type: 'security_alert';
  data: {
    id: string;
    type: 'failed_login' | 'suspicious_activity' | 'account_locked';
    userId?: string;
    ipAddress: string;
    details: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
    createdAt: string;
  };
}

export interface SystemNotificationMessage {
  type: 'system_notification';
  data: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    targetUsers?: string[];
    createdAt: string;
  };
}

export type WebSocketEventData = 
  | UserActivityMessage
  | UserStatusMessage
  | SecurityAlertMessage
  | SystemNotificationMessage;

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private websocketUrl: string | null = null;

  constructor() {
    // Only initialize on client-side
    if (typeof window !== 'undefined') {
      this.initializeConnection();
    }
  }

  private async initializeConnection(): Promise<void> {
    try {
      const config = await getRuntimeConfig();
      this.websocketUrl = config.apiUrls.websocket;
    } catch (error) {
      console.error('Failed to get WebSocket URL from config:', error);
      // Fallback to environment variable
      this.websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
    }
    
    this.connect();
  }

  private connect(): void {
    // Skip connection on server-side
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.websocketUrl) {
      console.error('WebSocket URL not available');
      return;
    }

    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.warn('No access token available for WebSocket connection');
      return;
    }

    this.socket = io(this.websocketUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 20000,
      forceNew: true,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('connected', { timestamp: new Date().toISOString() });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.emit('disconnected', { reason, timestamp: new Date().toISOString() });
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.emit('error', { error: error.message, timestamp: new Date().toISOString() });
      this.handleReconnect();
    });

    this.socket.on('auth_error', (error) => {
      console.error('WebSocket authentication error:', error);
      this.emit('auth_error', { error, timestamp: new Date().toISOString() });
      
      // Try to refresh token and reconnect
      this.refreshTokenAndReconnect();
    });

    // Handle incoming messages
    this.socket.on('message', (message: WebSocketMessage) => {
      this.handleMessage(message);
    });

    // Handle specific event types
    this.socket.on('user_activity', (data: UserActivityMessage['data']) => {
      this.emit('user_activity', data);
    });

    this.socket.on('user_status', (data: UserStatusMessage['data']) => {
      this.emit('user_status', data);
    });

    this.socket.on('security_alert', (data: SecurityAlertMessage['data']) => {
      this.emit('security_alert', data);
    });

    this.socket.on('system_notification', (data: SystemNotificationMessage['data']) => {
      this.emit('system_notification', data);
    });

    this.socket.on('user_created', (data: any) => {
      this.emit('user_created', data);
    });

    this.socket.on('user_updated', (data: any) => {
      this.emit('user_updated', data);
    });

    this.socket.on('user_deleted', (data: any) => {
      this.emit('user_deleted', data);
    });

    this.socket.on('role_assigned', (data: any) => {
      this.emit('role_assigned', data);
    });

    this.socket.on('role_revoked', (data: any) => {
      this.emit('role_revoked', data);
    });
  }

  private handleMessage(message: WebSocketMessage): void {
    console.log('Received WebSocket message:', message);
    this.emit('message', message);
    
    // Emit specific event type
    if (message.type) {
      this.emit(message.type, message.data);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts', { attempts: this.reconnectAttempts });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private async refreshTokenAndReconnect(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const config = await getRuntimeConfig();
      const response = await fetch(`${config.apiUrls.base}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      if (data.success && data.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', data.data.access_token);
          localStorage.setItem('refresh_token', data.data.refresh_token);
        }

        // Reconnect with new token
        this.disconnect();
        this.connect();
      } else {
        throw new Error('Invalid refresh response format');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }
  }

  // Public methods
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  // Event subscription methods
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  public off(event: string, callback?: Function): void {
    if (!this.eventListeners.has(event)) return;
    
    if (callback) {
      this.eventListeners.get(event)!.delete(callback);
    } else {
      this.eventListeners.get(event)!.clear();
    }
  }

  private emit(event: string, data: any): void {
    if (!this.eventListeners.has(event)) return;
    
    this.eventListeners.get(event)!.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in WebSocket event handler for ${event}:`, error);
      }
    });
  }

  // Channel subscription methods
  public subscribe(channel: string): void {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected, cannot subscribe to channel:', channel);
      return;
    }

    this.socket.emit('subscribe', { channel });
    console.log('Subscribed to channel:', channel);
  }

  public unsubscribe(channel: string): void {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected, cannot unsubscribe from channel:', channel);
      return;
    }

    this.socket.emit('unsubscribe', { channel });
    console.log('Unsubscribed from channel:', channel);
  }

  // Send message
  public send(type: string, data: any, channel?: string): void {
    if (!this.socket?.connected) {
      console.warn('WebSocket not connected, cannot send message');
      return;
    }

    const message: WebSocketMessage = {
      type,
      channel: channel || 'default',
      data,
      timestamp: new Date().toISOString(),
    };

    this.socket.emit('message', message);
  }

  // Convenience methods for common subscriptions
  public subscribeToUserActivity(userId?: string): void {
    const channel = userId ? `user_activity:${userId}` : 'user_activity:all';
    this.subscribe(channel);
  }

  public subscribeToSecurityAlerts(): void {
    this.subscribe('security_alerts');
  }

  public subscribeToSystemNotifications(): void {
    this.subscribe('system_notifications');
  }

  public subscribeToUserManagement(): void {
    this.subscribe('user_management');
  }

  public subscribeToUserStatus(userId?: string): void {
    const channel = userId ? `user_status:${userId}` : 'user_status:all';
    this.subscribe(channel);
  }

  // Get connection status
  public getStatus(): {
    connected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// React hook for WebSocket integration
export function useWebSocket() {
  const [connected, setConnected] = React.useState(websocketService.isConnected());
  const [status, setStatus] = React.useState(websocketService.getStatus());

  React.useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      setStatus(websocketService.getStatus());
    };

    const handleDisconnect = () => {
      setConnected(false);
      setStatus(websocketService.getStatus());
    };

    const handleError = (error: any) => {
      console.error('WebSocket error:', error);
      setStatus(websocketService.getStatus());
    };

    websocketService.on('connected', handleConnect);
    websocketService.on('disconnected', handleDisconnect);
    websocketService.on('error', handleError);

    return () => {
      websocketService.off('connected', handleConnect);
      websocketService.off('disconnected', handleDisconnect);
      websocketService.off('error', handleError);
    };
  }, []);

  return {
    connected,
    status,
    subscribe: websocketService.subscribe.bind(websocketService),
    unsubscribe: websocketService.unsubscribe.bind(websocketService),
    on: websocketService.on.bind(websocketService),
    off: websocketService.off.bind(websocketService),
    send: websocketService.send.bind(websocketService),
    reconnect: websocketService.reconnect.bind(websocketService),
  };
}

// Import React for the hook
import React from 'react';