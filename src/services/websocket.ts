// WebSocket service for real-time communication (Native WebSocket)
import React from 'react';
import { AI_CONFIG } from '@/config/ai-config';

type WebSocketState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
type EventCallback = (data: any) => void;

// Base WebSocket message interface
export interface WebSocketMessage<T = any> {
  type: string;
  channel?: string;
  data: T;
  timestamp: string;
  messageId?: string;
  userId?: string;
  status?: 'success' | 'error' | 'pending';
  error?: string;
}

// AI Chat specific message types
export interface AIChatMessage extends WebSocketMessage {
  type: 'chat_message' | 'ai_stream' | 'ai_status';
  data: {
    content: string;
    isFinal?: boolean;
    messageId: string;
    conversationId?: string;
    metadata?: Record<string, any>;
  };
}

// AI Chat request message
export interface AIChatRequest extends WebSocketMessage {
  type: 'chat_message';
  data: {
    message: string;
    conversationId?: string;
    context?: Record<string, any>;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
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
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private websocketUrl: string | null = null;
  private connectionInitialized = false;
  public shouldConnect = false;
  private queuedSubscriptions: Set<string> = new Set();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' = 'disconnected';
  private isConnecting = false;
  private connectionLock = false;

  constructor() {
    // Initialize with empty URL, will be set in initializeConnection()
    this.websocketUrl = '';
    
    // Don't auto-initialize - only connect when explicitly requested
    // This prevents unnecessary connection attempts and console warnings
    console.log('WebSocketService initialized. Will connect to:', AI_CONFIG.WEBSOCKET_URL);
  }

  public async initializeConnection(): Promise<void> {
    if (this.connectionInitialized) {
      console.log('WebSocket connection already initialized');
      return;
    }
    
    // Prevent multiple simultaneous initialization attempts
    if (this.isConnecting) {
      console.log('WebSocket connection already in progress');
      return;
    }
    
    this.connectionInitialized = true;
    this.isConnecting = true;
    console.log('Initializing WebSocket connection to:', AI_CONFIG.WEBSOCKET_URL);

    try {
      // Use AI_CONFIG directly
      this.websocketUrl = AI_CONFIG.WEBSOCKET_URL;
      
      // Set shouldConnect to true to ensure connection is established
      this.shouldConnect = true;
      console.log('Connecting to WebSocket...');
      this.connect();
    } catch (error) {
      const errorMsg = 'Error initializing WebSocket connection';
      console.error(errorMsg, error);
      this.emit('error', { 
        error: errorMsg,
        details: error instanceof Error ? error.message : String(error)
      });
      this.isConnecting = false;
      throw error;
    }
  }


  private setupEventHandlers(): void {
    if (!this.socket) {
      console.error('Cannot set up event handlers: WebSocket is not initialized');
      return;
    }

    this.socket.onopen = (event) => {
      console.log('WebSocket connection established successfully');
      this.connectionState = 'connected';
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      this.connectionLock = false;

      // Clear any pending reconnect timeout
      if (this.reconnectTimeout) {
        console.log('Clearing reconnect timeout');
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      // Start heartbeat
      console.log('Starting WebSocket heartbeat');
      this.startHeartbeat();

      // Process queued subscriptions
      console.log('Processing queued subscriptions after connection');
      this.queuedSubscriptions.forEach(channel => {
        this.subscribe(channel);
      });

      const socketUrl = this.socket ? this.socket.url : 'unknown';
      console.log('Emitting connected event');
      this.emit('connected', { 
        timestamp: new Date().toISOString(),
        url: socketUrl
      });
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString()
      });
      
      this.connectionState = 'disconnected';
      this.isConnecting = false;
      this.connectionLock = false;

      // Stop heartbeat
      console.log('Stopping WebSocket heartbeat');
      this.stopHeartbeat();

      // Reset connection state on disconnect
      this.subscribedChannels.clear();
      const disconnectEvent = {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        timestamp: new Date().toISOString(),
        url: this.socket?.url || 'unknown'
      };
      console.log('Emitting disconnected event:', disconnectEvent);
      this.emit('disconnected', disconnectEvent);

      // Attempt to reconnect unless it was a clean close
      if (event.code !== 1000 && this.shouldConnect) {
        console.log(`Attempting to reconnect (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
        this.handleReconnect();
      } else {
        console.log('Clean close detected or shouldConnect is false, not attempting to reconnect');
      }
    };

    this.socket.onerror = (error) => {
      const errorDetails = {
        message: 'WebSocket error',
        error: error,
        timestamp: new Date().toISOString(),
        readyState: this.socket?.readyState,
        url: this.socket?.url || 'unknown'
      };
      console.error('WebSocket error occurred:', errorDetails);
      
      // Reset connection state on error
      this.connectionState = 'disconnected';
      this.isConnecting = false;
      this.connectionLock = false;
      
      this.emit('error', errorDetails);
      
      // Attempt to reconnect on error if we should be connected
      if (this.shouldConnect) {
        console.log('WebSocket error, attempting to reconnect...');
        this.handleReconnect();
      }
    };

    this.socket.onmessage = (event) => {
      console.log('=== WEBSOCKET SERVICE: Raw message received ===', event.data);
      try {
        // Handle both string and already-parsed messages
        const message = typeof event.data === 'string' 
          ? JSON.parse(event.data) 
          : event.data;
        
        if (!message || typeof message !== 'object') {
          throw new Error('Invalid message format: expected an object');
        }
        
        // Handle specific message types directly (no double emission)
        this.handleMessage(message);
      } catch (error) {
        const errorMsg = `Error processing WebSocket message: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMsg, { rawData: event.data, error });
        this.emit('error', { 
          type: 'websocket_error',
          error: errorMsg,
          rawData: event.data,
          timestamp: new Date().toISOString()
        });
      }
    };
  }


