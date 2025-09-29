'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { websocketService } from '@/services/websocket';
import { conversationService } from '@/services/conversationService';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import {
  ChatbotIcon,
  SendIcon,
  UserIcon,
  CheckCircleIcon,
  TimeIcon,
  PlusIcon,
  CloseIcon
} from "@/icons";

// Types
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  messageId?: string;
  reasoningSteps?: ReasoningStep[];
  reasoningPhase?: 'thinking' | 'reasoning' | 'complete' | 'hidden' | 'streaming';
  showReasoningSteps?: boolean;
  isStreaming?: boolean;
  streamBuffer?: string;
}

interface ReasoningStep {
  step_number: number;
  step_type: string;
  title: string;
  description: string;
  source: string;
  status: 'processing' | 'completed' | 'error';
  icon: string;
  timestamp: string;
  processing_time: number;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive: boolean;
}

interface AIChatMessage {
  type: 'chat_message' | 'ai_stream' | 'ai_status' | 'reasoning_step' | 'reasoning_complete' | 'ai_message' | 'final_response' | 'chunk';
  data: {
    content?: string;
    messageId?: string;
    conversationId?: string;
    reasoning_step?: ReasoningStep;
    isChunk?: boolean;
    isFinal?: boolean;
    is_complete?: boolean;
  };
  messageId?: string;
  // Reasoning step properties at root level (as per backend structure)
  step_number?: number;
  step_type?: string;
  title?: string;
  description?: string;
  icon?: string;
  status?: 'processing' | 'completed' | 'error';
  source?: string;
  timestamp?: string;
  processing_time?: number;
}

