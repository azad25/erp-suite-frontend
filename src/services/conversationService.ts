/**
 * Conversation Service
 * 
 * Handles conversation session management, loading conversation history,
 * and managing conversation metadata for AI Copilot frontend.
 * 
 * API Documentation: /conversations
 */

import { getAICopilotUrl } from '@/config/ai-config';

export interface ConversationSession {
  conversation_id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  context: Record<string, any>;
  metadata: Record<string, any>;
}

export interface ConversationMessage {
  message_id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, any>;
  created_at: string;
  reasoning_steps?: ReasoningStep[];
}

export interface ReasoningStep {
  step_number: number;
  step_type: string;
  title: string;
  description: string;
  source: string;
  status: 'processing' | 'completed' | 'failed';
  icon: string;
  timestamp: string;
  processing_time: number;
}

export interface CreateConversationRequest {
  title?: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface LoadConversationResponse {
  conversation: ConversationSession;
  messages: ConversationMessage[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ConversationAnalytics {
  total_conversations: number;
  active_conversations: number;
  messages_per_conversation: number;
  avg_response_time: number;
  last_updated: string;
  // Add more analytics fields as needed
}

class ConversationService {
  private baseUrl: string;
  private currentUserId: string = 'current_user'; // TODO: Get from auth context
  private currentOrgId: string = 'default_org'; // TODO: Get from auth context

  constructor() {
    // Ensure the base URL points to the AI copilot service
    let base = getAICopilotUrl();
    
    // Check if we're in development and need to adjust the URL
    if (base.includes('localhost:3000')) {
      // If frontend is on 3000, AI copilot is likely on 8000
      base = base.replace('localhost:3000', 'localhost:8000');
    }
    
    // Ensure we have the correct API path
    if (!base.includes('/api/v1')) {
      base = base.endsWith('/') ? `${base}api/v1` : `${base}/api/v1`;
    }
    
    // The base URL should already include /ai-copilot from the config
    // Remove any duplicate path additions
    this.baseUrl = base;
    
    // Log the final URL for debugging
    console.log('ConversationService base URL:', this.baseUrl);
  }

  /**
   * Create a new conversation session
   */
  async createConversation(request: CreateConversationRequest = {}): Promise<ConversationSession> {
    try {
      const url = new URL(`${this.baseUrl}/conversations`);
      
      // Use proper user identification - these should come from auth context
      const userId = this.currentUserId || 'default_user';
      const orgId = this.currentOrgId || 'default_org';
      
      url.searchParams.append('user_id', userId);
      url.searchParams.append('organization_id', orgId);
      
      console.log('Creating conversation with URL:', url.toString());
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: request.title,
          context: request.context || {},
          metadata: request.metadata || {}
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create conversation error:', response.status, errorText);
        throw new Error(`Failed to create conversation: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Get messages for a specific conversation
   */
  /**
   * Get messages for a specific conversation
   * @param conversationId The ID of the conversation
   * @param page Page number (1-based)
   * @param limit Number of messages per page (1-200)
   */
  async getConversationMessages(
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<PaginatedResponse<ConversationMessage>> {
    try {
      const url = new URL(`${this.baseUrl}/conversations/${conversationId}/messages`);
      url.searchParams.append('user_id', this.currentUserId);
      url.searchParams.append('organization_id', this.currentOrgId);
      url.searchParams.append('page', Math.max(1, page).toString());
      url.searchParams.append('limit', Math.min(200, Math.max(1, limit)).toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to get conversation messages: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw error;
    }
  }

  /**
   * Get user's conversation sessions with pagination
   */
  /**
   * Get user's conversation sessions with pagination
   * @param page Page number (1-based)
   * @param limit Items per page (1-100)
   * @param status Optional status filter
   */
  async getUserConversations(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<PaginatedResponse<ConversationSession>> {
    try {
      const url = new URL(`${this.baseUrl}/conversations`);
      
      // Use proper user identification
      const userId = this.currentUserId || 'default_user';
      const orgId = this.currentOrgId || 'default_org';
      
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('user_id', userId);
      url.searchParams.append('organization_id', orgId);
      
      if (status) {
        url.searchParams.append('status', status);
      }

      console.log('Getting user conversations with URL:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get conversations error:', response.status, errorText);
        throw new Error(`Failed to get conversations: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw error;
    }
  }

  /**
   * Update conversation metadata
   */
  async updateConversation(
    conversationId: string,
    updates: Partial<ConversationSession>
  ): Promise<ConversationSession> {
    try {
      const url = new URL(`${this.baseUrl}/conversations/${conversationId}`);
      url.searchParams.append('user_id', this.currentUserId);
      url.searchParams.append('organization_id', this.currentOrgId);
      
      const response = await fetch(url.toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update conversation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(conversationId: string): Promise<boolean> {
    try {
      const url = new URL(`${this.baseUrl}/conversations/${conversationId}/archive`);
      url.searchParams.append('user_id', this.currentUserId);
      url.searchParams.append('organization_id', this.currentOrgId);
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error archiving conversation:', error);
      return false;
    }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const url = new URL(`${this.baseUrl}/conversations/${conversationId}`);
      url.searchParams.append('user_id', this.currentUserId);
      url.searchParams.append('organization_id', this.currentOrgId);
      
      const response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete conversation: ${response.statusText}`);
      }
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  /**
   * Search user's conversations
   * @param query Search query string
   * @param limit Maximum number of results (1-50)
   */
  async searchConversations(
    query: string,
    limit: number = 10
  ): Promise<PaginatedResponse<ConversationSession>> {
    try {
      const url = new URL(`${this.baseUrl}/conversations/search`);
      url.searchParams.append('query', query);
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('user_id', this.currentUserId);
      url.searchParams.append('organization_id', this.currentOrgId);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to search conversations: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Transform the response to match PaginatedResponse type
      const responseData: PaginatedResponse<ConversationSession> = {
        items: result.conversations || [],
        total: result.total || 0,
        page: result.page || 1,
        limit: result.limit || limit
      };
      
      return responseData;
    } catch (error) {
      console.error('Error searching conversations:', error);
      // Return empty paginated response on error
      const emptyResponse: PaginatedResponse<ConversationSession> = {
        items: [],
        total: 0,
        page: 1,
        limit: limit
      };
      return emptyResponse;
    }
  }

  /**
   * Convert conversation message to chat message format
   */
  convertToChatMessage(message: ConversationMessage): {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    reasoningSteps?: ReasoningStep[];
    reasoningComplete?: boolean;
  } {
    return {
      id: message.message_id,
      text: message.content,
      sender: message.role === 'user' ? 'user' : 'bot',
      timestamp: new Date(message.created_at),
      reasoningSteps: message.reasoning_steps,
      reasoningComplete: message.reasoning_steps ? true : undefined,
    };
  }

  /**
   * Load a specific conversation by ID
   * @param conversationId The ID of the conversation to load
   */
  async loadConversation(conversationId: string): Promise<LoadConversationResponse | null> {
    try {
      const url = new URL(`${this.baseUrl}/conversations/${conversationId}`);
      url.searchParams.append('user_id', this.currentUserId);
      url.searchParams.append('organization_id', this.currentOrgId);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Conversation not found
        }
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to load conversation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading conversation:', error);
      throw error; // Re-throw to allow component to handle the error
    }
  }

  /**
   * Get conversation analytics
   * @param conversationId Optional specific conversation ID
   * @param days Number of days to include in analytics (1-365)
   */
  async getConversationAnalytics(
    conversationId?: string,
    days: number = 30
  ): Promise<ConversationAnalytics> {
    try {
      const params = new URLSearchParams({
        user_id: this.currentUserId,
        organization_id: this.currentOrgId,
        days: Math.min(365, Math.max(1, days)).toString()
      });

      if (conversationId) {
        params.append('conversation_id', conversationId);
      }

      const response = await fetch(
        `${this.baseUrl}/conversations/analytics?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to get analytics: ${response.statusText}`);
      }

      const data = await response.json();
      // Ensure all required fields are present with default values
      return {
        total_conversations: data.total_conversations || 0,
        active_conversations: data.active_conversations || 0,
        messages_per_conversation: data.messages_per_conversation || 0,
        avg_response_time: data.avg_response_time || 0,
        last_updated: data.last_updated || new Date().toISOString(),
        ...data // Spread any additional fields
      };
    } catch (error) {
      console.error('Error getting conversation analytics:', error);
      // Return default analytics object on error
      return {
        total_conversations: 0,
        active_conversations: 0,
        messages_per_conversation: 0,
        avg_response_time: 0,
        last_updated: new Date().toISOString()
      };
    }
  }
}

export const conversationService = new ConversationService();