  // AI Chat specific methods
  public sendChatMessage(message: string, conversationId?: string, context?: Record<string, any>): string {
    const messageId = `msg_${Date.now()}`;
    // Generate conversation ID if not provided
    const finalConversationId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const chatMessage: AIChatRequest = {
      type: 'chat_message',
      messageId,
      timestamp: new Date().toISOString(),
      data: {
        message,
        conversationId: finalConversationId,
        context: {
          ...context,
          ...AI_CONFIG.DEFAULT_CONTEXT,
        },
      },
    };
    
    this.sendMessage(chatMessage);
    return messageId;
  }

  // Subscribe to AI chat messages
  public onAIMessage(callback: (message: AIChatMessage) => void): () => void {
    const listener = (msg: WebSocketMessage) => {
      callback(msg as unknown as AIChatMessage);
    };
    this.on('ai_message', listener);
    return () => this.off('ai_message', listener);
  }

  private logError(message: string, error?: any): void {
    console.error(`[WebSocket Error] ${message}`, error || '');
    this.emit('error', { message, error });
  }

  private logInfo(message: string, data?: any): void {
    console.log(`[WebSocket Info] ${message}`, data || '');
  }

  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing heartbeat

    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        // Check token expiration before sending heartbeat
        this.checkTokenExpiration();
        
