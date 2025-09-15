/**
 * Conversation Service
 * 
 * Handles conversation session management, loading conversation history,
 * and managing conversation metadata for AI Copilot frontend.
 * 
 * API Documentation: /conversations
 */

import { getAICopilotUrl, getAPIGatewayUrl } from '@/config/ai-config';
import { authInterceptor } from '@/lib/auth-interceptor';
import { useAuth } from '@/hooks/useAuth';

export interface ConversationSession {
  conversation_id: string;
  organization_id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  status: string;
  message_count: number;
  context: Record<string, any>;
  metadata: Record<string, any>;
  last_message_at?: string;
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
  private currentUserId: string;
  private currentOrgId: string;

  constructor(userId: string = '', orgId: string = '') {
    this.currentUserId = userId;
    this.currentOrgId = orgId;
    // Use API Gateway URL for all AI endpoints
    const baseUrl = getAPIGatewayUrl();
    
    // Set the base URL to use API Gateway's AI chat endpoint
    this.baseUrl = `${baseUrl}/api/v1/ai/chat`;
    
    // Log the final URL for debugging
    console.log('ConversationService base URL:', this.baseUrl);
  }

  /**
   * Create a new conversation session
   */
  async createConversation(request: CreateConversationRequest = {}): Promise<ConversationSession> {
    try {
      // Use the conversations endpoint through API Gateway
      const url = new URL(`${this.baseUrl}/conversations`);
      
      // Use proper user identification - these should come from auth context
      const userId = this.currentUserId || 'default_user';
      const orgId = this.currentOrgId || 'default_org';
      
      // Add query parameters as the backend might expect them
      url.searchParams.append('user_id', userId);
      url.searchParams.append('organization_id', orgId);
      
      // Create a timestamp for consistent use
      const now = new Date().toISOString();
      
      // Simplified request structure
      const requestBody = {
        title: request.title || `Chat - ${new Date().toLocaleDateString()}`,
        context: request.context || {},
        metadata: request.metadata || {
          created_by: 'frontend',
          source: 'ai_chat',
          version: '1.0.0',
          created_at: now,
          status: 'active',
          user_id: userId,
          organization_id: orgId
        }
      };
      
      console.log('Creating conversation with URL:', url.toString());
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await authInterceptor.interceptRequest(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create conversation error:', response.status, errorText);
        console.error('Request that failed:', {
          url: url.toString(),
          method: 'POST',
          body: requestBody
        });
        throw new Error(`Failed to create conversation: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Conversation created successfully:', result);
      
      // Ensure the response has all required fields
      const defaultUserId = this.currentUserId || 'default_user';
      const defaultOrgId = this.currentOrgId || 'default_org';
      const timestamp = new Date().toISOString();
      
      // Create a complete conversation object with all required fields
      const conversation: ConversationSession = {
        conversation_id: result.conversation_id || result.id,
        organization_id: result.organization_id || defaultOrgId,
        user_id: result.user_id || defaultUserId,
        title: request.title || `Chat - ${new Date().toLocaleDateString()}`,
        status: result.status || 'active',
        created_at: result.created_at || timestamp,
        updated_at: result.updated_at || timestamp,
        message_count: result.message_count || 0,
        context: request.context || {},
        metadata: result.metadata || {
          created_by: 'frontend',
          source: 'ai_chat',
          version: '1.0.0',
          created_at: timestamp,
          user_id: defaultUserId,
          organization_id: defaultOrgId,
          status: 'active'
        },
        last_message_at: result.last_message_at || timestamp
      };
      
      return conversation;
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
      
      const response = await authInterceptor.interceptRequest(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Failed to get conversation messages: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Ensure the response has all required fields
      const defaultUserId = this.currentUserId || 'default_user';
      const defaultOrgId = this.currentOrgId || 'default_org';
      const timestamp = new Date().toISOString();
      
      // Process messages if present
      if (result.messages) {
        result.messages = result.messages.map((msg: any) => {
          return {
            ...msg,
            metadata: msg.metadata || {
              created_by: 'frontend',
              source: 'ai_chat',
              version: '1.0.0',
              created_at: timestamp,
              user_id: defaultUserId,
              organization_id: defaultOrgId
            }
          };
        });
      }
      
      // Return paginated response with messages
      return {
        items: result.messages || [],
        total: result.total || result.messages?.length || 0,
        page: result.page || 1,
        limit: result.limit || 50
      };
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

      const response = await authInterceptor.interceptRequest(url.toString(), {
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

      const result = await response.json();
      
      // Handle both API response formats
      const conversations = result.conversations || result.items || [];
      const total = result.total || conversations.length;
      const pageNum = result.page || 1;
      const limitNum = result.size || result.limit || 20;
      
      // Ensure each conversation has all required fields
      const processedConversations = conversations.map((conv: any) => {
        const userId = this.currentUserId || 'default_user';
        const orgId = this.currentOrgId || 'default_org';
        const now = new Date().toISOString();
        
        return {
          conversation_id: conv.conversation_id || conv.id,
          organization_id: conv.organization_id || orgId,
          user_id: conv.user_id || userId,
          title: conv.title || `Chat - ${new Date().toLocaleDateString()}`,
          status: conv.status || 'active',
          created_at: conv.created_at || now,
          updated_at: conv.updated_at || now,
          message_count: conv.message_count || 0,
          context: conv.context || {},
          metadata: conv.metadata || {
            created_by: 'frontend',
            source: 'ai_chat',
            version: '1.0.0',
            created_at: now,
            user_id: userId,
            organization_id: orgId,
            status: 'active'
          },
          last_message_at: conv.last_message_at || now
        };
      });
      
      return {
        items: processedConversations,
        total: total,
        page: pageNum,
        limit: limitNum
      };
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
      
      const response = await authInterceptor.interceptRequest(url.toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update conversation: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Ensure the response has all required fields
      const userId = this.currentUserId || 'default_user';
      const orgId = this.currentOrgId || 'default_org';
      const now = new Date().toISOString();
      
      // Create a complete conversation object with all required fields
      const conversation: ConversationSession = {
        conversation_id: result.conversation_id || result.id,
        organization_id: result.organization_id || orgId,
        user_id: result.user_id || userId,
        title: result.title || `Chat - ${new Date().toLocaleDateString()}`,
        status: result.status || 'active',
        created_at: result.created_at || now,
        updated_at: result.updated_at || now,
        message_count: result.message_count || 0,
        context: result.context || {},
        metadata: result.metadata || {
          created_by: 'frontend',
          source: 'ai_chat',
          version: '1.0.0',
          created_at: now,
          user_id: userId,
          organization_id: orgId,
          status: 'active'
        },
        last_message_at: result.last_message_at || now
      };
      
      return conversation;
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
      
      const response = await authInterceptor.interceptRequest(url.toString(), {
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
      
      const response = await authInterceptor.interceptRequest(url.toString(), {
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
   * @param page Page number (1-based)
   * @param limit Maximum number of results (1-50)
   */
  async searchConversations(
    query?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ConversationSession>> {
    try {
      const url = new URL(`${this.baseUrl}/conversations`);
      
      // Add query parameters
      url.searchParams.append('user_id', this.currentUserId || 'current_user');
      url.searchParams.append('organization_id', this.currentOrgId || 'default_org');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      
      if (query) {
        url.searchParams.append('query', query);
      }
      
      const response = await authInterceptor.interceptRequest(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Get conversations error:', response.status, errorText);
        throw new Error(`Failed to list conversations: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Ensure each conversation has all required fields
      const defaultUserId = this.currentUserId || 'default_user';
      const defaultOrgId = this.currentOrgId || 'default_org';
      const timestamp = new Date().toISOString();
      
      const conversations = (result.conversations || []).map((conv: any) => {
        return {
          conversation_id: conv.conversation_id || conv.id,
          organization_id: conv.organization_id || defaultOrgId,
          user_id: conv.user_id || defaultUserId,
          title: conv.title || `Chat - ${new Date(conv.created_at || timestamp).toLocaleDateString()}`,
          status: conv.status || 'active',
          created_at: conv.created_at || timestamp,
          updated_at: conv.updated_at || timestamp,
          message_count: conv.message_count || 0,
          context: conv.context || {},
          metadata: conv.metadata || {
            created_by: 'frontend',
            source: 'ai_chat',
            version: '1.0.0',
            created_at: timestamp,
            user_id: defaultUserId,
            organization_id: defaultOrgId,
            status: 'active'
          },
          last_message_at: conv.last_message_at || timestamp
        };
      });
      
      // Transform the response to match PaginatedResponse type
      const responseData: PaginatedResponse<ConversationSession> = {
        items: conversations,
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
      
      const response = await authInterceptor.interceptRequest(url.toString(), {
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

      const response = await authInterceptor.interceptRequest(
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
