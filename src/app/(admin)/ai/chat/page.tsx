"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import ConversationSidebar from "@/components/ai/ConversationSidebar";
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
  ErrorIcon
} from "@/icons";
import { getWebSocketUrl, getAICopilotUrl } from "@/config/ai-config";
import { websocketService } from "@/services/websocket";
import { conversationService, ConversationSession } from "@/services/conversationService";

interface ReasoningStep {
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

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
  reasoningSteps?: ReasoningStep[];
  reasoningComplete?: boolean;
}

interface AIChatRequest {
  message: string;
  context?: Record<string, string>;
  session_id?: string;
}

interface AIChatResponse {
  response: string;
  message_id: string;
  timestamp: number;
}

interface AIStreamResponse {
  content: string;
  is_final: boolean;
  message_id: string;
}

const AIChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [reasoning, setReasoning] = useState<ReasoningStep[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<ReasoningStep | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [processedMessageIds] = useState<Set<string>>(new Set());
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentReasoningSteps, setCurrentReasoningSteps] = useState<Map<string, ReasoningStep[]>>(new Map());
  const [currentConversation, setCurrentConversation] = useState<ConversationSession | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000;

  // Validate input message
  const validateMessage = (text: string): boolean => {
    const maxLength = 500;
    const invalidChars = /[<>{}]/;
    if (text.length > maxLength) {
      setErrorMessage(`Message is too long (max ${maxLength} characters).`);
      return false;
    }
    if (invalidChars.test(text)) {
      setErrorMessage("Message contains invalid characters (<, >, {, }).");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  // Typewriter effect for AI responses
  const typewriterEffect = useCallback((fullText: string, messageId: string, speed: number = 10) => {
    if (!fullText || typeof fullText !== 'string') {
      return;
    }
    
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    setTypingMessageId(messageId);
    let index = 0;
    
    const typeNextChar = () => {
      if (index < fullText.length) {
        const currentText = fullText.substring(0, index + 1);
        
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, text: currentText, isStreaming: false }
            : msg
        ));
        
        index++;
        typewriterTimeoutRef.current = setTimeout(typeNextChar, speed);
      } else {
        setTypingMessageId(null);
        setIsTyping(false);
        setCurrentStreamingId(null);
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

  // Handle incoming WebSocket messages with reasoning steps support
  const handleIncomingMessage = useCallback((message: any) => {
    if (!message) return;
    
    const messageId = message.message_id || message.data?.message_id || `msg-${Date.now()}`;
    
    if (processedMessageIds.has(messageId)) {
      return;
    }
    
    // Mark message as processed IMMEDIATELY to prevent race conditions
    processedMessageIds.add(messageId);

    // Handle different message types
    const messageType = (message as any).type;
    
    if (messageType === 'reasoning_step') {
      const step = message.step as ReasoningStep;
      setReasoning(prev => [...prev, step]);
      setCurrentStep(step);
      setIsTyping(step.status === 'processing');
    } else if (messageType === 'connection') {
      setIsConnected(message.status === 'connected');
    } else if (messageType === 'chat_complete') {
      setIsTyping(false);
      setCurrentStep(null);
    } else if (messageType === 'ai_response') {
      const conversationId = message.conversation_id || 'current';
      
      const reasoningStep: ReasoningStep = {
        step_number: message.step_number || 0,
        step_type: message.step_type || 'thinking',
        title: message.title || 'Processing...',
        description: message.description || '',
        source: message.source || 'AI System',
        status: message.status || 'processing',
        icon: message.icon || '🤔',
        timestamp: message.timestamp || new Date().toISOString(),
        processing_time: message.processing_time || 0
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
          updatedSteps.sort((a, b) => a.step_number - b.step_number);
        }
        
        const newMap = new Map(prev);
        newMap.set(conversationId, updatedSteps);
        return newMap;
      });
      
    } else if (messageType === 'final_response') {
      // Handle final response with reasoning steps
      const conversationId = (message as any).conversation_id || 'current';
      const steps = currentReasoningSteps.get(conversationId) || [];
      
      const finalMessage: ChatMessage = {
        id: messageId,
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        reasoningSteps: steps.length > 0 ? [...steps] : undefined,
        reasoningComplete: true
      };
      
      setMessages(prev => [...prev, finalMessage]);
      setIsTyping(false);
      
      // Clear reasoning steps for this conversation
      setCurrentReasoningSteps(prev => {
        const newMap = new Map(prev);
        newMap.delete(conversationId);
        return newMap;
      });
      
      // Start typewriter effect for the final response
      const responseContent = (message as any).content || message.data?.response || '';
      if (responseContent) {
        typewriterEffect(responseContent, messageId);
      }
      
    } else {
      // Handle regular messages (fallback)
      if (message.type === 'ai_chat' || message.type === 'chat_response') {
        const response: AIChatResponse = message.type === 'chat_response' 
          ? { response: message.content, message_id: message.message_id, timestamp: message.timestamp }
          : message.data as AIChatResponse;
        
        handleAIChatResponse(response);
        
      } else if (message.type === 'ai_stream') {
        handleAIStreamResponse(message.data as AIStreamResponse);
        
      } else if (message.type === 'ai_status') {
        handleAIStatusResponse(message.data || message);
      }
    }
  }, [typewriterEffect, processedMessageIds, currentReasoningSteps]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: any) => {
    handleIncomingMessage(data);
  }, [handleIncomingMessage]);

  // Handle AI chat response
  const handleAIChatResponse = useCallback((response: AIChatResponse) => {
    if (!response.response || typeof response.response !== 'string' || response.response.trim() === '') {
      console.log('AI Chat Page: Invalid response content, skipping');
      return;
    }
    
    const messageId = response.message_id || `bot-${crypto.randomUUID()}`;
    
    const existingMessage = messages.find(msg => msg.id === messageId);
    if (existingMessage) {
      console.log('AI Chat Page: Message with ID already exists, skipping:', messageId);
      return;
    }
    
    setIsTyping(false);
    setCurrentStreamingId(null);
    
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    setMessages(prev => prev.filter(msg => !msg.isStreaming));
    
    const botMessage: ChatMessage = {
      id: messageId,
      text: '',
      sender: 'bot',
      timestamp: new Date(response.timestamp || Date.now()),
      isStreaming: false,
    };
    
    setMessages(prev => [...prev, botMessage]);
    
    typewriterEffect(response.response, messageId);
  }, [messages, typewriterEffect]);

  // Handle AI stream response
  const handleAIStreamResponse = useCallback((response: AIStreamResponse) => {
    const messageId = response.message_id || `stream-${crypto.randomUUID()}`;
    
    if (response.is_final) {
      if (processedMessageIds.has(messageId)) {
        console.log('AI Chat Page: Final stream message already processed, skipping:', messageId);
        return;
      }
      
      processedMessageIds.add(messageId);
      setIsTyping(false);
      setCurrentStreamingId(null);
      
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
      
      setMessages(prev => {
        const withoutStreaming = prev.filter(msg => !msg.isStreaming);
        const finalMessage: ChatMessage = {
          id: messageId,
          text: '',
          sender: 'bot',
          timestamp: new Date(),
          isStreaming: false,
        };
        return [...withoutStreaming, finalMessage];
      });
      
      typewriterEffect(response.content, messageId);
    } else {
      if (currentStreamingId !== messageId) {
        setCurrentStreamingId(messageId);
        
        setMessages(prev => {
          const withoutStreaming = prev.filter(msg => !msg.isStreaming);
          const streamingMessage: ChatMessage = {
            id: messageId,
            text: response.content,
            sender: 'bot',
            timestamp: new Date(),
            isStreaming: true,
          };
          return [...withoutStreaming, streamingMessage];
        });
      } else {
        setMessages(prev => prev.map(msg => 
          msg.isStreaming && msg.id === messageId
            ? { ...msg, text: msg.text + response.content }
            : msg
        ));
      }
    }
  }, [currentStreamingId, typewriterEffect]);

  // Handle AI status response
  const handleAIStatusResponse = useCallback((status: any) => {
    if (status.status === 'processing') {
      setIsTyping(true);
    } else if (status.status === 'completed') {
      setIsTyping(false);
    }
  }, []);

  // WebSocket connection management with reconnection
  const initializeWebSocket = useCallback(async () => {
    if (isInitializingRef.current) {
      console.log('WebSocket already initializing, skipping...');
      return;
    }
    
    isInitializingRef.current = true;
    
    const tryConnect = async () => {
      try {
        const messageListener = (data: any) => {
          handleWebSocketMessage(data);
        };
        
        const connectListener = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          reconnectAttemptsRef.current = 0;
          websocketService.subscribe('ai_chat');
        };
        
        const disconnectListener = async () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
            console.log(`Attempting to reconnect in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            reconnectAttemptsRef.current++;
            await tryConnect();
          } else {
            console.error('Max reconnection attempts reached');
            setErrorMessage('Unable to connect to AI service. Please try again later.');
          }
        };
        
        const errorListener = (error: any) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };
        
        websocketService.off('ai_message', messageListener);
        websocketService.off('connected', connectListener);
        websocketService.off('disconnected', disconnectListener);
        websocketService.off('error', errorListener);
        
        websocketService.on('ai_message', messageListener);
        websocketService.on('connected', connectListener);
        websocketService.on('disconnected', disconnectListener);
        websocketService.on('error', errorListener);
        
        await websocketService.initializeConnection();
        
        const connected = websocketService.isConnected();
        setIsConnected(connected);
        
        return () => {
          websocketService.off('ai_message', messageListener);
          websocketService.off('connected', connectListener);
          websocketService.off('disconnected', disconnectListener);
          websocketService.off('error', errorListener);
          
          if (websocketService.isConnected()) {
            websocketService.unsubscribe('ai_chat');
          }
        };
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        setIsConnected(false);
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
          console.log(`Attempting to reconnect in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          reconnectAttemptsRef.current++;
          await tryConnect();
        } else {
          console.error('Max reconnection attempts reached');
          setErrorMessage('Unable to connect to AI service. Please try again later.');
        }
      } finally {
        isInitializingRef.current = false;
      }
    };
    
    return tryConnect();
  }, [handleWebSocketMessage]);

  // Send message via WebSocket
  const sendWebSocketMessage = useCallback((messageData: AIChatRequest) => {
    if (websocketService.isConnected()) {
      websocketService.sendChatMessage(
        messageData.message,
        messageData.session_id,
        messageData.context
      );
    } else {
      sendRESTMessage(messageData);
    }
  }, [isConnected]);

  // Fallback REST API call
  const sendRESTMessage = async (messageData: AIChatRequest) => {
    try {
      const aiUrl = getAICopilotUrl();
      const response = await fetch(`${aiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const data: AIChatResponse = await response.json();
        handleAIChatResponse(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to send message via REST:', error);
      setIsTyping(false);
      setErrorMessage('Failed to send message. Please check your connection and try again.');
      
      const errorMessageObj: ChatMessage = {
        id: `error-${crypto.randomUUID()}`,
        text: errorMessage || "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessageObj]);
    }
  };

  // Initialize WebSocket when component mounts
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    const init = async () => {
      cleanup = await initializeWebSocket();
    };
    
    init();
    
    return () => {
      if (cleanup) {
        cleanup();
      }
      isInitializingRef.current = false;
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || isTyping || !validateMessage(inputMessage)) return;
    
    const messageText = inputMessage.trim();
    const userMessageId = `user-${crypto.randomUUID()}`;

    const userMessage: ChatMessage = {
      id: userMessageId,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    const messageData: AIChatRequest = {
      message: messageText,
      context: {
        user_id: 'current_user',
        department: 'admin',
        page: 'ai_chat',
      },
      session_id: sessionId || undefined,
    };

    sendWebSocketMessage(messageData);
  }, [inputMessage, isTyping, sendWebSocketMessage, sessionId]);

  const handleQuickAction = useCallback((action: string) => {
    if (isTyping || !validateMessage(action)) return;
    
    setInputMessage(action);
    setTimeout(() => {
      const userMessageId = `user-${crypto.randomUUID()}`;
      const userMessage: ChatMessage = {
        id: userMessageId,
        text: action,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(true);

      const messageData: AIChatRequest = {
        message: action,
        context: {
          user_id: 'current_user',
          department: 'admin',
          page: 'ai_chat',
        },
        session_id: sessionId || undefined,
      };

      sendWebSocketMessage(messageData);
    }, 100);
  }, [isTyping, sendWebSocketMessage, sessionId]);

  // Create new conversation
  const createNewConversation = useCallback(async () => {
    try {
      setIsLoadingConversation(true);
      const newConversation = await conversationService.createConversation({
        title: `New Chat - ${new Date().toLocaleDateString()}`,
        context: {
          user_id: 'current_user',
          department: 'admin',
          page: 'ai_chat'
        }
      });
      
      setCurrentConversation(newConversation);
      setSessionId(newConversation.conversation_id);
      setMessages([]);
      processedMessageIds.clear();
      setCurrentReasoningSteps(new Map());
      
      // Add welcome message for new conversation
      const welcomeMessage: ChatMessage = {
        id: "welcome-new",
        text: "Hello! I'm your ERP AI Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      processedMessageIds.add("welcome-new");
      
    } catch (error) {
      console.error('Failed to create new conversation:', error);
      setErrorMessage('Failed to create new conversation. Please try again.');
    } finally {
      setIsLoadingConversation(false);
    }
  }, []);

  // Load existing conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    if (conversationId === sessionId) return; // Already loaded
    
    try {
      setIsLoadingConversation(true);
      const { conversation, messages: conversationMessages } = await conversationService.loadConversation(conversationId);
      
      setCurrentConversation(conversation);
      setSessionId(conversation.conversation_id);
      
      // Convert conversation messages to chat messages
      const chatMessages = conversationMessages.map(msg => 
        conversationService.convertTochatMessage(msg)
      );
      
      setMessages(chatMessages);
      processedMessageIds.clear();
      chatMessages.forEach(msg => processedMessageIds.add(msg.id));
      setCurrentReasoningSteps(new Map());
      
    } catch (error) {
      console.error('Failed to load conversation:', error);
      setErrorMessage('Failed to load conversation. Please try again.');
    } finally {
      setIsLoadingConversation(false);
    }
  }, [sessionId]);

  const clearChat = useCallback(() => {
    createNewConversation();
  }, [createNewConversation]);

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

  // Reasoning Steps Display Component
  const ReasoningStepsDisplay = ({ steps }: { steps: ReasoningStep[] }) => (
    <div className="space-y-2 mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <div className="flex items-center space-x-2 mb-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">AI Reasoning Process</span>
      </div>
      {steps.map((step, index) => (
        <div key={`step-${step.step_number}`} className="flex items-start space-x-3 py-1">
          <div className="flex-shrink-0 mt-0.5">
            {getStepIcon(step.step_type, step.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {step.step_number}. {step.title}
              </span>
              {step.status === 'processing' && (
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
              )}
              {step.status === 'completed' && (
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              )}
              {step.status === 'failed' && (
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {step.description}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                📍 {step.source}
              </span>
              {step.processing_time && step.processing_time > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  ⏱️ {step.processing_time.toFixed(2)}s
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Live Reasoning Steps Indicator
  const LiveReasoningIndicator = ({ conversationId }: { conversationId: string }) => {
    const steps = currentReasoningSteps.get(conversationId) || [];
    
    if (steps.length === 0) return null;
    
    return (
      <div className="flex justify-start mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <CopilotUIIcon className="w-4 h-4 text-white" />
        </div>
        <div className="max-w-xs lg:max-w-md">
          <ReasoningStepsDisplay steps={steps} />
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg max-w-xs">
      <div className="flex space-x-1">
        <div 
          className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1.4s', animationIterationCount: 'infinite' }}
        ></div>
        <div 
          className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0.2s', animationDuration: '1.4s', animationIterationCount: 'infinite' }}
        ></div>
        <div 
          className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" 
          style={{ animationDelay: '0.4s', animationDuration: '1.4s', animationIterationCount: 'infinite' }}
        ></div>
      </div>
      <span className="ml-2 text-sm text-brand-600 dark:text-brand-400 font-medium">
        AI is thinking...
      </span>
    </div>
  );

  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2 text-xs" aria-live="polite">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className={isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );

  const quickActions = [
    "Show sales dashboard",
    "Generate inventory report",
    "List overdue invoices",
    "Show top customers",
    "Check cash flow",
    "Schedule meeting"
  ];

  // Initialize with new conversation on mount
  useEffect(() => {
    if (!sessionId) {
      createNewConversation();
    }
  }, [sessionId, createNewConversation]);

  return (
    <div className="flex h-screen">
      <ConversationSidebar
        currentConversationId={sessionId}
        onConversationSelect={loadConversation}
        onNewConversation={createNewConversation}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <PageBreadcrumb pageTitle="AI Copilot" />
        </div>
        
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm mx-6 mb-6 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <CopilotUIIcon className="w-6 h-6 text-brand-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentConversation?.title || 'AI Copilot'}
              </h3>
              {currentConversation && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentConversation.message_count} messages • Created {new Date(currentConversation.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
            <ConnectionStatus />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={clearChat} aria-label="New conversation">New Chat</Button>
          </div>
        </div>

        {isLoadingConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading conversation...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto mb-4 space-y-4" aria-live="polite">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <CopilotUIIcon className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="max-w-xs lg:max-w-md">
                {/* Show reasoning steps if available */}
                {message.reasoningSteps && message.reasoningSteps.length > 0 && (
                  <div className="mb-2">
                    <ReasoningStepsDisplay steps={message.reasoningSteps} />
                  </div>
                )}
                
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  } ${message.isStreaming ? 'border-l-2 border-brand-500' : ''}`}
                  role="log"
                  aria-label={`${message.sender === 'user' ? 'User' : 'AI'} message: ${message.text}`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  {message.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse"></span>
                  )}
                  <div className={`flex items-center justify-between text-xs mt-1 ${
                    message.sender === 'user' ? 'text-brand-100' : 'text-gray-500'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.reasoningSteps && message.reasoningSteps.length > 0 && (
                      <span className="text-blue-500">🧠 {message.reasoningSteps.length} steps</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Show live reasoning steps */}
          <LiveReasoningIndicator conversationId="current" />

          {isTyping && !currentStreamingId && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <CopilotUIIcon className="w-4 h-4 text-white" />
              </div>
              <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Quick action: ${action}`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Ask me anything about your business..."
              className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              disabled={!isConnected || isTyping}
              aria-label="Chat input"
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? "input-error" : undefined}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected || isTyping || !!errorMessage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20"
              aria-label="Send message"
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="rotate-45"
              >
                <path d="m3 3 3 9-3 9 19-9Z"/>
                <path d="m6 12 13 0"/>
              </svg>
            </button>
          </div>
        </div>

        {errorMessage && (
          <p id="input-error" className="text-xs text-red-500 mt-2 text-center" role="alert">
            {errorMessage}-
          </p>
        )}
        {!isConnected && !errorMessage && (
          <p className="text-xs text-red-500 mt-2 text-center" role="alert">
            Connecting to AI service...
          </p>
        )}
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;