        // Send ping message that matches backend expectations
        this.sendMessage({
          type: 'ping',
          data: { status: 'ping' },
          timestamp: new Date().toISOString()
        });
        console.log('Sent heartbeat ping');
      } else {
        console.warn('Cannot send heartbeat - WebSocket not open');
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private checkTokenExpiration(): void {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No access token found during heartbeat');
        return;
      }

      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;
      
      // If token expires in less than 5 minutes, refresh it
      if (expirationTime - currentTime < 300) {
        console.log('Token expires soon, refreshing...');
        this.refreshTokenAndReconnect();
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sendMessage(message: WebSocketMessage): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, message not sent:', message);
      return;
    }
    
    try {
      const messageString = JSON.stringify(message);
      this.socket.send(messageString);
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      this.emit('error', { error: 'Failed to send WebSocket message', message });
    }
  }

  private async refreshTokenAndReconnect(): Promise<void> {
    try {
      console.log('Attempting to refresh token...');
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${AI_CONFIG.API_GATEWAY_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        console.log('Token refresh successful, updating tokens');
        if (typeof window !== 'undefined') {
          // Ensure cookie is set in addition to localStorage for middleware
          try {
            const { apiClient: unifiedApiClient } = await import('@/lib/api');
            unifiedApiClient.setAccessToken(data.data.access_token);
          } catch {
            // Fallback to localStorage if import fails
            localStorage.setItem('access_token', data.data.access_token);
          }
          localStorage.setItem('refresh_token', data.data.refresh_token);
        }

        // Reconnect with new token without full disconnect
        console.log('Reconnecting with new token...');
        this.reconnectWithNewToken();
      } else {
        throw new Error('Invalid refresh response format');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Token refresh failed - redirect to login
      if (typeof window !== 'undefined') {
        try {
          const { apiClient: unifiedApiClient } = await import('@/lib/api');
          unifiedApiClient.clearAuth();
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
        window.location.href = '/signin';
      }
    }
  }

  private reconnectWithNewToken(): void {
    // Close current connection and reconnect with new token
    if (this.socket) {
      this.socket.close(1000, 'Token refresh');
    }
    this.socket = null;
    this.connectionState = 'disconnected';
    this.connectionLock = false;
    this.isConnecting = false;
    
    // Reconnect after a short delay
    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logError('Max reconnection attempts reached');
      return;
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts), 30000); // Max 30s delay
    
    this.logInfo(`Scheduling reconnection attempt ${this.reconnectAttempts + 1} in ${delay}ms`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Update the connect method to use handleReconnect for consistency
  private connect(): void {
    console.log('Attempting to connect to WebSocket...');
    
    if (typeof window === 'undefined') {
      console.warn('WebSocket connection attempted in non-browser environment');
      return;
    }

    // Prevent multiple simultaneous connection attempts
    if (this.connectionLock || this.isConnecting) {
      console.log('Connection already in progress, skipping duplicate attempt');
      return;
    }

    this.connectionLock = true;
    this.isConnecting = true;
    
    // Always use the URL from AI_CONFIG to ensure it's up to date
    this.websocketUrl = AI_CONFIG.WEBSOCKET_URL;
    console.log('Using WebSocket URL:', this.websocketUrl);
    
    if (!this.websocketUrl) {
      const errorMsg = 'WebSocket URL not configured';
      console.error(errorMsg);
      this.emit('error', { error: errorMsg });
      this.connectionLock = false;
      this.isConnecting = false;
      return;
    }

    // Get fresh token on each connection attempt
    const token = localStorage.getItem('access_token');
    if (!token) {
      const errorMsg = 'No access token available for WebSocket connection';
      console.warn(errorMsg);
      this.emit('error', { error: errorMsg });
      this.connectionLock = false;
      this.isConnecting = false;
      this.handleReconnect();
      return;
    }

    try {
      this.connectionState = 'connecting';
      
      // Log the raw WebSocket URL for debugging
      console.log('Raw WebSocket URL from config:', this.websocketUrl);
      
      // Construct the WebSocket URL
      let finalUrl: string;
      
      if (this.websocketUrl.startsWith('ws://') || this.websocketUrl.startsWith('wss://')) {
        // If it's already a full WebSocket URL, use it as is
        finalUrl = this.websocketUrl;
      } else if (this.websocketUrl.startsWith('/')) {
        // If it's a path, prepend the current protocol and host
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        finalUrl = `${protocol}//${window.location.host}${this.websocketUrl}`;
      } else {
        // Otherwise, assume it's a relative path and prepend the current origin
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        finalUrl = `${protocol}//${window.location.host}/${this.websocketUrl.replace(/^\//, '')}`;
      }
      
      // Add token as query parameter if not already present
      const wsUrl = new URL(finalUrl);
      if (!wsUrl.searchParams.has('token')) {
        wsUrl.searchParams.set('token', token);
      }
      
      finalUrl = wsUrl.toString();
      console.log('Final WebSocket connection URL:', finalUrl);
      
      // Create WebSocket with the final URL
      console.log('Creating WebSocket connection...');
      this.socket = new WebSocket(finalUrl);
      
      // Set up event handlers
      this.setupEventHandlers();
      
      // Add detailed logging for debugging
      this.socket.onopen = (event) => {
        console.log('WebSocket connection established successfully', { url: finalUrl });
        this.connectionState = 'connected';
        this.emit('connected', { url: finalUrl });
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket connection error:', { 
          error, 
          url: finalUrl,
          readyState: this.socket?.readyState
        });
        this.emit('error', { 
          error: 'WebSocket error', 
          details: error,
          url: finalUrl
        });
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          url: finalUrl
        });
        this.connectionState = 'disconnected';
        this.emit('disconnected', { 
          event: {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          },
          url: finalUrl 
        });
        this.handleReconnect();
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.connectionState = 'disconnected';
      this.connectionLock = false;
      this.isConnecting = false;
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.connectionState === 'reconnecting') {
      console.log('Already attempting to reconnect, skipping duplicate attempt');
      return; // Already attempting to reconnect
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      // Max reconnection attempts reached
      console.error(`Max reconnection attempts reached (${this.reconnectAttempts})`);
      this.emit('max_reconnect_attempts', { attempts: this.reconnectAttempts });
      this.connectionState = 'disconnected';
      return;
    }

    if (!this.shouldConnect) {
      console.log('Should not connect, skipping reconnection');
      return;
    }

    console.log(`Starting reconnection attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`);
    this.connectionState = 'reconnecting';
    this.scheduleReconnect();
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
    this.connectionLock = false;
    this.isConnecting = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
      this.socket = null;
    }

    this.connectionState = 'disconnected';
    
    // Clear all event listeners
    this.eventListeners.clear();
    this.subscribedChannels.clear();
    this.queuedSubscriptions.clear();
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
  public on<T = any>(event: string, callback: (data: T) => void): void {
    try {
      if (!event) {
        console.warn('Attempted to add listener with empty event name');
        return;
      }
      
      if (typeof callback !== 'function') {
        console.error('Listener must be a function');
        return;
      }
      
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, new Set());
      }
      
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.add(callback);
        console.log(`Added listener for event '${event}'. Total listeners: ${listeners.size}`);
      }
    } catch (error) {
      console.error('Error adding event listener:', error);
    }
  }

  public off(event: string, callback?: (data: any) => void): void {
    try {
      if (!event) {
        console.warn('Attempted to remove listener with empty event name');
        return;
      }
      
      if (!callback) {
        // Remove all listeners for this event
        const count = this.eventListeners.get(event)?.size || 0;
        this.eventListeners.delete(event);
        console.log(`Removed all ${count} listeners for event '${event}'`);
      } else {
        // Remove specific callback
        const listeners = this.eventListeners.get(event);
        if (listeners) {
          const existed = listeners.delete(callback);
          console.log(`Removed ${existed ? '' : 'non-existent'} listener for event '${event}'. Remaining: ${listeners.size}`);
          
          // Clean up empty listener sets
          if (listeners.size === 0) {
            this.eventListeners.delete(event);
          }
        }
      }
    } catch (error) {
      console.error('Error removing event listener:', error);
    }
  }

  private emit(event: string, data: unknown): void {
    try {
      if (!event) {
        console.warn('Attempted to emit event with empty name');
        return;
      }
      
      const listeners = this.eventListeners.get(event);
      
      if (listeners && listeners.size > 0) {
        listeners.forEach(listener => {
          try {
            listener(data);
          } catch (error) {
            console.error(`Error in event listener for ${event}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Error emitting event:', error);
    }
  }

  private subscribedChannels = new Set<string>();

  public subscribe(channel: string): void {
    if (!channel) {
      console.warn('Attempted to subscribe to empty channel');
      return;
    }
    
    // Prevent duplicate subscriptions
    if (this.subscribedChannels.has(channel)) {
      return;
    }
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.subscribedChannels.add(channel);
      this.sendMessage({
        type: 'subscribe',
        data: { channel },
        timestamp: new Date().toISOString()
      } as WebSocketMessage);
      this.queuedSubscriptions.delete(channel);
    } else {
      this.queuedSubscriptions.add(channel);
      this.ensureConnection();
    }
  }

  public unsubscribe(channel: string): void {
    if (!channel) {
      console.warn('Attempted to unsubscribe from empty channel');
      return;
    }

    this.subscribedChannels.delete(channel);
    this.queuedSubscriptions.delete(channel);
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.sendMessage({
        type: 'unsubscribe',
        data: { channel },
        timestamp: new Date().toISOString()
      } as WebSocketMessage);
    }
  }

  // Send message
  public send(type: string, data: any, channel?: string): void {
    if (!this.isConnected()) {
      // WebSocket not connected, cannot send message
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
    const handleMessage = (message: WebSocketMessage) => {
      // Handle different message formats from backend
      const isSecurityEvent =
        (message.type === 'event' && message.channel === eventType) ||
        (message.type === 'event' && message.channel === `events:${eventType}`) ||
        (message.type === 'security_alert' && message.data?.type === eventType) ||
        (message.type === eventType);

      if (isSecurityEvent) {
        // Security event received
        callback(message);
      }
    };

    this.on('message', handleMessage);
    return () => this.off('message', handleMessage);
  }

  private handleMessage(message: any): void {
    // Handle different message types
    if (message && typeof message === 'object') {
      switch (message.type) {
        case 'ack':
          this.emit('acknowledgment', message);
          break;
          
        case 'error':
          this.emit('error', message.data || { error: 'Unknown error occurred' });
          break;
          
        case 'user_activity':
          this.emit('user_activity', message as unknown as UserActivityMessage);
          break;
          
        case 'user_status':
          this.emit('user_status', message as unknown as UserStatusMessage);
          break;
          
        case 'security_alert':
          this.emit('security_alert', message as unknown as SecurityAlertMessage);
          break;
          
        case 'system_notification':
          this.emit('system_notification', message);
          break;
          
        case 'reasoning_step':
          console.log('=== WEBSOCKET: Processing reasoning_step ===', message);
          this.emit('ai_message', {
            ...message,
            type: 'reasoning_step',
            conversation_id: message.conversation_id,
            message_id: message.message_id,
            metadata: message.metadata || JSON.parse(message.content || '{}'),
            data: message.metadata || JSON.parse(message.content || '{}')
          });
          break;
          
        case 'final_response':
          console.log('=== WEBSOCKET: Processing final_response ===', message);
          this.emit('ai_message', {
            ...message,
            type: 'final_response',
            conversation_id: message.conversation_id,
            message_id: message.message_id,
            content: message.content,
            data: { content: message.content, message: message.content }
          });
          break;
          
        case 'chunk':
          console.log('=== WEBSOCKET: Processing chunk ===', message);
          this.emit('ai_message', {
            ...message,
            type: 'chat_response',
            data: { content: message.content, message: message.content, response: message.content }
          });
          break;
          
        case 'chat_message':
        case 'chat_response':
        case 'ai_chat':
        case 'ai_stream':
        case 'ai_status':
          this.emit('ai_message', message);
          break;
          
        case 'notification':
          this.emit('notification', message);
          break;
          
        default:
          this.emit('*', message);
      }
    } else {
      this.emit('*', message);
    }
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
      // WebSocket error - silently handle
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