// WebSocket service for real-time communication (Native WebSocket)
import React from 'react';
import { getRuntimeConfig } from '@/lib/runtime-config';

export interface WebSocketMessage {
  type: string;
  channel?: string;
  data: any;
  timestamp: string;
  messageId?: string;
  userId?: string;
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
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventListeners: Map<string, Set<Function>> = new Map();
  private websocketUrl: string | null = null;
  private connectionInitialized = false;
  private shouldConnect = false;
  private queuedSubscriptions: Set<string> = new Set();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' = 'disconnected';

  constructor() {
    // Initialize URL immediately with fallback
    this.websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost/ws';
    
    // Don't auto-initialize - only connect when explicitly requested
    // This prevents unnecessary connection attempts and console warnings
  }

  private async initializeConnection(): Promise<void> {
    if (this.connectionInitialized) return;
    this.connectionInitialized = true;

    try {
      // Get config in background, but don't block connection
      const config = await getRuntimeConfig();
      this.websocketUrl = config.apiUrls.websocket;
    } catch (error) {
      console.warn('Failed to get WebSocket URL from config, using fallback:', error);
      // Keep the fallback URL already set
    }
    
    // Only connect if explicitly requested
    if (this.shouldConnect) {
      this.connect();
    }
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

    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      console.log('WebSocket connection already in progress');
      return;
    }

    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.warn('No access token available for WebSocket connection');
      return;
    }

    try {
      this.connectionState = 'connecting';
      
      // Add token as query parameter for WebSocket authentication
      const wsUrl = `${this.websocketUrl}?token=${encodeURIComponent(token)}`;
      
      this.socket = new WebSocket(wsUrl);
      this.setupEventHandlers();
      
      console.log('Attempting WebSocket connection to:', this.websocketUrl);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.connectionState = 'disconnected';
      this.handleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.connectionState = 'connected';
      this.reconnectAttempts = 0;
      
      // Clear any pending reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Process queued subscriptions
      this.queuedSubscriptions.forEach(channel => {
        this.sendMessage({
          type: 'subscribe',
          data: { channel },
          timestamp: new Date().toISOString()
        });
        console.log('Subscribed to queued channel:', channel);
      });
      this.queuedSubscriptions.clear();
      
      this.emit('connected', { timestamp: new Date().toISOString() });
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.connectionState = 'disconnected';
      
      // Stop heartbeat
      this.stopHeartbeat();
      
      this.emit('disconnected', { 
        code: event.code,
        reason: event.reason, 
        timestamp: new Date().toISOString() 
      });
      
      // Attempt to reconnect unless it was a clean close
      if (event.code !== 1000) {
        this.handleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', { error: 'WebSocket error', timestamp: new Date().toISOString() });
    };

    this.socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error, event.data);
      }
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    // console.log('Received WebSocket message:', message);
    
    // Handle special message types
    switch (message.type) {
      case 'ack':
        console.log('Received acknowledgment:', message.data);
        break;
      case 'error':
        console.error('WebSocket server error:', message.data);
        this.emit('error', message.data);
        break;
      case 'heartbeat':
        // Respond to heartbeat
        this.sendMessage({
          type: 'heartbeat',
          data: { status: 'alive' },
          timestamp: new Date().toISOString()
        });
        break;
      default:
        // Emit the message to listeners
        this.emit('message', message);
        
        // Emit specific event type
        if (message.type) {
          this.emit(message.type, message.data);
        }
        break;
    }
  }

  private handleReconnect(): void {
    if (this.connectionState === 'reconnecting') {
      return; // Already attempting to reconnect
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts', { attempts: this.reconnectAttempts });
      return;
    }

    this.connectionState = 'reconnecting';
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing heartbeat
    
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'heartbeat',
          data: { status: 'ping' },
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sendMessage(message: WebSocketMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message:', message);
    }
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
      const response = await fetch(`${config.apiUrls.base}/refresh`, {
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
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public getConnectionState(): string {
    return this.connectionState;
  }

  public disconnect(): void {
    this.shouldConnect = false;
    this.stopHeartbeat();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }
    
    this.connectionState = 'disconnected';
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.shouldConnect = true;
    this.connect();
  }

  // Lazy connection - only connect when actually needed
  public ensureConnection(): void {
    this.shouldConnect = true;
    if (!this.connectionInitialized) {
      this.initializeConnection();
    } else if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.connect();
    }
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
    if (!this.isConnected()) {
      // Queue subscription for when connection is established
      this.queuedSubscriptions.add(channel);
      console.log('Queued subscription for channel:', channel);
      return;
    }

    this.sendMessage({
      type: 'subscribe',
      data: { channel },
      timestamp: new Date().toISOString()
    });
    console.log('Subscribed to channel:', channel);
  }

  public unsubscribe(channel: string): void {
    if (!this.isConnected()) {
      console.warn('WebSocket not connected, cannot unsubscribe from channel:', channel);
      return;
    }

    this.sendMessage({
      type: 'unsubscribe',
      data: { channel },
      timestamp: new Date().toISOString()
    });
    console.log('Unsubscribed from channel:', channel);
  }

  // Send message
  public send(type: string, data: any, channel?: string): void {
    if (!this.isConnected()) {
      console.warn('WebSocket not connected, cannot send message');
      return;
    }

    const message: WebSocketMessage = {
      type,
      channel: channel || 'default',
      data,
      timestamp: new Date().toISOString(),
    };

    this.sendMessage(message);
  }

  // Convenience methods for common subscriptions
  public subscribeToUserActivity(userId?: string): void {
    const channel = userId ? `user_activity:${userId}` : 'user_activity:all';
    this.ensureConnection();
    this.subscribe(channel);
  }

  public subscribeToSecurityAlerts(): void {
    this.ensureConnection();
    // Backend publishes on Redis/WebSocket channel: events:failed_login
    // Align subscription to match publisher
    this.subscribe('events:failed_login');
  }

  public subscribeToSystemNotifications(): void {
    this.ensureConnection();
    this.subscribe('system_notifications');
  }

  public subscribeToUserManagement(): void {
    this.ensureConnection();
    this.subscribe('user_management');
  }

  public subscribeToUserStatus(userId?: string): void {
    const channel = userId ? `user_status:${userId}` : 'user_status:all';
    this.ensureConnection();
    this.subscribe(channel);
  }

  // Security utilities
  public subscribeToSecurityEvents(eventType: string = 'failed_login'): void {
    // Backend channel format is events:<eventType>
    const channel = `events:${eventType}`;
    this.ensureConnection();
    this.subscribe(channel);
  }

  public onSecurityEvent(
    callback: (message: WebSocketMessage) => void,
    eventType: string = 'failed_login',
  ): () => void {
    // Listen for all messages and filter by specific event type
    const handler = (message: WebSocketMessage) => {
      // Handle different message formats from backend
      const isSecurityEvent = 
        (message.type === 'event' && message.channel === eventType) ||
        (message.type === 'event' && message.channel === `events:${eventType}`) ||
        (message.type === 'security_alert' && message.data?.type === eventType) ||
        (message.type === eventType);
      
      if (isSecurityEvent) {
        console.log('Security event received:', message);
        callback(message);
      }
    };
    this.on('message', handler);
    return () => this.off('message', handler);
  }

  // Get connection status
  public getStatus(): {
    connected: boolean;
    connectionState: string;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
  } {
    return {
      connected: this.isConnected(),
      connectionState: this.connectionState,
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
    ensureConnection: websocketService.ensureConnection.bind(websocketService),
  };
}