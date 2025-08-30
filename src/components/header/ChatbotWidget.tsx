"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { CopilotUIIcon, PaperPlaneIcon } from "@/icons";
import Link from "next/link";
import { websocketService, AIChatMessage, AIChatRequest } from "@/services/websocket";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
  messageId?: string;
  isFinal?: boolean;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm your AI Copilot, ready to help with ERP tasks.",
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Ask me anything about user management, sales, invoicing, or system navigation!",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageRef = useRef<ChatMessage | null>(null);

  // Handle incoming WebSocket messages
  const handleIncomingMessage = useCallback((message: AIChatMessage) => {
    console.log('=== CHATBOT WIDGET: Received AI message ===', message);
    
    if (!message) {
      console.error('Received null or undefined message');
      return;
    }

    if (message.type === 'ai_chat' || message.type === 'ai_stream') {
      console.log('Processing AI message with data:', message.data);
      
      if (!message.data) {
        console.error('Message data is missing', { message });
        return;
      }
      
      const { content = '', isFinal = false, messageId = `msg-${Date.now()}` } = message.data;
      const messageContent = typeof content === 'string' ? content : JSON.stringify(content);
      
      console.log(`Processing message (isFinal: ${isFinal}):`, messageContent);
      
      setMessages(prevMessages => {
        try {
          // If this is a final message or we don't have a current message
          if (isFinal || !currentMessageRef.current) {
            const newMessage = {
              id: messageId,
              text: messageContent,
              sender: 'bot' as const,
              timestamp: new Date(),
              isFinal,
              messageId
            };
            console.log('Creating new message:', newMessage);
            currentMessageRef.current = newMessage;
            return [...prevMessages, newMessage];
          } else {
            // Update existing streaming message
            const updatedMessages = [...prevMessages];
            const messageIndex = updatedMessages.findIndex(m => m.id === currentMessageRef.current?.id);
            
            if (messageIndex !== -1) {
              updatedMessages[messageIndex] = {
                ...updatedMessages[messageIndex],
                text: messageContent,
                isFinal,
                timestamp: new Date()
              };
              console.log('Updating existing message:', updatedMessages[messageIndex]);
              currentMessageRef.current = updatedMessages[messageIndex];
              return updatedMessages;
            } else {
              // Create new message if not found
              const newMessage = {
                id: messageId,
                text: messageContent,
                sender: 'bot' as const,
                timestamp: new Date(),
                isFinal,
                messageId
              };
              console.log('Creating new message (not found in state):', newMessage);
              currentMessageRef.current = newMessage;
              return [...prevMessages, newMessage];
            }
          }
        } catch (error) {
          console.error('Error processing incoming message:', error);
          return prevMessages || [];
        }
      });
      
      if (isFinal) {
        console.log('Final message received, resetting typing state');
        setIsTyping(false);
        currentMessageRef.current = null;
      } else {
        console.log('Streaming message received, setting typing state to true');
        setIsTyping(true);
      }
    }
  }, []);

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
      id: `error-${Date.now()}`,
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
      id: `user-${Date.now()}`,
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
      const messageId = await websocketService.sendChatMessage(message, undefined, {
        user_id: 'current_user',
        department: 'general'
      });
      
      console.log('Message sent with ID:', messageId);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
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
      console.log('=== CHATBOT WIDGET: Received AI message ===', message);
      handleIncomingMessage(message);
    };
    
    const connectListener = () => {
      console.log('=== CHATBOT WIDGET: WebSocket connected, subscribing to ai_chat ===');
      setIsConnected(true);
      setIsTyping(false);
      // Subscribe to AI chat channel when connected
      websocketService.subscribe('ai_chat');
    };
    
    const disconnectListener = () => {
      console.log('=== CHATBOT WIDGET: WebSocket disconnected ===');
      setIsConnected(false);
      setIsTyping(false);
      
      // Show connection status to user
      setMessages(prev => [...prev, {
        id: `status-${Date.now()}`,
        text: 'Disconnected from server. Reconnecting...',
        sender: 'bot',
        timestamp: new Date()
      }]);
    };
    
    const ackListener = (ack: any) => {
      console.log('=== CHATBOT WIDGET: Received acknowledgment ===', ack);
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
          id: `error-${Date.now()}`,
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
          id: `suggestion-${Date.now()}`,
          text: 'Please try logging out and back in to refresh your session.',
          sender: 'bot' as const,
          timestamp: new Date()
        }]);
      }
    };

    // Initialize WebSocket connection
    const initWebSocket = async () => {
      try {
        console.log('=== CHATBOT WIDGET: Initializing WebSocket connection ===');
        
        // Initialize the WebSocket connection first
        await websocketService.initializeConnection();
        
        console.log('=== CHATBOT WIDGET: Adding WebSocket event listeners ===');
        
        // Set up all event listeners
        websocketService.on('ai_message', messageListener);
        websocketService.on('acknowledgment', ackListener);
        websocketService.on('connected', connectListener);
        websocketService.on('disconnected', disconnectListener);
        websocketService.on('error', errorListener);
        
        // Ensure connection is established
        websocketService.ensureConnection();
        
        // Also listen for raw messages for debugging
        websocketService.on('message', (msg: any) => {
          console.log('=== CHATBOT WIDGET: Raw WebSocket message ===', msg);
        });
        
        // Initialize connection if not already connected
        if (!websocketService.isConnected()) {
          console.log('=== CHATBOT WIDGET: Initializing WebSocket connection ===');
          websocketService.shouldConnect = true;
          await websocketService.initializeConnection();
          
          // Check connection status after initialization
          const connected = websocketService.isConnected();
          console.log('WebSocket connection status after initialization:', connected);
          setIsConnected(connected);
          
          if (connected) {
            console.log('WebSocket connected, subscribing to AI chat channel...');
            websocketService.subscribe('ai_chat');
          }
        } else {
          console.log('WebSocket already connected, subscribing to AI chat channel...');
          websocketService.subscribe('ai_chat');
          setIsConnected(true);
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
      console.log('=== CHATBOT WIDGET: Cleaning up WebSocket listeners ===');
      
      // Remove all listeners
      websocketService.off('ai_message', messageListener);
      websocketService.off('acknowledgment', ackListener);
      websocketService.off('connected', connectListener);
      websocketService.off('disconnected', disconnectListener);
      websocketService.off('error', errorListener);
      websocketService.off('message');
      
      // Unsubscribe from the AI chat channel if connected
      if (websocketService.isConnected()) {
        console.log('Unsubscribing from ai_chat channel');
        websocketService.unsubscribe('ai_chat');
      }
      
      // Reset states
      setIsConnected(false);
      setIsTyping(false);
      currentMessageRef.current = null;
      
      console.log('=== CHATBOT WIDGET: WebSocket cleanup complete ===');
    };
  }, [handleIncomingMessage, handleConnectionChange, handleError]);

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
      id: `user-${Date.now()}`,
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
        `session_${Date.now()}`,
        { 
          user_id: 'current_user', // This should be replaced with actual user ID
          department: 'general' 
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add error message to chat
      setMessages(prev => [
        ...prev, 
        {
          id: `error-${Date.now()}`,
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
              {messages.map((msg) => (
                <li key={msg.id}>
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
                      <div className={`px-4 py-2 rounded-2xl ${msg.sender === 'user'
                        ? 'bg-brand-500 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                        } ${msg.isStreaming ? 'border-l-2 border-brand-500' : ''}`}>
                        <span className="block text-theme-sm">
                          {msg.text}
                          {msg.isStreaming && (
                            <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse"></span>
                          )}
                        </span>
                      </div>

                      <span className={`flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                        <span>{formatTime(msg.timestamp)}</span>
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
                          id: `user-${Date.now()}`,
                          text: messageText,
                          sender: 'user' as const,
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, userMessage]);
                        setIsTyping(true);
                        
                        try {
                          await websocketService.sendChatMessage(
                            messageText,
                            `session_${Date.now()}`,
                            { 
                              user_id: 'current_user', 
                              department: 'admin' 
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
                          id: Date.now().toString(),
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
                              `session_${Date.now()}`,
                              { user_id: 'current_user', department: 'sales' }
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
                          id: Date.now().toString(),
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
                              `session_${Date.now()}`,
                              { user_id: 'current_user', department: 'general' }
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
          <Link
            href="/ai/chat"
            className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            Open Full Chat
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;