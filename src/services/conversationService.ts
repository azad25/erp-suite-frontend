/**
 * Conversation Service
 * 
 * Handles conversation session management, loading conversation history,
 * and managing conversation metadata for AI Copilot frontend.
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

class ConversationService {
  private baseUrl: string;
  private currentUserId: string = 'current_user'; // TODO: Get from auth context
  private currentOrgId: string = 'default_org'; // TODO: Get from auth context

  constructor() {
    // Ensure the base URL ends with /api/v1
    let base = getAICopilotUrl();
    if (!base.endsWith('/api/v1')) {
      base = base.endsWith('/') ? `${base}api/v1` : `${base}/api/v1`;
    }
    this.baseUrl = base;
  }

  /**
   * Create a new conversation session
   */
  async createConversation(request: CreateConversationRequest = {}): Promise<ConversationSession> {
    try {
      // Add user_id and organization_id as query parameters
      const url = new URL(`${this.baseUrl}/api/v1/conversations`);
      url.searchParams.append('user_id', this.currentUserId);
      url.searchParams.append('organization_id', this.currentOrgId);
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Load conversation history by session ID
   */
  async loadConversation(conversationId: string): Promise<LoadConversationResponse> {
    try {
      const url = new URL(`${this.baseUrl}/api/v1/conversations/${conversationId}`);
      url.searchParams.append('include_messages', 'true');
      url.searchParams.append('user_id', this.currentUserId);
      url.searchParams.append('organization_id', this.currentOrgId);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load conversation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading conversation:', error);
      throw error;
    }
  }

  /**
   * Get user's conversation sessions
   */
  async getUserConversations(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<{ conversations: ConversationSession[]; total: number; page: number; limit: number }> {
    try {
      const params = new URLSearchParams({
        user_id: this.currentUserId,
        organization_id: this.currentOrgId,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        params.append('status', status);
      }

      const response = await fetch(
        `${this.baseUrl}/conversations?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get conversations: ${response.statusText}`);
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
    updates: Partial<Pick<ConversationSession, 'title' | 'context' | 'metadata'>>
  ): Promise<ConversationSession> {
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
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
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/archive`, {
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
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  /**
   * Search conversations
   */
  async searchConversations(
    query: string,
    limit: number = 10
  ): Promise<ConversationSession[]> {
    try {
      const params = new URLSearchParams({
        user_id: this.currentUserId,
        organization_id: this.currentOrgId,
        query,
        limit: limit.toString(),
      });

      const response = await fetch(
        `${this.baseUrl}/conversations/search?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to search conversations: ${response.statusText}`);
      }

      const result = await response.json();
      return result.conversations || [];
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }

  /**
   * Convert conversation message to chat message format
   */
  convertTochatMessage(message: ConversationMessage): {
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
   * Get conversation analytics
   */
  async getConversationAnalytics(
    conversationId?: string
  ): Promise<Record<string, any>> {
    try {
      const params = new URLSearchParams({
        user_id: this.currentUserId,
        organization_id: this.currentOrgId,
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
        throw new Error(`Failed to get analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting conversation analytics:', error);
      return {};
    }
  }
}

export const conversationService = new ConversationService();
