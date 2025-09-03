"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ConversationSidebar from '@/components/ai/ConversationSidebar';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import { 
  CopilotUIIcon, 
  BoltIcon, 
  InfoIcon, 
  CheckCircleIcon, 
  AlertIcon, 
  TimeIcon, 
  ChatIcon, 
  DocsIcon, 
  TaskIcon,
  BellIcon,
  ErrorIcon,
  PaperPlaneIcon,
  PlusIcon 
} from "@/icons";
import { websocketService, AIChatMessage } from '@/services/websocket';
import { conversationService, ConversationSession, ConversationMessage } from '@/services/conversationService';

interface ReasoningStep {
  step_number: number;
  step_type: string;
  title: string;
  description: string;
  source: string;
  status: 'processing' | 'completed' | 'failed';
  icon: string;
  timestamp: string;
  processing_time?: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
  messageId?: string;
  isFinal?: boolean;
  reasoningSteps?: ReasoningStep[];
  isReasoningComplete?: boolean;
}

const AIChatPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationParam = searchParams.get('conversation');
  
  // State management
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationParam);
  const [currentConversation, setCurrentConversation] = useState<ConversationSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // WebSocket and reasoning state
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());
  const [currentReasoningSteps, setCurrentReasoningSteps] = useState<Map<string, ReasoningStep[]>>(new Map());
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idCounter = useRef(0);
  
  const genId = (prefix = 'id') => {
    idCounter.current += 1;
    return `${prefix}-${Date.now()}-${idCounter.current}-${Math.random().toString(36).slice(2,8)}`;
  };

  // Typewriter effect for AI responses
  const typewriterEffect = useCallback((fullText: string, messageId: string, speed: number = 15) => {
    setTypingMessageId(messageId);
    let index = 0;
    
    const typeNextChar = () => {
      if (index < fullText.length) {
        const currentText = fullText.substring(0, index + 1);
        
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, text: currentText }
            : msg
        ));
        
        index++;
        typewriterTimeoutRef.current = setTimeout(typeNextChar, speed);
      } else {
        setTypingMessageId(null);
        setIsTyping(false);
      }
    };
    
    typeNextChar();
  }, []);

  // Load conversation by ID
  const loadConversation = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    
    setIsLoading(true);
    try {
      const result = await conversationService.loadConversation(conversationId);
      if (result) {
        setCurrentConversation(result.conversation);
        
        // Convert to ChatMessage format
        const chatMessages: ChatMessage[] = result.messages.map((msg: ConversationMessage) => ({
          id: msg.message_id,
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(msg.created_at),
          messageId: msg.message_id,
          reasoningSteps: msg.reasoning_steps || []
        }));
        
        setMessages(chatMessages);
        
        // Mark all loaded messages as processed
        chatMessages.forEach(msg => processedMessageIds.add(msg.id));
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [processedMessageIds]);

  // Create new conversation
  const createNewConversation = useCallback(async () => {
    try {
      const newConversation = await conversationService.createConversation({
        title: `AI Chat - ${new Date().toLocaleDateString()}`,
        context: {
          user_id: 'current_user',
          department: 'general',
          page: 'ai_chat'
        }
      });
      
      setCurrentConversation(newConversation);
      setCurrentConversationId(newConversation.conversation_id);
      setMessages([]);
      processedMessageIds.clear();
      setCurrentReasoningSteps(new Map());
      
      // Update URL
      router.push(`/ai/chat?conversation=${newConversation.conversation_id}`);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome-full-chat',
        text: "👋 Welcome to the AI Chat! I'm your intelligent assistant with step-by-step reasoning capabilities. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      processedMessageIds.add('welcome-full-chat');
      
    } catch (error) {
      console.error('Failed to create new conversation:', error);
    }
  }, [router, processedMessageIds]);

  // Handle conversation selection
  const handleConversationSelect = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
    router.push(`/ai/chat?conversation=${conversationId}`);
  }, [router]);

  // Initialize conversation on mount or param change
  useEffect(() => {
    if (conversationParam && conversationParam !== currentConversationId) {
      setCurrentConversationId(conversationParam);
      loadConversation(conversationParam);
    } else if (!conversationParam && !currentConversationId) {
      createNewConversation();
    }
  }, [conversationParam, currentConversationId, loadConversation, createNewConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle incoming WebSocket messages with reasoning steps support
  const handleIncomingMessage = useCallback((message: AIChatMessage) => {
    if (!message) return;

    // Extract message ID for deduplication
    const messageId = (message as any).message_id || (message.data as any)?.message_id || `msg-${genId('msg')}`;
    
    // Check if already processed
    if (processedMessageIds.has(messageId)) {
      return;
    }
    
    // Mark as processed immediately
    setProcessedMessageIds(prev => new Set([...prev, messageId]));

    // Handle different message types
    const messageType = (message as any).type;
    
    if (messageType === 'reasoning_step') {
      // Handle reasoning step
      const stepData = (message as any).metadata || message.data || message;
      const conversationId = (message as any).conversation_id || currentConversationId || 'current';
      
      const reasoningStep: ReasoningStep = {
        step_number: (stepData as any).step_number || 0,
        step_type: (stepData as any).step_type || 'thinking',
        title: (stepData as any).title || 'Processing...',
        description: (stepData as any).description || '',
        source: (stepData as any).source || 'AI System',
        status: (stepData as any).status || 'processing',
        icon: (stepData as any).icon || '🤔',
        timestamp: (stepData as any).timestamp || new Date().toISOString(),
        processing_time: (stepData as any).processing_time || 0
      };
      
      // Update reasoning steps
      setCurrentReasoningSteps(prev => {
        const steps = prev.get(conversationId) || [];
        const updatedSteps = [...steps];
        
        const existingIndex = updatedSteps.findIndex(s => s.step_number === reasoningStep.step_number);
        if (existingIndex >= 0) {
          updatedSteps[existingIndex] = reasoningStep;
        } else {
          updatedSteps.push(reasoningStep);
        }
        
        const newMap = new Map(prev);
        newMap.set(conversationId, updatedSteps.sort((a, b) => a.step_number - b.step_number));
        return newMap;
      });
      
      return;
    }
    
    if (messageType === 'final_response') {
      // Handle final response
      const content = (message as any).content || '';
      const conversationId = (message as any).conversation_id || currentConversationId || 'current';
      
      // Clear typewriter effect
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
      
      // Get reasoning steps
      const reasoningSteps = currentReasoningSteps.get(conversationId) || [];
      
      // Add message with reasoning steps
      const newMessage: ChatMessage = {
        id: messageId,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        messageId,
        reasoningSteps: reasoningSteps,
        isReasoningComplete: true
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsTyping(false);
      
      // Start typewriter effect
      typewriterEffect(content, messageId);
      
      // Clear reasoning steps
      setCurrentReasoningSteps(prev => {
        const newMap = new Map(prev);
        newMap.delete(conversationId);
        return newMap;
      });
      
      return;
    }
    
    // Handle regular messages (fallback)
    const messageData = message.data || message;
    let content = messageData.content || (messageData as any).message || (messageData as any).text || (messageData as any).response;
    
    if (!content && Object.keys(messageData).length === 0) {
      content = (message as any).content || (message as any).message || (message as any).text || (message as any).response;
    }
    
    if (!content && (message as any).type === 'chat_response') {
      content = (message as any).response || (message as any).data?.response;
    }
    
    if (!content) return;
    
    const messageContent = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Clear typewriter effect
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    // Add message
    const newMessage: ChatMessage = {
      id: messageId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      messageId
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setIsTyping(false);
    
    // Start typewriter effect
    typewriterEffect(messageContent, messageId);
  }, [typewriterEffect, processedMessageIds, currentReasoningSteps, currentConversationId]);

  // WebSocket connection and event handling
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      console.warn('No access token found for WebSocket connection');
      return;
    }

    const messageListener = (message: AIChatMessage) => {
      handleIncomingMessage(message);
    };
    
    const connectListener = () => {
      setIsConnected(true);
      setIsTyping(false);
      websocketService.subscribe('ai_chat');
    };
    
    const disconnectListener = () => {
      setIsConnected(false);
      setIsTyping(false);
    };
    
    const errorListener = (error: any) => {
      console.error('WebSocket error:', error);
      setIsTyping(false);
    };

    // Set up listeners
    websocketService.on('ai_message', messageListener);
    websocketService.on('connected', connectListener);
    websocketService.on('disconnected', disconnectListener);
    websocketService.on('error', errorListener);
    
    // Initialize connection
    websocketService.ensureConnection();
    
    if (!websocketService.isConnected()) {
      websocketService.shouldConnect = true;
      websocketService.initializeConnection().then(() => {
        setIsConnected(websocketService.isConnected());
        if (websocketService.isConnected()) {
          websocketService.subscribe('ai_chat');
        }
      });
    } else {
      setIsConnected(true);
      websocketService.subscribe('ai_chat');
    }
    
    return () => {
      websocketService.off('ai_message', messageListener);
      websocketService.off('connected', connectListener);
      websocketService.off('disconnected', disconnectListener);
      websocketService.off('error', errorListener);
      
      if (websocketService.isConnected()) {
        websocketService.unsubscribe('ai_chat');
      }
    };
  }, [handleIncomingMessage]);

  // Send message handler
  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || isTyping || !isConnected) return;
    
    const userMessage: ChatMessage = {
      id: `user-${genId('user')}`,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    try {
      await websocketService.sendChatMessage(
        message,
        currentConversationId || `session_${genId('session')}`,
        { 
          user_id: 'current_user',
          department: 'general',
          conversation_id: currentConversationId
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      setMessages(prev => [...prev, {
        id: `error-${genId('error')}`,
        text: 'Failed to send message. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [message, isTyping, isConnected, currentConversationId]);

  // Get appropriate icon for reasoning step type
  const getStepIcon = (stepType: string, status: string) => {
    const iconProps = { className: "w-4 h-4" };
    
    switch (stepType) {
      case 'thinking':
      case 'analysis':
        return <BoltIcon {...iconProps} />;
      case 'search':
      case 'retrieval':
        return <DocsIcon {...iconProps} />;
      case 'processing':
      case 'computation':
        return <TaskIcon {...iconProps} />;
      case 'validation':
      case 'verification':
        return status === 'completed' ? <CheckCircleIcon {...iconProps} /> : <InfoIcon {...iconProps} />;
      case 'error':
      case 'failure':
        return <ErrorIcon {...iconProps} />;
      case 'notification':
        return <BellIcon {...iconProps} />;
      case 'communication':
        return <ChatIcon {...iconProps} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  // Enhanced Reasoning Steps Display Component with Professional Design
  const ReasoningStepsDisplay = ({ steps }: { steps: ReasoningStep[] }) => (
    <div className="space-y-2 mb-4 p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-lg"></div>
          <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-ping opacity-20"></div>
        </div>
        <span className="text-sm font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">AI Reasoning Process</span>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-700"></div>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={`step-${step.step_number}`} className="group relative">
            <div className="flex items-start space-x-4 p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-md">
              <div className="flex-shrink-0 mt-0.5">
                <div className="relative">
                  <div className={`p-2 rounded-lg ${
                    step.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    step.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {getStepIcon(step.step_type, step.status)}
                  </div>
                  {step.status === 'processing' && (
                    <div className="absolute -inset-1 bg-blue-400 rounded-lg animate-pulse opacity-20"></div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {step.step_number}. {step.title}
                  </span>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    step.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    step.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    step.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {step.status === 'processing' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                        <span>Processing</span>
                      </div>
                    )}
                    {step.status === 'completed' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                        <span>Complete</span>
                      </div>
                    )}
                    {step.status === 'failed' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                        <span>Failed</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  {step.description}
                </p>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-500">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    <span>{step.source}</span>
                  </div>
                  {step.processing_time && step.processing_time > 0 && (
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-500">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                      <span>{step.processing_time.toFixed(2)}s</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Message Bubble Component
  const MessageBubble = ({ message, isTyping }: { message: ChatMessage; isTyping: boolean }) => (
    <div className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'bot' && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center">
            <CopilotUIIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-first' : ''}`}>
        {/* Show reasoning steps if available */}
        {message.reasoningSteps && message.reasoningSteps.length > 0 && (
          <div className="mb-3">
            <ReasoningStepsDisplay steps={message.reasoningSteps} />
          </div>
        )}
        
        <div className={`px-6 py-4 rounded-2xl shadow-sm ${
          message.sender === 'user'
            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-br-md shadow-lg'
            : 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm'
        }`}>
          <div className="text-sm leading-relaxed">
            {message.text ? (
              <MarkdownRenderer content={message.text} />
            ) : null}
            {isTyping && (
              <span className="inline-block w-2 h-5 ml-1 bg-current animate-pulse"></span>
            )}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2 ${
          message.sender === 'user' ? 'justify-end' : 'justify-start'
        }`}>
          <span>{message.timestamp.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}</span>
          {message.reasoningSteps && message.reasoningSteps.length > 0 && (
            <span className="text-blue-500">🧠 {message.reasoningSteps.length} steps</span>
          )}
        </div>
      </div>
      
      {message.sender === 'user' && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">U</span>
          </div>
        </div>
      )}
    </div>
  );

  // Live Reasoning Indicator
  const LiveReasoningIndicator = ({ conversationId }: { conversationId: string }) => {
    const steps = currentReasoningSteps.get(conversationId) || [];
    
    if (steps.length === 0) return null;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 justify-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center">
              <CopilotUIIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <ReasoningStepsDisplay steps={steps} />
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Professional Typing Indicator
  const TypingIndicator = () => (
    <div className="max-w-4xl mx-auto">
      <div className="flex gap-4 justify-start">
        <div className="flex-shrink-0">
          <div className="relative w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-lg">
            <CopilotUIIcon className="w-5 h-5 text-white" />
            <div className="absolute -inset-1 bg-gradient-to-br from-brand-400 to-brand-500 rounded-full animate-pulse opacity-20"></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="px-6 py-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl rounded-bl-md shadow-lg border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div 
                  className="w-2.5 h-2.5 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full animate-bounce shadow-sm" 
                  style={{ 
                    animationDelay: '0ms',
                    animationDuration: '1.4s',
                    animationIterationCount: 'infinite'
                  }}
                ></div>
                <div 
                  className="w-2.5 h-2.5 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full animate-bounce shadow-sm" 
                  style={{ 
                    animationDelay: '0.2s',
                    animationDuration: '1.4s',
                    animationIterationCount: 'infinite'
                  }}
                ></div>
                <div 
                  className="w-2.5 h-2.5 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full animate-bounce shadow-sm" 
                  style={{ 
                    animationDelay: '0.4s',
                    animationDuration: '1.4s',
                    animationIterationCount: 'infinite'
                  }}
                ></div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent">
                  AI is analyzing and processing...
                </span>
                <div className="w-1 h-1 bg-brand-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Cleanup typewriter effect
  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewConversation={createNewConversation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center">
                <CopilotUIIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Copilot
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
                  {currentConversation && (
                    <>
                      <span>•</span>
                      <span>{currentConversation.title}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={createNewConversation}
                className="flex items-center space-x-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>New Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CopilotUIIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Start a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Ask me anything about your ERP system. I'll show you my step-by-step reasoning process.
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <button className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    "Help me understand user permissions"
                  </button>
                  <button className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    "Show me sales analytics for this month"
                  </button>
                  <button className="p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    "How do I create a new invoice?"
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages Display */}
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                  <MessageBubble 
                    key={`${msg.id}-${index}`} 
                    message={msg} 
                    isTyping={typingMessageId === msg.id}
                  />
                ))}
                
                {/* Live Reasoning Steps */}
                <LiveReasoningIndicator conversationId={currentConversationId || 'current'} />
                
                {/* Typing Indicator */}
                {isTyping && <TypingIndicator />}
              </div>
            </>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-sm shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask me anything about your ERP system..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
                  disabled={!isConnected || isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isConnected || isTyping}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20"
                >
                  <PaperPlaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {!isConnected && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Connecting to AI service...
              </p>
            )}
            
            {isTyping && (
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-2 text-center">
                AI is thinking and processing your request...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;