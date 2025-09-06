"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { websocketService, AIChatMessage, AIChatRequest } from '@/services/websocket';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import UserAvatar from '@/components/common/UserAvatar';
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
  ChevronUpIcon,
  EditIcon
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
        
        // Create conversation with proper error handling
        let newConversation;
        try {
          newConversation = await conversationService.createConversation({
            title: `Widget Chat - ${new Date().toLocaleDateString()}`,
            context: {
              user_id: 'current_user',
              department: 'general',
              widget: true
            }
          });
          console.log('Successfully created conversation:', newConversation.conversation_id);
        } catch (error) {
          console.warn('Failed to create remote conversation, using local session:', error);
          // Create a local session ID for the widget when backend is unavailable
          newConversation = {
            conversation_id: `local-widget-${Date.now()}`,
            title: `Widget Chat - ${new Date().toLocaleDateString()}`,
            created_at: new Date().toISOString(),
            status: 'active',
            context: {}
          };
        }
        
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
        welcomeMessages.forEach((msg: ChatMessage) => processedMessageIds.add(msg.id));
        
      } catch (error) {
        console.error('Failed to initialize conversation:', error);
        // Fallback to local messages with a session ID
        const sessionId = `fallback-${Date.now()}`;
        setSessionId(sessionId);
        
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
        fallbackMessages.forEach((msg: ChatMessage) => processedMessageIds.add(msg.id));
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
        // Only initialize if not already connected or connecting
        if (websocketService.isConnected() || websocketService.getConnectionState() === 'connecting') {
          console.log('WebSocket already connected or connecting, skipping initialization');
          setIsConnected(websocketService.isConnected());
          return;
        }

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

  // Enhanced Reasoning Steps Display Component for Widget with Apple-like Design
  const ReasoningStepsDisplay = ({ steps }: { steps: ReasoningStep[] }) => (
    <div className="space-y-1 mb-2 p-3 bg-gradient-to-br from-slate-50/80 via-blue-50/60 to-indigo-50/80 dark:from-slate-800/40 dark:via-blue-900/20 dark:to-indigo-900/30 rounded-xl border border-slate-200/60 dark:border-slate-700/40 shadow-sm backdrop-blur-md">
      <div className="flex items-center space-x-2 mb-2">
        <div className="relative">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse shadow-sm"></div>
          <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-ping opacity-30"></div>
        </div>
        <span className="text-xs font-semibold bg-gradient-to-r from-slate-700 to-slate-800 dark:from-slate-300 dark:to-slate-200 bg-clip-text text-transparent tracking-wide">AI Reasoning</span>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200/60 to-transparent dark:from-slate-600/40"></div>
      </div>
      <div className="space-y-1.5">
        {steps.map((step, index) => (
          <div 
            key={`step-${step.step_number}`} 
            className="group relative animate-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-white/40 dark:border-slate-700/30 hover:bg-white/90 dark:hover:bg-slate-800/70 transition-all duration-200 hover:shadow-sm hover:scale-[1.01]">
              <div className="flex-shrink-0 mt-0.5">
                <div className="relative">
                  <div className={`p-1 rounded-md shadow-sm transition-all duration-200 ${
                    step.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 animate-pulse' :
                    step.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' :
                    step.status === 'failed' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' :
                    'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                  }`}>
                    {getStepIcon(step.step_type, step.status)}
                  </div>
                  {step.status === 'processing' && (
                    <div className="absolute -inset-0.5 bg-blue-400/20 rounded-md animate-pulse"></div>
                  )}
                  {step.status === 'completed' && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-tight">
                    {step.step_number}. {step.title}
                  </span>
                  <div className={`px-1 py-0.5 rounded text-xs font-medium transition-all duration-200 ${
                    step.status === 'processing' ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    step.status === 'completed' ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                    step.status === 'failed' ? 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-slate-100/80 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300'
                  }`}>
                    {step.status === 'processing' && (
                      <div className="flex items-center space-x-0.5">
                        <div className="w-0.5 h-0.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-0.5 h-0.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-0.5 h-0.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    )}
                    {step.status === 'completed' && (
                      <div className="w-0.5 h-0.5 bg-current rounded-full"></div>
                    )}
                    {step.status === 'failed' && (
                      <div className="w-0.5 h-0.5 bg-current rounded-full"></div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-1.5">
                  {step.description}
                </p>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-500">
                    <span className="w-0.5 h-0.5 bg-blue-400 rounded-full"></span>
                    <span className="text-xs">{step.source}</span>
                  </div>
                  {step.processing_time && step.processing_time > 0 && (
                    <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-500">
                      <TimeIcon className="w-2.5 h-2.5" />
                      <span className="text-xs">{step.processing_time.toFixed(1)}s</span>
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

  // Apple-style Professional Typing Indicator for Widget
  const TypingIndicator = () => (
    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/40">
      <div className="flex space-x-1.5">
        <div 
          className="w-1.5 h-1.5 bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400 rounded-full animate-bounce" 
          style={{ 
            animationDelay: '0ms',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
        <div 
          className="w-1.5 h-1.5 bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400 rounded-full animate-bounce" 
          style={{ 
            animationDelay: '0.2s',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
        <div 
          className="w-1.5 h-1.5 bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-400 rounded-full animate-bounce" 
          style={{ 
            animationDelay: '0.4s',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          AI is thinking...
        </span>
        <div className="w-1 h-1 animate-pulse"></div>
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
                    {msg.sender === 'bot' ? (
                      <UserAvatar 
                        name="AI Assistant" 
                        className="flex-shrink-0"
                        size="md"
                      />
                    ) : (
                      <UserAvatar 
                        name="You" 
                        className="flex-shrink-0 order-last"
                        size="md"
                      />
                    )}

                    <span className={`block max-w-[80%] ${msg.sender === 'user' ? 'order-first' : ''}`}>
                      {/* Show reasoning steps if available */}
                      {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                        <div className="mb-2">
                          <ReasoningStepsDisplay steps={msg.reasoningSteps} />
                        </div>
                      )}
                      
                      <div className={`relative px-3 py-2 rounded-2xl shadow-sm transition-all duration-200 ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-br-md shadow-brand-500/20'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-md border border-slate-200/60 dark:border-slate-700/40 backdrop-blur-sm'
                        } ${msg.isStreaming ? 'border-l-2 border-brand-500' : ''}`}>
                        
                        {/* Message tail */}
                        <div className={`absolute top-2 w-1.5 h-1.5 transform rotate-45 ${
                          msg.sender === 'user'
                            ? '-right-0.5 bg-gradient-to-br from-brand-500 to-brand-600'
                            : '-left-0.5 bg-white dark:bg-slate-800 border-l border-b border-slate-200/60 dark:border-slate-700/40'
                        }`}></div>
                        <span className="block text-theme-sm">
                          <div className={`text-sm leading-relaxed ${msg.sender === 'user' ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                            {msg.text ? (
                              <MarkdownRenderer content={msg.text} className={msg.sender === 'user' ? 'text-white' : ''} />
                            ) : null}
                            {msg.isStreaming && (
                              <span className={`inline-block w-2 h-5 ml-1 ${msg.sender === 'user' ? 'bg-white' : 'bg-current'} animate-pulse`}></span>
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
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-300/60 dark:border-slate-600/60 rounded-lg hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
              title="New conversation"
            >
              <EditIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;