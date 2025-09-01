"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { CopilotUIIcon } from "@/icons";
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
      id: "welcome-1",
      text: "# Welcome to Your ERP Query Assistant\n\nHello! I'm your **ERP Query Assistant**, here to streamline your interaction with your enterprise resource planning (ERP) system. I can retrieve, analyze, and present data to help you make informed decisions.\n\n## 📋 What I Can Do\n- **🔍 Data Retrieval**: Translate your questions into database queries to extract data from ERP modules.\n- **📊 Data Analysis**: Identify trends, patterns, and KPIs.\n- **📈 Report Generation**: Create clear reports with visualizations (tables, charts).\n- **💡 Insight Generation**: Provide actionable insights and recommendations.",
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: "welcome-2",
      text: "## 🛠️ Specific Tasks I Can Help With\n\n### 📦 Inventory\n- Check stock levels for products or categories.\n- Track product movements (inbound/outbound).\n- Identify slow-moving or obsolete inventory.\n- Generate reorder alerts.\n- Provide supplier performance metrics.\n\n### 💰 Sales\n- Retrieve order history by customer or time period.\n- Analyze sales trends by product, region, or representative.\n- Calculate revenue, profit margins, and growth.\n- Identify top products and customers.\n- Provide customer segmentation.\n\n### 📒 Finance\n- Retrieve transactions and account balances.\n- Generate financial statements (P&L, balance sheets, cash flow).\n- Compare budget vs. actual performance.\n- Track expenses and identify savings.\n- Provide financial KPIs.\n\n### 👥 HR\n- Access employee data (contact info, job titles, departments).\n- Analyze payroll and generate reports.\n- Track attendance and time off.\n- Monitor performance metrics.\n- Identify training needs.\n\n### 🏭 Production\n- Retrieve manufacturing schedules and orders.\n- Track resource utilization.\n- Monitor quality control metrics.\n- Analyze production costs.\n- Provide efficiency insights.\n\n## 🌟 Example Queries\n- \"What are the current stock levels for all iPhone 14 models?\"\n- \"Show sales trends for Q3 by region.\"\n- \"What were our marketing expenses last fiscal year?\"\n- \"Which employees have performance reviews due next month?\"\n- \"What is the production schedule for product X?\"\n\n**How to Ask**: Use natural language and be specific (e.g., \"Total sales for July in North America\" rather than \"What are our sales?\").",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [processedMessageIds] = useState<Set<string>>(new Set(['welcome-1', 'welcome-2']));
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);
  const [sessionId] = useState<string>(`session_${crypto.randomUUID()}`);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  const typewriterEffect = useCallback((fullText: string, messageId: string, speed: number = 30) => {
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

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: any) => {
    const messageId = data.message_id || data.data?.message_id;
    
    if (messageId && processedMessageIds.has(messageId)) {
      console.log('AI Chat Page: Duplicate message detected, skipping:', messageId);
      return;
    }

    if (data.type === 'ai_chat' || data.type === 'chat_response') {
      const response: AIChatResponse = data.type === 'chat_response' 
        ? { response: data.content, message_id: data.message_id, timestamp: data.timestamp }
        : data.data as AIChatResponse;
      
      if (messageId) {
        processedMessageIds.add(messageId);
      }
      handleAIChatResponse(response);
      
    } else if (data.type === 'ai_stream') {
      handleAIStreamResponse(data.data as AIStreamResponse);
      
    } else if (data.type === 'ai_status') {
      handleAIStatusResponse(data.data || data);
    }
  }, []);

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
      session_id: sessionId,
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
        session_id: sessionId,
      };

      sendWebSocketMessage(messageData);
    }, 100);
  }, [isTyping, sendWebSocketMessage, sessionId]);

  const clearChat = useCallback(() => {
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
    }
    
    setIsTyping(false);
    setTypingMessageId(null);
    setCurrentStreamingId(null);
    setErrorMessage(null);
    processedMessageIds.clear();
    processedMessageIds.add('welcome-1');
    processedMessageIds.add('welcome-2');
    
    setMessages([
      {
        id: "welcome-1",
        text: "# Welcome to Your ERP Query Assistant\n\nHello! I'm your **ERP Query Assistant**, here to streamline your interaction with your enterprise resource planning (ERP) system. I can retrieve, analyze, and present data to help you make informed decisions.\n\n## 📋 What I Can Do\n- **🔍 Data Retrieval**: Translate your questions into database queries to extract data from ERP modules.\n- **📊 Data Analysis**: Identify trends, patterns, and KPIs.\n- **📈 Report Generation**: Create clear reports with visualizations (tables, charts).\n- **💡 Insight Generation**: Provide actionable insights and recommendations.",
        sender: 'bot',
        timestamp: new Date(),
      },
      {
        id: "welcome-2",
        text: "## 🛠️ Specific Tasks I Can Help With\n\n### 📦 Inventory\n- Check stock levels for products or categories.\n- Track product movements (inbound/outbound).\n- Identify slow-moving or obsolete inventory.\n- Generate reorder alerts.\n- Provide supplier performance metrics.\n\n### 💰 Sales\n- Retrieve order history by customer or time period.\n- Analyze sales trends by product, region, or representative.\n- Calculate revenue, profit margins, and growth.\n- Identify top products and customers.\n- Provide customer segmentation.\n\n### 📒 Finance\n- Retrieve transactions and account balances.\n- Generate financial statements (P&L, balance sheets, cash flow).\n- Compare budget vs. actual performance.\n- Track expenses and identify savings.\n- Provide financial KPIs.\n\n### 👥 HR\n- Access employee data (contact info, job titles, departments).\n- Analyze payroll and generate reports.\n- Track attendance and time off.\n- Monitor performance metrics.\n- Identify training needs.\n\n### 🏭 Production\n- Retrieve manufacturing schedules and orders.\n- Track resource utilization.\n- Monitor quality control metrics.\n- Analyze production costs.\n- Provide efficiency insights.\n\n## 🌟 Example Queries\n- \"What are the current stock levels for all iPhone 14 models?\"\n- \"Show sales trends for Q3 by region.\"\n- \"What were our marketing expenses last fiscal year?\"\n- \"Which employees have performance reviews due next month?\"\n- \"What is the production schedule for product X?\"\n\n**How to Ask**: Use natural language and be specific (e.g., \"Total sales for July in North America\" rather than \"What are our sales?\").",
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
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
          <Button variant="outline" onClick={clearChat} aria-label="Clear chat history">Clear Chat</Button>
        </div>

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
              
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
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
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-brand-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

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
            {errorMessage}
          </p>
        )}
        {!isConnected && !errorMessage && (
          <p className="text-xs text-red-500 mt-2 text-center" role="alert">
            Connecting to AI service...
          </p>
        )}
      </div>
    </div>
  );
};

export default AIChatPage;