// Utility function to generate unique IDs
const genId = (prefix: string = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Extend Window interface for timeout
declare global {
  interface Window {
    streamUpdateTimeout?: NodeJS.Timeout;
  }
}

// ChatGPT/Grok style thinking animation with sequential fade in/out
const ThinkingAnimation: React.FC<{ steps: ReasoningStep[] }> = ({ steps }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (steps.length === 0) return;
    if (steps.length === 1) return; // No need to cycle if only one step

    const cycleSteps = () => {
      // Fade out current step
      setIsVisible(false);

      setTimeout(() => {
        // Change to next step
        setCurrentStep(prev => (prev + 1) % steps.length);
        // Fade in new step
        setIsVisible(true);
      }, 300); // Wait for fade out to complete
    };

    const interval = setInterval(cycleSteps, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  if (steps.length === 0) {
    return (
      <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 animate-in fade-in duration-300">
        <div className="flex-shrink-0 mt-1">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Thinking...
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Processing...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 animate-in fade-in duration-300">
      <div className="flex-shrink-0 mt-1">
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Thinking...
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 min-h-[20px] flex items-center">
          <span
            className={`transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {steps[currentStep]?.title || 'Processing...'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ReasoningStepsDisplay Component - now just for thinking animation
const ReasoningStepsDisplay: React.FC<{ steps: ReasoningStep[]; phase?: string }> = ({ steps, phase }) => {
  if (!steps || steps.length === 0 || phase !== 'thinking') return null;
  return <ThinkingAnimation steps={steps} />;
};

// Main Chat Page Component
const AIChatPage: React.FC = () => {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());
  const [activeReasoningMessageId, setActiveReasoningMessageId] = useState<string | null>(null);
  const [currentReasoningSteps, setCurrentReasoningSteps] = useState<Map<string, ReasoningStep[]>>(new Map());

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [hasStartedStreaming, setHasStartedStreaming] = useState<boolean>(false);
  const [currentReasoningStep, setCurrentReasoningStep] = useState<{
    title: string;
    icon: string;
    stepNumber: number;
    description: string;
  } | null>(null);

  // Timeout for stuck thinking states
  const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInitializedRef = useRef(false);

  // Load conversations from AI copilot service
  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const response = await conversationService.getUserConversations(1, 20);

      const formattedConversations: Conversation[] = response.items.map(conv => ({
        id: conv.conversation_id,
        title: conv.title,
        lastMessage: `${conv.message_count} messages`,
        timestamp: new Date(conv.updated_at || conv.created_at),
        isActive: conv.conversation_id === activeConversationId
      }));

      setConversations(formattedConversations);

      // If no active conversation and we have conversations, select the first one
      if (!activeConversationId && formattedConversations.length > 0) {
        setActiveConversationId(formattedConversations[0].id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      // Set mock conversations as fallback
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          title: 'ERP Architecture Discussion',
          lastMessage: 'Can you explain the microservices?',
          timestamp: new Date(Date.now() - 3600000),
          isActive: false
        },
        {
          id: 'conv-2',
          title: 'Database Schema Help',
          lastMessage: 'How to optimize queries?',
          timestamp: new Date(Date.now() - 7200000),
          isActive: false
        }
      ];
      setConversations(mockConversations);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [activeConversationId]);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle incoming WebSocket messages
  const handleIncomingMessage = useCallback((message: AIChatMessage) => {
    if (!message) return;

    const msgId = message.data?.messageId || message.messageId || genId('msg');
    const conversationId = message.data?.conversationId || activeConversationId || 'default';

    console.log('=== HANDLING MESSAGE ===', message.type, message);

    // Handle reasoning steps with fade animation - data is at root level
    if (message.type === 'reasoning_step') {
      const step = {
        step_number: message.step_number || 1,
        step_type: message.step_type || 'thinking',
        title: message.title || 'Processing...',
        description: message.description || '',
        icon: message.icon || '🧠',
        status: message.status || 'processing',
        source: message.source || '',
        timestamp: message.timestamp || new Date().toISOString(),
        processing_time: message.processing_time || 0
      };
      console.log('=== AI CHAT: Processing reasoning step ===', step);

      setCurrentReasoningStep({
        title: step.title,
        icon: step.icon,
        stepNumber: step.step_number,
        description: step.description
      });

      setIsThinking(true);

      // Clear any existing timeout
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }

      // Set timeout to clear thinking state if stuck (30 seconds)
      thinkingTimeoutRef.current = setTimeout(() => {
        console.log('=== AI CHAT: Thinking timeout, clearing state ===');
        setIsThinking(false);
        setCurrentReasoningStep(null);
        setActiveReasoningMessageId(null);
        setIsTyping(false);
        
        // Remove stuck thinking messages
        setMessages(prev => prev.filter(msg => {
          const shouldRemove = (
            msg.reasoningPhase === 'thinking' ||
            msg.showReasoningSteps === true ||
            msg.id.startsWith('reasoning-') ||
            msg.id.startsWith('thinking-')
          );
          return !shouldRemove;
        }));
      }, 30000);

      // Create or update single thinking message (not multiple)
      if (!activeReasoningMessageId) {
        // Remove any existing thinking messages to prevent duplicates
        setMessages(prev => prev.filter(msg => !msg.id.startsWith('reasoning-') && !msg.id.startsWith('thinking-')));

        const thinkingMessageId = `reasoning-${message.data?.conversationId || 'default'}-${Date.now()}`;
        setActiveReasoningMessageId(thinkingMessageId);

        const thinkingMessage: ChatMessage = {
          id: thinkingMessageId,
          text: '',
          sender: 'bot',
          timestamp: new Date(),
          isStreaming: false,
          reasoningPhase: 'thinking' as const,
          showReasoningSteps: true,
          reasoningSteps: [step]
        };

        setMessages(prev => [...prev, thinkingMessage]);
      } else {
        // Update existing thinking message with latest step only (not accumulating)
        setMessages(prev =>
          prev.map(msg =>
            msg.id === activeReasoningMessageId
              ? {
                ...msg,
                reasoningPhase: 'thinking',
                showReasoningSteps: true,
                reasoningSteps: [step] // Only show current step
              }
              : msg
          )
        );
      }
      return;
    }

    // Handle reasoning complete message
    if (message.type === 'reasoning_complete') {
      console.log('=== AI CHAT: Reasoning complete, hiding thinking animation ===');
      
      // Clear thinking timeout
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }
      
      setCurrentReasoningStep(null);
      setIsThinking(false);
      if (activeReasoningMessageId) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === activeReasoningMessageId
              ? {
                ...msg,
                reasoningPhase: 'complete',
                showReasoningSteps: false
              }
              : msg
          )
        );
      }
      return;
    }

    // Handle final AI response - Only process if streaming hasn't started
    if ((message.type === 'ai_message' || message.type === 'final_response') && message.data.content && !hasStartedStreaming) {
      console.log('=== AI CHAT: Processing final response ===', message.data.content);

      if (activeReasoningMessageId) {
        // Clear reasoning step and hide thinking animation
        setCurrentReasoningStep(null);

        // Replace reasoning message with final response and hide thinking
        setMessages(prev =>
          prev.map(msg =>
            msg.id === activeReasoningMessageId
              ? {
                ...msg,
                text: message.data.content || '',
                reasoningPhase: 'hidden',
                showReasoningSteps: false,
                reasoningSteps: undefined,
                isStreaming: false
              }
              : msg
          )
        );
        setActiveReasoningMessageId(null);
      } else {
        // Create new message if no reasoning was shown
        const aiMessage: ChatMessage = {
          id: msgId,
          text: message.data.content || '',
          sender: 'bot',
          timestamp: new Date(),
          messageId: msgId
        };

        setMessages(prev => [...prev, aiMessage]);
      }

      setIsTyping(false);
      setIsThinking(false);
      return;
    }

    // Handle streaming chunks - Simple accumulation without complex buffering
    if (message.type === 'chunk') {
      const { content, messageId, conversationId, is_complete, isFinal } = message.data;
      const isComplete = is_complete || isFinal;

      console.log('=== AI CHAT CHUNK ===', {
        content: `"${content}"`,
        contentLength: content?.length,
        isComplete,
        activeReasoningMessageId,
        hasStartedStreaming,
        messageCount: messages.length
      });

      // Mark that streaming has started and hide reasoning steps immediately
      if (!hasStartedStreaming) {
        setHasStartedStreaming(true);
        setCurrentReasoningStep(null);
        setIsThinking(false);
        
        // Only filter out thinking/reasoning messages, keep existing conversation
        setMessages(prev => prev.filter(msg => {
          const shouldRemove = (
            msg.reasoningPhase === 'thinking' ||
            msg.showReasoningSteps === true ||
            msg.id.startsWith('reasoning-') ||
            msg.id.startsWith('thinking-')
          );
          return !shouldRemove;
        }));
        
        // Don't clear activeReasoningMessageId here - we need it for streaming
      }

      // Find or create streaming message
      let currentStreamId = activeReasoningMessageId;
      
      // Check if we have an existing streaming message
      const existingStreamMessage = messages.find(msg => 
        msg.id === currentStreamId && msg.isStreaming !== false
      );

      if (!currentStreamId || !existingStreamMessage) {
        // Create new streaming message
        const streamMessageId = `stream-${Date.now()}`;
        setActiveReasoningMessageId(streamMessageId);
        currentStreamId = streamMessageId;

        const streamMessage: ChatMessage = {
          id: streamMessageId,
          text: content || '',
          sender: 'bot',
          timestamp: new Date(),
          messageId: streamMessageId,
          isStreaming: !isComplete,
          reasoningPhase: 'hidden',
          showReasoningSteps: false
        };

        setMessages(prev => [...prev, streamMessage]);
        console.log('=== AI CHAT: Created new stream message ===', streamMessage);
      } else {
        // Update existing streaming message by appending content
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === currentStreamId
              ? {
                ...msg,
                text: (msg.text || '') + (content || ''),
                isStreaming: !isComplete,
                reasoningPhase: 'hidden',
                showReasoningSteps: false
              }
              : msg
          )
        );
        console.log('=== AI CHAT: Appended to existing stream message ===', { 
          currentText: existingStreamMessage.text, 
          newContent: content,
          totalLength: (existingStreamMessage.text || '').length + (content || '').length
        });
      }

      // Handle completion
      if (isComplete) {
        console.log('=== AI CHAT: Stream complete ===');
        setActiveReasoningMessageId(null);
        setHasStartedStreaming(false);
        setIsTyping(false);
        setIsThinking(false);
      }
      return;
    }


    // Handle regular AI messages (fallback)
    if (message.data?.content && !activeReasoningMessageId) {
      const aiMessage: ChatMessage = {
        id: msgId,
        text: message.data.content,
        sender: 'bot',
        timestamp: new Date(),
        messageId: msgId
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }
  }, [activeReasoningMessageId, hasStartedStreaming]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initializeWebSocket = async () => {
      try {
        await websocketService.initializeConnection();

        // Check if already connected
        if (websocketService.isConnected()) {
          setIsConnected(true);
        }

        // Set up event listeners
        websocketService.on('connected', () => {
          console.log('Chat page: WebSocket connected');
          setIsConnected(true);
        });

        websocketService.on('disconnected', () => {
          setIsConnected(false);
          setIsTyping(false);
        });

        websocketService.on('error', (error) => {
          // Filter out backend heartbeat/ping errors that aren't user-relevant
          if (error?.message && (error.message.includes('PingHandler') || error.message.includes('heartbeat'))) {
            console.warn('Backend heartbeat error (filtered):', error.message);
            return;
          }

          // Filter out processing errors that don't require disconnection
          if (error?.message && error.message.includes('Failed to process message')) {
            console.warn('Message processing error (non-critical):', error.message);
            setIsTyping(false);
            return;
          }

          console.error('WebSocket error:', error);
          // Don't disconnect on every error - only on connection errors
          if (error?.type === 'connection_error') {
            setIsConnected(false);
          }
          setIsTyping(false);
        });

        websocketService.on('message', handleIncomingMessage);

      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        setIsConnected(false);
      }
    };

    initializeWebSocket();

    // Cleanup on unmount
    return () => {
      websocketService.off('connected');
      websocketService.off('disconnected');
      websocketService.off('error');
      websocketService.off('message');
      
      // Clear thinking timeout
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
      }
    };
  }, [handleIncomingMessage]);

  // Initialize with sample conversations and welcome message
  useEffect(() => {
    const sampleConversations: Conversation[] = [
      {
        id: genId('conv'),
        title: 'ERP System Overview',
        lastMessage: 'Can you explain the ERP architecture?',
        timestamp: new Date(Date.now() - 3600000),
        isActive: false
      },
      {
        id: genId('conv'),
        title: 'Database Queries',
        lastMessage: 'Help me with SQL optimization',
        timestamp: new Date(Date.now() - 7200000),
        isActive: false
      }
    ];

    setConversations(sampleConversations);

    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: genId('welcome'),
      text: "Hi! I'm your AI assistant. I can help you with ERP system questions, database queries, code analysis, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: genId('user'),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      // Clear all state for new message
      setActiveReasoningMessageId(null);
      setIsThinking(false);
      setCurrentStepIndex(0);
      setHasStartedStreaming(false);
      setCurrentReasoningStep(null);

      // Only remove active thinking/reasoning messages, keep completed messages
      setMessages(prev => prev.filter(msg => {
        const shouldRemove = (
          (msg.reasoningPhase === 'thinking' && msg.showReasoningSteps === true) ||
          (msg.id.startsWith('reasoning-') && msg.reasoningPhase === 'thinking') ||
          (msg.id.startsWith('thinking-') && msg.reasoningPhase === 'thinking') ||
          (msg.id.startsWith('stream-') && msg.isStreaming === true)
        );
        return !shouldRemove;
      }));

      // Send message via WebSocket
      websocketService.send('chat_message', {
        content: messageText,
        conversationId: activeConversationId || 'default'
      });

      // Don't set isTyping to false here - let the WebSocket response handle it
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);

      // Add error message
      const errorMessage: ChatMessage = {
        id: genId('error'),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = async () => {
    try {
      // Create new conversation via API
      const newConversation = await conversationService.createConversation({
        title: `Chat - ${new Date().toLocaleDateString()}`
      });

      const newConvId = newConversation.conversation_id;
      setActiveConversationId(newConvId);
      setMessages([]);
      setActiveReasoningMessageId(null);
      setCurrentReasoningSteps(new Map());
      setProcessedMessageIds(new Set());

      // Reload conversations to include the new one
      await loadConversations();

      // Add welcome message for new conversation
      const welcomeMessage: ChatMessage = {
        id: genId('welcome'),
        text: "Hi! I'm your AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to create new conversation:', error);
      // Fallback to local creation
      const newConvId = genId('conv');
      setActiveConversationId(newConvId);
      setMessages([]);
      setActiveReasoningMessageId(null);
      setCurrentReasoningSteps(new Map());
      setProcessedMessageIds(new Set());

      // Update conversations list
      setConversations(prev => prev.map(conv => ({ ...conv, isActive: false })));

      // Add welcome message for new conversation
      const welcomeMessage: ChatMessage = {
        id: genId('welcome'),
        text: "Hi! I'm your AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    try {
      console.log('Selecting conversation:', conversationId);

      // Clear current messages and reset state
      setMessages([]);
      setIsTyping(false);
      setActiveReasoningMessageId(null);
      setProcessedMessageIds(new Set());

      // Update active conversation
      setActiveConversationId(conversationId);
      setConversations(prev => prev.map(conv => ({
        ...conv,
        isActive: conv.id === conversationId
      })));

      // Load conversation messages from API
      console.log('Loading messages for conversation:', conversationId);
      const response = await conversationService.getConversationMessages(conversationId, 1, 50);
      console.log('Loaded messages response:', response);

      const loadedMessages: ChatMessage[] = response.items.map(msg => ({
        id: msg.message_id,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot',
        timestamp: new Date(msg.created_at),
        messageId: msg.message_id,
        reasoningSteps: msg.reasoning_steps?.map(step => ({
          ...step,
          status: step.status === 'failed' ? 'error' : step.status
        })),
        reasoningPhase: msg.reasoning_steps && msg.reasoning_steps.length > 0 ? 'hidden' : undefined
      }));

      console.log('Setting loaded messages:', loadedMessages);
      setMessages(loadedMessages);

      // Update WebSocket to use the selected conversation
      if (websocketService.isConnected()) {
        websocketService.send('join_conversation', {
          conversationId: conversationId
        });
      }

    } catch (error) {
      console.error('Failed to load conversation messages:', error);
      // Fallback to mock data for the selected conversation
      const mockMessages: ChatMessage[] = [
        {
          id: genId('msg'),
          text: "Can you explain the ERP architecture?",
          sender: 'user',
          timestamp: new Date(Date.now() - 1800000)
        },
        {
          id: genId('msg'),
          text: "The ERP architecture consists of several microservices including authentication, sales, inventory, and AI copilot services. Each service is containerized and communicates through an API gateway...",
          sender: 'bot',
          timestamp: new Date(Date.now() - 1700000)
        }
      ];

      console.log('Using fallback mock messages for conversation:', conversationId);
      setMessages(mockMessages);
    }
  };

  return (
    <div className="h-[calc(100vh-13.125rem)] flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-80 min-w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-2 mb-4">
              <ChatbotIcon className="w-6 h-6 text-brand-500" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Assistant
              </h1>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            
            <button
              onClick={handleNewConversation}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>
  
          {/* Conversations List - Takes remaining sidebar height */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                <span className="ml-2 text-sm text-gray-500">Loading conversations...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <ChatbotIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new conversation to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      conv.isActive
                        ? 'bg-brand-100 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {conv.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {conv.lastMessage}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {conv.timestamp.toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
  
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Chat Header */}
          <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {activeConversationId ? 'Chat Session' : 'New Conversation'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {messages.length > 1 && (
                  <button
                    onClick={() => {
                      setMessages([{
                        id: genId('welcome'),
                        text: "Hi! I'm your AI assistant. How can I help you today?",
                        sender: 'bot',
                        timestamp: new Date()
                      }]);
                      setActiveReasoningMessageId(null);
                      setCurrentReasoningSteps(new Map());
                      setIsThinking(false);
                      setHasStartedStreaming(false);
                      setCurrentReasoningStep(null);
                    }}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear Chat
                  </button>
                )}
              </div>
            </div>
          </div>
  
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <ChatbotIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                )}
                
                <div className={`${msg.sender === 'user' ? 'order-2 max-w-[80%]' : 'max-w-[85%]'}`}>
                  {/* Show reasoning steps if in thinking phase */}
                  {msg.showReasoningSteps && msg.reasoningPhase === 'thinking' && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 animate-in fade-in duration-300">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg">{msg.reasoningSteps[msg.reasoningSteps.length - 1]?.icon || '🧠'}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {msg.reasoningSteps[msg.reasoningSteps.length - 1]?.title || 'Processing...'}
                            </span>
                          </div>
                          {msg.reasoningSteps[msg.reasoningSteps.length - 1]?.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              {msg.reasoningSteps[msg.reasoningSteps.length - 1].description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
  
                  {/* Message content - Show if has text and not purely thinking */}
                  {msg.text && (msg.reasoningPhase !== 'thinking' || msg.text.trim()) && (
                    <div className={`rounded-2xl px-4 py-3 inline-block max-w-full ${
                      msg.sender === 'user'
                        ? 'bg-brand-500 text-white ml-auto rounded-br-md'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md shadow-sm'
                    }`}>
                      <div className="text-sm leading-relaxed">
                        {msg.sender === 'bot' ? (
                          <MarkdownRenderer 
                            content={msg.text} 
                            className=""
                          />
                        ) : (
                          <span className="text-white">{msg.text}</span>
                        )}
                        {msg.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                        )}
                      </div>
                    </div>
                  )}
  
                  {/* Timestamp */}
                  {msg.text && (
                    <div className={`flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <span>{msg.timestamp.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}</span>
                    </div>
                  )}
                </div>
                
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
  
            {/* Typing indicator - show when typing but not thinking */}
            {isTyping && !isThinking && !activeReasoningMessageId && (
              <div className="flex justify-start">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <ChatbotIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-bl-md inline-block">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            <div ref={messagesEndRef} />
          </div>
  
          {/* Quick Actions - Show when no messages or conversation is empty */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="max-w-4xl mx-auto">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Actions</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { text: "Show sales dashboard", icon: "📊" },
                    { text: "Generate inventory report", icon: "📦" },
                    { text: "List overdue invoices", icon: "💰" },
                    { text: "Show top customers", icon: "👥" },
                    { text: "Check cash flow", icon: "💸" },
                    { text: "Explain ERP architecture", icon: "🏗️" }
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMessage(action.text);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      disabled={!isConnected || isTyping}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{action.icon}</span>
                      <span>{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-end space-x-3 max-w-4xl mx-auto">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your ERP system..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none transition-all duration-200"
                    rows={1}
                    disabled={!isConnected || isTyping}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !isConnected || isTyping}
                    className="absolute right-2 bottom-2 p-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
                  >
                    {isTyping ? (
                      <TimeIcon className="w-4 h-4 animate-spin" />
                    ) : (
                      <SendIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AIChatPage;
