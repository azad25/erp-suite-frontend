"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { CopilotUIIcon, PaperPlaneIcon } from "@/icons";
import { getWebSocketUrl, getAICopilotUrl } from "@/config/ai-config";

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
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl();
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connected to AI Copilot');
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected from AI Copilot');
        setIsConnected(false);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      setWs(socket);
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setIsConnected(false);
    }
  }, []);

  const disconnectWebSocket = useCallback(() => {
    if (ws) {
      ws.close();
      setWs(null);
      setIsConnected(false);
    }
  }, [ws]);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'ai_chat':
        handleAIChatResponse(data.data as AIChatResponse);
        break;
      case 'ai_stream':
        handleAIStreamResponse(data.data as AIStreamResponse);
        break;
      case 'ai_status':
        handleAIStatusResponse(data.data);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  // Handle AI chat response
  const handleAIChatResponse = useCallback((response: AIChatResponse) => {
    const botMessage: ChatMessage = {
      id: response.message_id || Date.now().toString(),
      text: response.response,
      sender: 'bot',
      timestamp: new Date(response.timestamp),
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  }, []);

  // Handle AI stream response
  const handleAIStreamResponse = useCallback((response: AIStreamResponse) => {
    if (response.is_final) {
      // Final message, update the streaming message
      setMessages(prev => prev.map(msg => 
        msg.isStreaming ? { ...msg, text: response.content, isStreaming: false } : msg
      ));
      setIsTyping(false);
    } else {
      // Streaming content, update or create streaming message
      setMessages(prev => {
        const existingStreaming = prev.find(msg => msg.isStreaming);
        if (existingStreaming) {
          return prev.map(msg => 
            msg.isStreaming ? { ...msg, text: response.content } : msg
          );
        } else {
          const streamingMessage: ChatMessage = {
            id: response.message_id || Date.now().toString(),
            text: response.content,
            sender: 'bot',
            timestamp: new Date(),
            isStreaming: true,
          };
          return [...prev, streamingMessage];
        }
      });
    }
  }, []);

  // Handle AI status response
  const handleAIStatusResponse = useCallback((status: any) => {
    if (status.status === 'processing') {
      setIsTyping(true);
    } else if (status.status === 'completed') {
      setIsTyping(false);
    }
  }, []);

  // Send message via WebSocket
  const sendWebSocketMessage = useCallback((messageData: AIChatRequest) => {
    if (ws && isConnected) {
      const wsMessage = {
        type: 'ai_chat',
        data: messageData,
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(wsMessage));
    } else {
      // Fallback to REST API if WebSocket not available
      sendRESTMessage(messageData);
    }
  }, [ws, isConnected]);

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

  // Connect WebSocket when component mounts
  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, [connectWebSocket, disconnectWebSocket]);

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
    if (!inputMessage.trim() || !isConnected) return;

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

  // Enhanced Typing Indicator with Dot Animation
  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">AI is thinking...</span>
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
          {messages.map((message) => (
            <div
              key={message.id}
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