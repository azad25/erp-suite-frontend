"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { websocketService, AIChatMessage, AIChatRequest } from '@/services/websocket';
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
  ChevronDownIcon,
  ChevronUpIcon
} from "@/icons";
import Link from "next/link";

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

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<any>(null);

  const [currentReasoningSteps, setCurrentReasoningSteps] = useState<Map<string, ReasoningStep[]>>(new Map());

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageRef = useRef<ChatMessage | null>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idCounter = useRef(0);
  
  const genId = (prefix = 'id') => {
    idCounter.current += 1;
    return `${prefix}-${Date.now()}-${idCounter.current}-${Math.random().toString(36).slice(2,8)}`;
  };

  // Typewriter effect for AI responses
  const typewriterEffect = useCallback((fullText: string, messageId: string, speed: number = 10) => {
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

  // Cleanup typewriter effect
  useEffect(() => {
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, []);

  // Initialize conversation on mount
  useEffect(() => {
    const initializeConversation = async () => {
      try {
        const { conversationService } = await import('@/services/conversationService');
        const newConversation = await conversationService.createConversation({
          title: `Widget Chat - ${new Date().toLocaleDateString()}`,
          context: {
            user_id: 'current_user',
            department: 'general',
            widget: true
          }
        });
        
        setCurrentConversation(newConversation);
        setSessionId(newConversation.conversation_id);
        
        // Add welcome messages
        const welcomeMessages = [
          {
            id: 'welcome-1',
            text: "👋 Hi! I'm your AI assistant for the ERP Suite.",
            sender: 'bot' as const,
            timestamp: new Date(),
          },
          {
            id: 'welcome-2', 
            text: "Ask me anything about user management, sales, invoicing, or system navigation! I'll show you my step-by-step reasoning process.",
            sender: 'bot' as const,
            timestamp: new Date(),
          }
        ];
        
        setMessages(welcomeMessages);
        welcomeMessages.forEach(msg => processedMessageIds.add(msg.id));
        
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
        // Fallback to local messages
        const fallbackMessages = [
          {
            id: 'welcome-1',
            text: "👋 Hi! I'm your AI assistant for the ERP Suite.",
            sender: 'bot' as const,
            timestamp: new Date(),
          },
          {
            id: 'welcome-2',
            text: "Ask me anything about user management, sales, invoicing, or system navigation! I'll show you my step-by-step reasoning process.",
            sender: 'bot' as const,
            timestamp: new Date(),
          }
        ];
        setMessages(fallbackMessages);
      }
    };
    
    if (messages.length === 0) {
      initializeConversation();
    }
  }, []);

  // Handle incoming WebSocket messages with reasoning steps support
  const handleIncomingMessage = useCallback((message: AIChatMessage) => {
    if (!message) return;

    // Extract message ID first for deduplication
    const messageId = (message as any).message_id || (message.data as any)?.message_id || `msg-${genId('msg')}`;
    
    // Check if we've already processed this message
    if (processedMessageIds.has(messageId)) {
      return;
    }
    
    // Mark message as processed IMMEDIATELY to prevent race conditions
    setProcessedMessageIds(prev => new Set([...prev, messageId]));

    // Handle different message types
    const messageType = (message as any).type;
    
    if (messageType === 'reasoning_step') {
      // Handle reasoning step
      const stepData = (message as any).metadata || message.data || message;
      const conversationId = (message as any).conversation_id || 'current';
      
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
      
      // Update reasoning steps for the current conversation
      setCurrentReasoningSteps(prev => {
        const steps = prev.get(conversationId) || [];
        const updatedSteps = [...steps];
        
        // Find existing step or add new one
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
      const conversationId = (message as any).conversation_id || 'current';
      
      // Clear any existing typewriter effect
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
      
      // Get reasoning steps for this conversation
      const reasoningSteps = currentReasoningSteps.get(conversationId) || [];
      
      // Add the message with reasoning steps
      const newMessage: ChatMessage = {
        id: messageId,
        text: '', // Start with empty text
        sender: 'bot' as const,
        timestamp: new Date(),
        messageId,
        reasoningSteps: reasoningSteps,
        isReasoningComplete: true
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsTyping(false); // Stop the "thinking" indicator
      
      // Start typewriter effect for final content
      typewriterEffect(content, messageId);
      
      // Clear reasoning steps for this conversation
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
    
    // If messageData is empty (0 keys), try the root message object directly
    if (!content && Object.keys(messageData).length === 0) {
      content = (message as any).content || (message as any).message || (message as any).text || (message as any).response;
    }
    
    // Special handling for chat_response type messages
    if (!content && (message as any).type === 'chat_response') {
      content = (message as any).response || (message as any).data?.response;
    }
    
    if (!content) {
      return;
    }
    
    const messageContent = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Clear any existing typewriter effect
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    // Add the message with empty text first
    const newMessage: ChatMessage = {
      id: messageId,
      text: '', // Start with empty text
      sender: 'bot' as const,
      timestamp: new Date(),
      messageId
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setIsTyping(false); // Stop the "thinking" indicator
    
    // Start typewriter effect
    typewriterEffect(messageContent, messageId);
    
    currentMessageRef.current = null;
  }, [typewriterEffect, processedMessageIds, currentReasoningSteps]);

  const handleQuickReply = (reply: string) => {
    setMessage(reply);
    // Send the message after a short delay to allow the input to update
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }, 100);
  };

  // Handle WebSocket connection status changes
  const handleConnectionChange = useCallback(({ isConnected }: { isConnected: boolean }) => {
    setIsConnected(isConnected);
    if (!isConnected) {
      setIsTyping(false);
    }
  }, []);

  const handleError = useCallback((error: any) => {
    console.error('WebSocket error:', error);
    setMessages(prev => [...prev, {
      id: `error-${genId('error')}`,
      text: 'An error occurred with the AI service. Please try again later.',
      sender: 'bot' as const,
      timestamp: new Date(),
    }]);
    setIsTyping(false);
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isTyping) return;
    
    const userMessage: ChatMessage = {
      id: `user-${genId('user')}`,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    try {
      setIsTyping(true);
      
      // The WebSocket service will handle reconnection if needed
      const messageId = await websocketService.sendChatMessage(message, sessionId || undefined, {
        user_id: 'current_user',
        department: 'general',
        conversation_id: sessionId
      });
      
      console.log('Message sent with ID:', messageId);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
  id: `error-${genId('error')}`,
        text: 'Failed to send message. Please try again.',
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  // Set up WebSocket connection and event listeners
  useEffect(() => {
    console.log('=== CHATBOT WIDGET: Setting up WebSocket listeners ===');
    
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      console.warn('No access token found. User must be authenticated to use the chat.');
      return;
    }

    // Set up WebSocket listeners
    const messageListener = (message: AIChatMessage) => {
      handleIncomingMessage(message);
    };
    
    const connectListener = () => {
      setIsConnected(true);
      setIsTyping(false);
      // Subscribe to AI chat channel when connected
      websocketService.subscribe('ai_chat');
    };
    
    const disconnectListener = () => {
      setIsConnected(false);
      setIsTyping(false);
      
      // Show connection status to user
      setMessages(prev => [...prev, {
  id: `status-${genId('status')}`,
        text: 'Disconnected from server. Reconnecting...',
        sender: 'bot',
        timestamp: new Date()
      }]);
    };
    
    const ackListener = (ack: any) => {
      // Handle acknowledgment if needed
    };
    
    const errorListener = (error: any) => {
      console.error('=== CHATBOT WIDGET: WebSocket error ===', error);
      
      // Handle different error formats
      let errorMessage = 'An error occurred with the WebSocket connection';
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      
      // Don't show duplicate error messages
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.text.includes(errorMessage)) {
          return prev;
        }
        return [...prev, {
    id: `error-${genId('error')}`,
          text: `Error: ${errorMessage}`,
          sender: 'bot' as const,
          timestamp: new Date()
        }];
      });
      
      setIsTyping(false);
      
      // If it's an authentication error, suggest re-login
      if (errorMessage.toLowerCase().includes('auth') || 
          errorMessage.toLowerCase().includes('token') ||
          errorMessage.toLowerCase().includes('unauthorized')) {
        setMessages(prev => [...prev, {
    id: `suggestion-${genId('suggestion')}`,
          text: 'Please try logging out and back in to refresh your session.',
          sender: 'bot' as const,
          timestamp: new Date()
        }]);
      }
    };

    // Initialize WebSocket connection
    const initWebSocket = async () => {
      try {
        // Remove any existing listeners first to prevent duplicates
        websocketService.off('ai_message', messageListener);
        websocketService.off('acknowledgment', ackListener);
        websocketService.off('connected', connectListener);
        websocketService.off('disconnected', disconnectListener);
        websocketService.off('error', errorListener);
        
        // Set up all event listeners
        websocketService.on('ai_message', messageListener);
        websocketService.on('acknowledgment', ackListener);
        websocketService.on('connected', connectListener);
        websocketService.on('disconnected', disconnectListener);
        websocketService.on('error', errorListener);
        
        // Ensure connection is established
        websocketService.ensureConnection();
        
        // Initialize connection if not already connected
        if (!websocketService.isConnected()) {
          websocketService.shouldConnect = true;
          await websocketService.initializeConnection();
          
          // Check connection status after initialization
          const connected = websocketService.isConnected();
          setIsConnected(connected);
          
          // Only subscribe if we're not on the AI chat page
          if (connected && !window.location.pathname.includes('/ai/chat')) {
            websocketService.subscribe('ai_chat');
          }
        } else {
          setIsConnected(true);
          // Only subscribe if we're not on the AI chat page
          if (!window.location.pathname.includes('/ai/chat')) {
            websocketService.subscribe('ai_chat');
          }
        }
      } catch (error) {
        const errorMsg = 'Failed to initialize WebSocket connection';
        console.error(errorMsg, error);
        handleError(new Error(errorMsg));
      }
    };

    // Initialize WebSocket connection
    initWebSocket();
    
    // Clean up event listeners on unmount
    return () => {
      
      // Remove all listeners
      websocketService.off('ai_message', messageListener);
      websocketService.off('acknowledgment', ackListener);
      websocketService.off('connected', connectListener);
      websocketService.off('disconnected', disconnectListener);
      websocketService.off('error', errorListener);
      websocketService.off('message');
      
      // Unsubscribe from the AI chat channel if connected and we subscribed
      if (websocketService.isConnected() && !window.location.pathname.includes('/ai/chat')) {
          websocketService.unsubscribe('ai_chat');
      }
      
      // Reset states
      setIsConnected(false);
      setIsTyping(false);
      currentMessageRef.current = null;
      
    };
  }, []);

  // Auto-scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  // Handle sending messages
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || isTyping) return;
    
    const userMessage: ChatMessage = {
      id: `user-${genId('user')}`,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);
    
    try {
      // Use the WebSocket service to send the message
      await websocketService.sendChatMessage(
        message,
        sessionId || `session_${genId('session')}`,
        { 
          user_id: 'current_user', // This should be replaced with actual user ID
          department: 'general',
          conversation_id: sessionId
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add error message to chat
      setMessages(prev => [
        ...prev, 
        {
    id: `error-${genId('error')}`,
          text: 'Failed to send message. Please try again.',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get appropriate SVG icon for reasoning step type
  const getStepIcon = (stepType: string, status: string) => {
    const iconProps = { className: "w-3 h-3" };
    
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

  // Enhanced Reasoning Steps Display Component for Widget
  const ReasoningStepsDisplay = ({ steps }: { steps: ReasoningStep[] }) => (
    <div className="space-y-2 mb-3 p-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-3">
        <div className="relative">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-sm"></div>
          <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-ping opacity-20"></div>
        </div>
        <span className="text-xs font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">AI Reasoning Process</span>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-700"></div>
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={`step-${step.step_number}`} className="group relative">
            <div className="flex items-start space-x-3 p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
              <div className="flex-shrink-0 mt-0.5">
                <div className="relative">
                  <div className={`p-1.5 rounded-md text-xs ${
                    step.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    step.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {getStepIcon(step.step_type, step.status)}
                  </div>
                  {step.status === 'processing' && (
                    <div className="absolute -inset-0.5 bg-blue-400 rounded-md animate-pulse opacity-20"></div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {step.step_number}. {step.title}
                  </span>
                  <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    step.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    step.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    step.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {step.status === 'processing' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                      </div>
                    )}
                    {step.status === 'completed' && (
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    )}
                    {step.status === 'failed' && (
                      <div className="w-1 h-1 bg-current rounded-full"></div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                  {step.description}
                </p>
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-500">
                    <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                    <span>{step.source}</span>
                  </div>
                  {step.processing_time && step.processing_time > 0 && (
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-500">
                      <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
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

  // Enhanced Professional Typing Indicator for Widget
  const TypingIndicator = () => (
    <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-sm backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50">
      <div className="flex space-x-1">
        <div 
          className="w-2 h-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full animate-bounce shadow-sm" 
          style={{ 
            animationDelay: '0ms',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
        <div 
          className="w-2 h-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full animate-bounce shadow-sm" 
          style={{ 
            animationDelay: '0.2s',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
        <div 
          className="w-2 h-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full animate-bounce shadow-sm" 
          style={{ 
            animationDelay: '0.4s',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-400 dark:to-brand-300 bg-clip-text text-transparent">
          AI is analyzing...
        </span>
        <div className="w-1 h-1 bg-brand-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  // Live Reasoning Steps Indicator
  const LiveReasoningIndicator = ({ conversationId }: { conversationId: string }) => {
    const steps = currentReasoningSteps.get(conversationId) || [];
    
    if (steps.length === 0) return null;
    
    return (
      <div className="mb-3">
        <ReasoningStepsDisplay steps={steps} />
      </div>
    );
  };

  // Connection Status Indicator
  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className={isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChatbot}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        aria-label="Open AI Copilot"
      >
        <CopilotUIIcon width="20" height="20" />
        <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-green-400">
          <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
        </span>
      </button>

      {/* Chatbot Dropdown */}
      {isOpen && (
        <div className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <CopilotUIIcon width="24" height="24" className="text-brand-500" />
              <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                AI Copilot
              </h5>
            </div>
            <div className="flex items-center space-x-2">
              <ConnectionStatus />
              <button
                onClick={toggleChatbot}
                className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-col h-auto overflow-y-auto custom-scrollbar flex-1">
            <ul className="flex flex-col space-y-3 p-2">
              {messages.map((msg, index) => (
                <li key={`${msg.id}-${index}`}>
                  <div className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'bot' && (
                      <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                        <div className="w-full h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                          <CopilotUIIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-green-400 dark:border-gray-900"></span>
                      </span>
                    )}

                    <span className={`block max-w-[80%] ${msg.sender === 'user' ? 'order-first' : ''}`}>
                      {/* Show reasoning steps if available */}
                      {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                        <div className="mb-2">
                          <ReasoningStepsDisplay steps={msg.reasoningSteps} />
                        </div>
                      )}
                      
                      <div className={`px-4 py-2 rounded-2xl shadow-sm ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-br-md shadow-md'
                        : 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm'
                        } ${msg.isStreaming ? 'border-l-2 border-brand-500' : ''}`}>
                        <span className="block text-theme-sm">
                          <div className="text-sm leading-relaxed">
                            {msg.text ? (
                              <MarkdownRenderer content={msg.text} />
                            ) : null}
                            {msg.isStreaming && (
                              <span className="inline-block w-2 h-5 ml-1 bg-current animate-pulse"></span>
                            )}
                          </div>
                        </span>
                      </div>

                      <span className={`flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                        <span>{formatTime(msg.timestamp)}</span>
                        {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                          <span className="text-blue-500">🧠 {msg.reasoningSteps.length} steps</span>
                        )}
                      </span>
                    </span>
                  </div>
                </li>
              ))}

              {/* Quick Reply Options */}
              {messages.length === 2 && (
                <li>
                  <div className="space-y-2 mt-4">
                    <button
                      onClick={async () => {
                        const messageText = "Help with user management and permissions";
                        const userMessage: ChatMessage = {
                          id: `user-${genId('user')}`,
                          text: messageText,
                          sender: 'user' as const,
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, userMessage]);
                        setIsTyping(true);
                        
                        try {
                          await websocketService.sendChatMessage(
                            messageText,
                            sessionId || `session_${genId('session')}`,
                            { 
                              user_id: 'current_user', 
                              department: 'admin',
                              conversation_id: sessionId
                            }
                          );
                        } catch (error) {
                          console.error('Error sending message:', error);
                          setIsTyping(false);
                        }
                      }}
                      className="w-full text-left p-3 border border-brand-200 dark:border-brand-700 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-sm text-brand-600 dark:text-brand-400"
                    >
                      Help with user management and permissions
                    </button>
                    <button
                      onClick={async () => {
                        const messageText = "Questions about sales and invoicing";
                        const userMessage: ChatMessage = {
                          id: genId('user'),
                          text: "Questions about sales and invoicing",
                          sender: 'user',
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, userMessage]);
                        setIsTyping(true);
                        
                        (async () => {
                          try {
                            await websocketService.sendChatMessage(
                              "Questions about sales and invoicing",
                              sessionId || `session_${genId('session')}`,
                              { 
                                user_id: 'current_user', 
                                department: 'sales',
                                conversation_id: sessionId
                              }
                            );
                          } catch (error: unknown) {
                            console.error('Error sending message:', error);
                            setIsTyping(false);
                          }
                        })();
                      }}
                      className="w-full text-left p-3 border border-brand-200 dark:border-brand-700 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-sm text-brand-600 dark:text-brand-400"
                    >
                      Questions about sales and invoicing
                    </button>
                    <button
                      onClick={() => {
                        const userMessage: ChatMessage = {
                          id: genId('user'),
                          text: "General system navigation help",
                          sender: 'user',
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, userMessage]);
                        setIsTyping(true);
                        
                        (async () => {
                          try {
                            await websocketService.sendChatMessage(
                              "General system navigation help",
                              sessionId || `session_${genId('session')}`,
                              { 
                                user_id: 'current_user', 
                                department: 'general',
                                conversation_id: sessionId
                              }
                            );
                          } catch (error: unknown) {
                            console.error('Error sending message:', error);
                            setIsTyping(false);
                          }
                        })();
                      }}
                      className="w-full text-left p-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm"
                    >
                      General system navigation help
                    </button>
                  </div>
                </li>
              )}

              {/* Show live reasoning steps */}
              <LiveReasoningIndicator conversationId="current" />

              {isTyping && (
                <li>
                  <TypingIndicator />
                </li>
              )}
              
              <div ref={messagesEndRef} />
            </ul>
          </div>

          {/* Input Section */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about ERP..."
                  className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                  disabled={!isConnected}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isConnected}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20"
                >
                  <PaperPlaneIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            {!isConnected && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Connecting to AI service...
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center space-x-2 mt-3">
            <Link
              href={sessionId ? `/ai/chat?conversation=${sessionId}` : '/ai/chat'}
              className="flex-1 block px-4 py-2 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Open Full Chat
            </Link>
            <button
              onClick={async () => {
                try {
                  const { conversationService } = await import('@/services/conversationService');
                  const newConversation = await conversationService.createConversation({
                    title: `New Widget Chat - ${new Date().toLocaleDateString()}`,
                    context: {
                      user_id: 'current_user',
                      department: 'general',
                      widget: true
                    }
                  });
                  
                  setCurrentConversation(newConversation);
                  setSessionId(newConversation.conversation_id);
                  setMessages([]);
                  processedMessageIds.clear();
                  setCurrentReasoningSteps(new Map());
                  
                  // Add welcome message for new conversation
                  const welcomeMessage = {
                    id: 'welcome-new',
                    text: "👋 Hi! I'm your AI assistant. How can I help you today?",
                    sender: 'bot' as const,
                    timestamp: new Date(),
                  };
                  setMessages([welcomeMessage]);
                  processedMessageIds.add('welcome-new');
                  
                } catch (error) {
                  console.error('Failed to create new conversation:', error);
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="New conversation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;