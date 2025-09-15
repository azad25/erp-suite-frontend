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
  metadata?: Record<string, any>;
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
  metadata?: Record<string, any>;
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
  private initializationPromise: Promise<void> | null = null;
  private static instance: WebSocketService | null = null;

  constructor() {
    // Initialize with empty URL, will be set in initializeConnection()
    this.websocketUrl = '';
    
    // Don't auto-initialize - only connect when explicitly requested
    // This prevents unnecessary connection attempts and console warnings
    console.log('WebSocketService initialized. Will connect to:', AI_CONFIG.WEBSOCKET_URL);
  }

  // Static method to get singleton instance
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public async initializeConnection(): Promise<void> {
    // Return existing initialization promise if already in progress
    if (this.initializationPromise) {
      console.log('Connection initialization already in progress, returning existing promise');
      return this.initializationPromise;
    }

    // If already connected, return immediately
    if (this.connectionState === 'connected' && this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected, skipping initialization');
      return Promise.resolve();
    }

    // Create and store the initialization promise
    this.initializationPromise = this._performInitialization();
    
    try {
      await this.initializationPromise;
    } finally {
      // Clear the promise when done (success or failure)
      this.initializationPromise = null;
    }
  }

  private async _performInitialization(): Promise<void> {
    console.log('=== PERFORMING WEBSOCKET INITIALIZATION ===');
    console.log('Connection state:', {
      connectionInitialized: this.connectionInitialized,
      isConnecting: this.isConnecting,
      connectionLock: this.connectionLock,
      shouldConnect: this.shouldConnect,
      connectionState: this.connectionState
    });
    
    // Reset connection state if stuck
    if (this.connectionState === 'connecting' && !this.socket) {
      console.log('Resetting stuck connection state');
      this.connectionLock = false;
      this.isConnecting = false;
    }
    
    // Use AI_CONFIG directly
    this.websocketUrl = AI_CONFIG.WEBSOCKET_URL;
    
    // Set shouldConnect to true to ensure connection is established
    this.shouldConnect = true;
    console.log('Connecting to WebSocket...');
    this.connect();
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
    const now = new Date().toISOString();
    
    // Ensure we have user_id and organization_id
    const userId = context?.user_id || 'current_user';
    const orgId = context?.organization_id || 'default_org';
    
    // Format message according to AI Copilot backend expectations
    const chatMessage = {
      type: 'chat_message',
      message: message, // This is the required field the backend expects
      messageId,
      conversationId: finalConversationId,
      timestamp: now,
      metadata: {
        created_by: 'frontend',
        source: 'ai_chat',
        version: '1.0.0',
        created_at: now,
        user_id: userId,
        organization_id: orgId,
        status: 'active'
      },
      context: {
        ...context,
        ...AI_CONFIG.DEFAULT_CONTEXT,
        user_id: userId,
        organization_id: orgId
      }
    };
    
    // Send directly to WebSocket without wrapping in WebSocketMessage format
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('=== SENDING CHAT MESSAGE ===', chatMessage);
      this.socket.send(JSON.stringify(chatMessage));
    }
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

  // Main method for connecting to websocket for ai copilot and chatbot
  private connect(): void {
    console.log('=== ATTEMPTING TO CONNECT TO WEBSOCKET ===');
    console.log('Current connection state:', {
      connectionLock: this.connectionLock,
      isConnecting: this.isConnecting,
      shouldConnect: this.shouldConnect,
      connectionState: this.connectionState,
      socketExists: !!this.socket,
      socketReadyState: this.socket?.readyState
    });
    
    if (typeof window === 'undefined') {
      console.warn('WebSocket connection attempted in non-browser environment');
      return;
    }

    // If already connected, don't reconnect
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected, skipping');
      return;
    }

    // If socket exists but is not open, close it first
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      console.log('Closing existing WebSocket before reconnecting');
      this.socket.close();
      this.socket = null;
    }

    if (!this.shouldConnect) {
      console.log('Should not connect, aborting');
      return;
    }

    this.connectionLock = true;
    this.connectionState = 'connecting';
    this.isConnecting = true;
    
    // Always use the URL from AI_CONFIG to ensure it's up to date
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
    console.log('Token check:', token ? 'Token found' : 'No token found');
    if (!token) {
      const errorMsg = 'No access token available for WebSocket connection';
      console.error(errorMsg);
      this.emit('error', { error: errorMsg });
      this.connectionLock = false;
      this.isConnecting = false;
      this.connectionState = 'disconnected';
      // Don't retry if no token - this will cause infinite loops
      return;
    }

    try {
      this.connectionState = 'connecting';
      
      // Log the raw WebSocket URL for debugging
      console.log('Raw WebSocket URL from config:', this.websocketUrl);
      
      // Construct the WebSocket URL
      let websocketUrl: string = this.websocketUrl;
      
      // Add token as query parameter if not already present
      const wsUrl = new URL(websocketUrl);
      if (!wsUrl.searchParams.has('token')) {
        wsUrl.searchParams.set('token', token);
      }
      
      websocketUrl = wsUrl.toString();
      console.log('🚀 CREATING WEBSOCKET CONNECTION:', websocketUrl);
      
      // Create WebSocket with the final URL
      this.socket = new WebSocket(websocketUrl);
      console.log('✅ WebSocket object created, readyState:', this.socket.readyState);
      
      // Set up event handlers BEFORE creating the socket
      this.socket.onopen = (event) => {
        console.log('✅ WebSocket connection established successfully', { url: websocketUrl });
        this.connectionState = 'connected';
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.connectionLock = false;
        
        // Clear any pending reconnect timeout
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
        
        // Start heartbeat
        this.startHeartbeat();
        
        // Process queued subscriptions
        this.queuedSubscriptions.forEach(channel => {
          this.subscribe(channel);
        });
        
        this.emit('connected', { 
          timestamp: new Date().toISOString(),
          url: websocketUrl
        });
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connectionState = 'disconnected';
        this.isConnecting = false;
        this.connectionLock = false;
        
        // Filter out non-critical errors to prevent unnecessary disconnections
        const errorMessage = (error as any)?.message || (error as any)?.type || 'WebSocket connection failed';
        if (!errorMessage.includes('heartbeat') && 
            !errorMessage.includes('ping') && 
            !errorMessage.includes('Failed to process message') &&
            !errorMessage.includes('PingHandler')) {
          console.warn('WebSocket error (filtered, non-critical):', errorMessage);
          // Don't emit error to prevent connection breaks - just log it
        }
        
        // Only attempt to reconnect on actual connection errors, not processing errors
        if (this.shouldConnect && errorMessage.includes('connection')) {
          this.handleReconnect();
        }
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          url: websocketUrl
        });
        
        this.connectionState = 'disconnected';
        this.isConnecting = false;
        this.connectionLock = false;
        
        // Stop heartbeat
        this.stopHeartbeat();
        
        // Reset connection state on disconnect
        this.subscribedChannels.clear();
        
        this.emit('disconnected', { 
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString(),
          url: websocketUrl
        });
        
        // Attempt to reconnect unless it was a clean close
        if (event.code !== 1000 && this.shouldConnect) {
          this.handleReconnect();
        }
      };
      
      this.socket.onmessage = (event) => {
        console.log('=== WEBSOCKET SERVICE: Raw message received ===', event.data);
        try {
          const message = typeof event.data === 'string' 
            ? JSON.parse(event.data) 
            : event.data;
          
          if (!message || typeof message !== 'object') {
            throw new Error('Invalid message format: expected an object');
          }
          
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

    // For chat messages, use the correct format expected by AI Copilot backend
    if (type === 'chat_message' && data.content) {
      this.sendChatMessage(data.content, data.conversationId, data.context);
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
          // Filter out backend heartbeat/ping errors that aren't user-relevant
          if (message.message && (message.message.includes('PingHandler') || message.message.includes('heartbeat'))) {
            console.warn('Backend heartbeat error (filtered):', message.message);
            return;
          }
          // Filter out processing errors that don't require disconnection
          if (message.message && message.message.includes('Failed to process message')) {
            console.warn('Message processing error (non-critical):', message.message);
            return;
          }
          // Only emit meaningful errors, not generic ones that would break the connection
          if (message.data && message.data.error && message.data.error !== 'Unknown error occurred') {
            console.warn('WebSocket error (non-critical):', message.data.error);
            // Don't emit error to prevent connection breaks - just log it
            return;
          }
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
          // Backend sends step data at root level - pass it through directly
          const reasoningMessage = {
            type: 'reasoning_step',
            data: {
              messageId: message.message_id,
              conversationId: message.conversation_id
            },
            // Pass reasoning step data at root level (as per backend structure)
            step_number: message.step_number,
            step_type: message.step_type,
            title: message.title,
            description: message.description,
            icon: message.icon,
            status: message.status,
            source: message.source,
            timestamp: message.timestamp,
            processing_time: message.processing_time
          };
          this.emit('message', reasoningMessage);
          break;
          
        case 'final_response':
          console.log('=== WEBSOCKET: Processing final_response ===', message);
          this.emit('message', {
            type: 'final_response',
            data: {
              content: message.content,
              messageId: message.message_id,
              conversationId: message.conversation_id
            }
          });
          break;
          
        case 'chunk':
          console.log('=== WEBSOCKET: Processing chunk ===', message);
          // Handle streaming chunks - accumulate content instead of emitting individual characters
          if (message.content && message.content.length > 0) {
            this.emit('message', {
              type: 'chunk',
              data: {
                content: message.content,
                messageId: message.message_id,
                conversationId: message.conversation_id,
                isChunk: true,
                isFinal: message.is_complete || false,
                is_complete: message.is_complete || false
              }
            });
          }
          break;
          
        case 'reasoning_complete':
          console.log('=== WEBSOCKET: Processing reasoning_complete ===', message);
          this.emit('message', {
            type: 'reasoning_complete',
            data: {
              messageId: message.message_id,
              conversationId: message.conversation_id
            },
            timestamp: message.timestamp
          });
          break;
          
        case 'chat_message':
        case 'chat_response':
        case 'ai_chat':
        case 'ai_stream':
        case 'ai_status':
        case 'ai_message':
          console.log('=== WEBSOCKET: Processing AI message ===', message);
          // Only emit if we have actual content to avoid empty messages
          const content = message.content || message.data?.content;
          if (content && content.trim().length > 0) {
            this.emit('message', {
              type: 'ai_message',
              data: {
                content: content,
                messageId: message.message_id || message.messageId,
                conversationId: message.conversation_id || message.conversationId
              }
            });
          }
          break;
          
        case 'notification':
          this.emit('notification', message);
          break;
          
        default:
          console.log('=== WEBSOCKET: Processing unknown message type ===', message.type, message);
          // Emit as generic message for components to handle
          this.emit('message', message);
          this.emit('*', message);
      }
    } else {
      this.emit('*', message);
    }
  }

  // Get connection state for debugging
  public getConnectionState(): WebSocketState {
    return this.connectionState;
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
export const websocketService = WebSocketService.getInstance();

// React hook for WebSocket integration with StrictMode protection
export function useWebSocket() {
  const [connected, setConnected] = React.useState(websocketService.isConnected());
  const [status, setStatus] = React.useState(websocketService.getStatus());
  const initializationRef = React.useRef(false);

  React.useEffect(() => {
    // Prevent duplicate initialization in React StrictMode
    if (initializationRef.current) {
      console.log('useWebSocket: Already initialized, skipping duplicate effect');
      return;
    }
    initializationRef.current = true;

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
      // Reset initialization flag on cleanup
      initializationRef.current = false;
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
    initializeConnection: websocketService.initializeConnection.bind(websocketService),
    getConnectionState: websocketService.getConnectionState.bind(websocketService),
  };
}