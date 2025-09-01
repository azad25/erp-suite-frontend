"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { CopilotUIIcon, PaperPlaneIcon } from "@/icons";
import { getWebSocketUrl, getAICopilotUrl } from "@/config/ai-config";
import { websocketService } from "@/services/websocket";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm your ERP AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "I can help you with:\n• Sales reports and analytics\n• Inventory management\n• Financial insights\n• User management\n• Process automation\n\nWhat would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect for AI responses
  const typewriterEffect = useCallback((fullText: string, messageId: string, speed: number = 30) => {
    if (!fullText || typeof fullText !== 'string') {
      return;
    }
    
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

  // WebSocket connection management using the shared service
  const initializeWebSocket = useCallback(async () => {
    try {
      
      // Set up event listeners
      const messageListener = (data: any) => {
        handleWebSocketMessage(data);
      };
      
      const connectListener = () => {
        setIsConnected(true);
      };
      
      const disconnectListener = () => {
        setIsConnected(false);
      };
      
      const errorListener = (error: any) => {
        setIsConnected(false);
      };
      
      // Add event listeners (only ai_message to avoid duplicates)
      websocketService.on('ai_message', messageListener);
      websocketService.on('connected', connectListener);
      websocketService.on('disconnected', disconnectListener);
      websocketService.on('error', errorListener);
      
      // Initialize connection
      await websocketService.initializeConnection();
      
      // Check connection status
      const connected = websocketService.isConnected();
      setIsConnected(connected);
      
      if (connected) {
        // Force subscription for AI chat page
        websocketService.subscribe('ai_chat');
      }
      
      return () => {
        // Cleanup listeners
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
    }
  }, []);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: any) => {
    console.log('AI Chat Page: Received WebSocket message:', data);
    
    // Clear typing indicator for any incoming message
    setIsTyping(false);
    
    // Handle different message formats
    if (data.type === 'ai_chat' || data.type === 'ai_stream' || data.type === 'chat_response') {
      // Prioritize data wrapper format to avoid double processing
      if (data.data) {
        // Message with data wrapper
        switch (data.type) {
          case 'ai_chat':
          case 'chat_response':
            handleAIChatResponse(data.data as AIChatResponse);
            break;
          case 'ai_stream':
            handleAIStreamResponse(data.data as AIStreamResponse);
            break;
        }
      } else if (!data.data) {
        // Only process direct format if no data wrapper exists
        let responseText = data.content || data.response || data.message || data.text;
        
        if (responseText && typeof responseText === 'string' && responseText.trim() !== '') {
          const response: AIChatResponse = {
            response: responseText,
            message_id: data.message_id || data.id || Date.now().toString(),
            timestamp: data.timestamp || Date.now()
          };
          handleAIChatResponse(response);
        }
      }
    } else if (data.type === 'ai_status') {
      handleAIStatusResponse(data.data || data);
    }
  }, []);

  // Handle AI chat response
  const handleAIChatResponse = useCallback((response: AIChatResponse) => {
    console.log('AI Chat Page: Processing chat response:', response);
    const messageId = response.message_id || Date.now().toString();
    
    // Check if we've already processed this message
    if (processedMessageIds.has(messageId)) {
      console.log('AI Chat Page: Message already processed, skipping:', messageId);
      return;
    }
    
    // Validate response content
    if (!response.response || typeof response.response !== 'string' || response.response.trim() === '') {
      console.log('AI Chat Page: Invalid response content, skipping:', response);
      return; // Don't create empty messages
    }
    
    console.log('AI Chat Page: Creating bot message with ID:', messageId);
    
    // Mark message as processed IMMEDIATELY
    setProcessedMessageIds(prev => new Set([...prev, messageId]));
    
    // Clear any existing typewriter effect
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    const botMessage: ChatMessage = {
      id: messageId,
      text: '', // Start with empty text
      sender: 'bot',
      timestamp: new Date(response.timestamp || Date.now()),
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false); // Stop the "thinking" indicator
    
    // Start typewriter effect
    typewriterEffect(response.response, messageId);
  }, [typewriterEffect, processedMessageIds]);

  // Handle AI stream response
  const handleAIStreamResponse = useCallback((response: AIStreamResponse) => {
    const messageId = response.message_id || Date.now().toString();
    
    if (response.is_final) {
      // Check if we've already processed this final message
      if (processedMessageIds.has(messageId)) {
        console.log('AI Chat Page: Final stream message already processed, skipping:', messageId);
        return;
      }
      
      // Mark message as processed
      setProcessedMessageIds(prev => new Set([...prev, messageId]));
      
      // Clear any existing typewriter effect
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
      
      // Final message, use typewriter effect
      const existingStreaming = messages.find(msg => msg.isStreaming);
      
      if (existingStreaming) {
        // Update existing streaming message with typewriter effect
        setMessages(prev => prev.map(msg => 
          msg.isStreaming ? { ...msg, text: '', isStreaming: false, id: messageId } : msg
        ));
        typewriterEffect(response.content, messageId);
      } else {
        // Create new message with typewriter effect
        const finalMessage: ChatMessage = {
          id: messageId,
          text: '',
          sender: 'bot',
          timestamp: new Date(),
          isStreaming: false,
        };
        setMessages(prev => [...prev, finalMessage]);
        typewriterEffect(response.content, messageId);
      }
      setIsTyping(false);
    } else {
      // Streaming content, update or create streaming message (no typewriter for streaming)
      // Don't use deduplication for streaming messages as they update continuously
      setMessages(prev => {
        const existingStreaming = prev.find(msg => msg.isStreaming);
        if (existingStreaming) {
          return prev.map(msg => 
            msg.isStreaming ? { ...msg, text: response.content } : msg
          );
        } else {
          const streamingMessage: ChatMessage = {
            id: messageId,
            text: response.content,
            sender: 'bot',
            timestamp: new Date(),
            isStreaming: true,
          };
          return [...prev, streamingMessage];
        }
      });
    }
  }, [messages, typewriterEffect, processedMessageIds]);

  // Handle AI status response
  const handleAIStatusResponse = useCallback((status: any) => {
    if (status.status === 'processing') {
      setIsTyping(true);
    } else if (status.status === 'completed') {
      setIsTyping(false);
    }
  }, []);

  // Send message via WebSocket using the shared service
  const sendWebSocketMessage = useCallback((messageData: AIChatRequest) => {
    if (websocketService.isConnected()) {
      // Use the WebSocket service's sendChatMessage method for consistency
      const messageId = websocketService.sendChatMessage(
        messageData.message,
        messageData.session_id,
        messageData.context
      );
    } else {
      // Fallback to REST API if WebSocket not available
      sendRESTMessage(messageData);
    }
  }, [isConnected]);

  // Fallback REST API call via API Gateway
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
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send message via REST:', error);
      // Show error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
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
    };
  }, [initializeWebSocket]);

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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Check if WebSocket is connected, if not try to send via REST
    if (!isConnected && !websocketService.isConnected()) {
      console.log('WebSocket not connected, using REST API fallback');
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Send message via WebSocket or REST
    const messageData: AIChatRequest = {
      message: inputMessage.trim(),
      context: {
        user_id: 'current_user', // This should come from auth context
        department: 'admin',
        page: 'ai_chat',
      },
      session_id: `session_${Date.now()}`,
    };

    sendWebSocketMessage(messageData);
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    // Auto-send quick actions
    setTimeout(() => {
      if (action === inputMessage) {
        handleSendMessage();
      }
    }, 100);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your ERP AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
      {
        id: "2",
        text: "I can help you with:\n• Sales reports and analytics\n• Inventory management\n• Financial insights\n• User management\n• Process automation\n\nWhat would you like to know?",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Enhanced Typing Indicator with Smooth Dot Animation
  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg max-w-xs">
      <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mr-1">
        <CopilotUIIcon className="w-4 h-4 text-white" />
      </div>
      <div className="flex space-x-1">
        <div 
          className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" 
          style={{ 
            animationDelay: '0ms',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
        <div 
          className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" 
          style={{ 
            animationDelay: '0.2s',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
        <div 
          className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" 
          style={{ 
            animationDelay: '0.4s',
            animationDuration: '1.4s',
            animationIterationCount: 'infinite'
          }}
        ></div>
      </div>
      <span className="ml-2 text-sm text-brand-600 dark:text-brand-400 font-medium">
        AI is thinking...
      </span>
    </div>
  );

  // Connection Status Indicator
  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2 text-xs">
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

  return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="AI Chat Assistant" />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-[calc(100vh-200px)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <CopilotUIIcon className="w-6 h-6 text-brand-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h3>
            <ConnectionStatus />
          </div>
          <Button variant="outline" onClick={clearChat}>Clear Chat</Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mr-3">
                  <CopilotUIIcon className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                } ${message.isStreaming ? 'border-l-2 border-brand-500' : ''}`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse"></span>
                )}
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-brand-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mr-3">
                <CopilotUIIcon className="w-4 h-4 text-white" />
              </div>
              <TypingIndicator />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your business..."
              className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
              disabled={!isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || !isConnected}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20"
            >
              <PaperPlaneIcon className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || !isConnected}>
            Send
          </Button>
        </div>

        {!isConnected && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Connecting to AI service...
          </p>
        )}
      </div>
    </div>
  );
};

export default AIChatPage;