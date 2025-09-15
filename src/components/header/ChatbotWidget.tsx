'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { websocketService } from '../../services/websocket';
import MarkdownRenderer from '../ui/MarkdownRenderer';
import { 
  ChatIcon, 
  CloseIcon, 
  SendIcon, 
  TimeIcon,
  UserIcon,
  ChatbotIcon,
  CheckCircleIcon,
  ClockUIIcon
} from '../../icons';

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

interface AIChatMessage {
  type: 'chat_message' | 'ai_stream' | 'ai_status' | 'reasoning_step' | 'reasoning_complete' | 'ai_message' | 'final_response' | 'chunk';
  data: {
    content?: string;
    isFinal?: boolean;
    messageId?: string;
    conversationId?: string;
    metadata?: Record<string, any>;
    reasoning_step?: ReasoningStep;
    isChunk?: boolean;
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
    chatbotStreamTimeout?: NodeJS.Timeout;
  }
}

const ChatbotWidget: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());
  const [activeReasoningMessageId, setActiveReasoningMessageId] = useState<string | null>(null);
  const [streamBuffer, setStreamBuffer] = useState<Map<string, string>>(new Map());
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  
  // Hide widget on AI chat page
  const shouldHideWidget = pathname?.includes('/ai/chat');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle incoming WebSocket messages with modern chatbot-style reasoning
  const handleIncomingMessage = useCallback((message: AIChatMessage) => {
    if (!message) return;
    
    const msgId = message.data?.messageId || message.messageId || genId('msg');
    const conversationId = message.data?.conversationId || 'chatbot-widget';
    
    console.log('=== CHATBOT WIDGET MESSAGE ===', message.type, message);
    
    // Handle reasoning steps - Create or update single thinking message
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
      
      console.log('=== REASONING STEP DEBUG ===', {
        messageType: message.type,
        fullMessage: message,
        stepData: step,
        stepTitle: step?.title,
        stepIcon: step?.icon,
        stepNumber: step?.step_number
      });
      
      if (!activeReasoningMessageId) {
        // Remove any existing thinking messages to prevent duplicates
        setMessages(prev => prev.filter(msg => !msg.id.startsWith('thinking-')));
        
        const thinkingMessageId = `thinking-${Date.now()}`;
        setActiveReasoningMessageId(thinkingMessageId);
        setIsThinking(true);
        
        const thinkingMessage: ChatMessage = {
          id: thinkingMessageId,
          text: '',
          sender: 'bot',
          timestamp: new Date(),
          messageId: thinkingMessageId,
          reasoningSteps: [step],
          reasoningPhase: 'thinking',
          showReasoningSteps: true
        };
        
        setMessages(prev => [...prev, thinkingMessage]);
      } else {
        // Update existing thinking message with latest step only (not accumulating)
        setMessages(prev => 
          prev.map(msg => 
            msg.id === activeReasoningMessageId 
              ? { 
                  ...msg, 
                  reasoningSteps: [step] // Only show current step
                }
              : msg
          )
        );
      }
      
      setIsTyping(false);
      return;
    }
    
    // Handle reasoning completion - Hide thinking animation but keep message for streaming
    if (message.type === 'reasoning_complete') {
      console.log('=== CHATBOT: Reasoning complete, hiding thinking animation ===');
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
        setIsThinking(false);
      }
      return;
    }
    
    // Handle streaming chunks - Accumulate content for complete sentences
    if (message.type === 'chunk' && message.data?.content) {
      const content = message.data.content;
      const isComplete = message.data.isFinal || (message.data as any).is_complete;
      
      console.log('=== CHATBOT CHUNK ===', { content, isComplete, activeReasoningMessageId });
      
      console.log('=== CHATBOT CHUNK DEBUG ===', {
        content: `"${content}"`,
        contentLength: content?.length,
        isComplete,
        activeReasoningMessageId
      });
      
      // Hide reasoning steps when streaming starts
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
      
      // Create new streaming message if none exists or use existing one
      let currentStreamId = activeReasoningMessageId;
      
      if (!currentStreamId) {
        currentStreamId = `stream-${Date.now()}`;
        setActiveReasoningMessageId(currentStreamId);
        setIsThinking(false);
        
        const streamMessage: ChatMessage = {
          id: currentStreamId,
          text: content || '',
          sender: 'bot',
          timestamp: new Date(),
          messageId: currentStreamId,
          isStreaming: !isComplete
        };
        
        setMessages(prev => [...prev, streamMessage]);
        setStreamBuffer(prev => new Map(prev.set(currentStreamId!, content || '')));
      } else {
        // Accumulate content in existing message
        setStreamBuffer(prev => {
          const currentBuffer = prev.get(currentStreamId!) || '';
          const newBuffer = currentBuffer + (content || '');
          
          console.log('=== CHATBOT BUFFER UPDATE ===', {
            currentBuffer: `"${currentBuffer}"`,
            newChunk: `"${content}"`,
            newBuffer: `"${newBuffer}"`,
            bufferLength: newBuffer.length,
            streamId: currentStreamId
          });
          
          const updatedBuffer = new Map(prev.set(currentStreamId!, newBuffer));
          
          // Debounce UI updates to batch rapid chunks
          const updateUI = () => {
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                msg.id === currentStreamId 
                  ? {
                      ...msg,
                      text: newBuffer,
                      isStreaming: !isComplete,
                      reasoningPhase: 'complete',
                      showReasoningSteps: false
                    }
                  : msg
              )
            );
          };
          
          if (isComplete) {
            // Final update - show complete response immediately
            updateUI();
            setActiveReasoningMessageId(null);
          } else {
            // Debounce UI updates to batch rapid chunks
            clearTimeout(window.chatbotStreamTimeout);
            window.chatbotStreamTimeout = setTimeout(updateUI, 50);
          }
          
          return updatedBuffer;
        });
      }
      
      setIsThinking(false);
      
      // Complete streaming
      if (isComplete) {
        setStreamBuffer(prev => {
          const newMap = new Map(prev);
          newMap.delete(activeReasoningMessageId || '');
          return newMap;
        });
        setActiveReasoningMessageId(null);
        setIsTyping(false);
      }
      
      return;
    }

    // Handle final AI response
    if (message.type === 'final_response' && message.data?.content) {
      console.log('=== CHATBOT: Processing final response ===', message.data.content);
      
      if (activeReasoningMessageId) {
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
      
      setIsThinking(false);
      setIsTyping(false);
      return;
    }
  }, [activeReasoningMessageId, streamBuffer, processedMessageIds]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initializeWebSocket = async () => {
      try {
        await websocketService.initializeConnection();
        
        // Set up event listeners
        websocketService.on('connected', () => {
          console.log('ChatbotWidget: Connected to WebSocket');
          setIsConnected(true);
        });

        websocketService.on('disconnected', () => {
          console.log('ChatbotWidget: Disconnected from WebSocket');
          setIsConnected(false);
          setIsTyping(false);
        });

        websocketService.on('error', (error) => {
          // Filter out backend heartbeat/ping errors that aren't user-relevant
          if (error?.message && (error.message.includes('PingHandler') || error.message.includes('heartbeat'))) {
            console.warn('ChatbotWidget: Backend heartbeat error (filtered):', error.message);
            return;
          }
          
          // Filter out processing errors that don't require disconnection
          if (error?.message && error.message.includes('Failed to process message')) {
            console.warn('ChatbotWidget: Message processing error (non-critical):', error.message);
            setIsTyping(false);
            return;
          }
          
          console.error('ChatbotWidget: WebSocket error:', error);
          // Don't disconnect on every error - only on connection errors
          if (error?.type === 'connection_error') {
            setIsConnected(false);
          }
          setIsTyping(false);
        });

        websocketService.on('message', handleIncomingMessage);

      } catch (error) {
        console.error('ChatbotWidget: Failed to initialize WebSocket:', error);
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
    };
  }, [handleIncomingMessage]);

  // Initialize conversation with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: genId('welcome'),
        text: "Hi! I'm your AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
      setStreamBuffer(new Map());
      setIsThinking(false);
      
      // Remove any existing thinking/streaming messages
      setMessages(prev => prev.filter(msg => 
        !msg.id.startsWith('thinking-') && 
        !msg.id.startsWith('stream-') && 
        !msg.id.startsWith('response-')
      ));
      
      // Send message via WebSocket
      websocketService.send('chat_message', {
        content: messageText,
        conversationId: 'default'
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

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

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
              className={`transition-opacity duration-300 ease-in-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {steps[currentStep]?.title || 'Processing...'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render reasoning steps - now just for thinking animation
  const ReasoningStepsDisplay: React.FC<{ steps: ReasoningStep[]; phase?: string }> = ({ steps, phase }) => {
    if (!steps || steps.length === 0 || phase !== 'thinking') return null;
    return <ThinkingAnimation steps={steps} />;
  };

  // Don't render widget on AI chat page
  if (shouldHideWidget) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isOpen
              ? 'bg-red-500 hover:bg-red-600 rotate-180'
              : 'bg-brand-500 hover:bg-brand-600 hover:scale-110'
          }`}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? (
            <CloseIcon className="w-6 h-6 text-white" />
          ) : (
            <ChatIcon className="w-6 h-6 text-white" />
          )}
        </button>
        
        {/* Connection indicator */}
        {!isConnected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed bottom-24 right-6 w-96 h-96 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-40 animate-in slide-in-from-bottom-2 duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <ChatbotIcon className="w-5 h-5 text-brand-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h3>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <button
              onClick={toggleWidget}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Bot Avatar */}
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <ChatbotIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                )}
                
                <div className={`${msg.sender === 'user' ? 'order-2 max-w-[85%]' : 'max-w-[90%]'}`}>
                  {/* Render reasoning steps if present and should be shown */}
                  {msg.sender === 'bot' && msg.showReasoningSteps && msg.reasoningPhase === 'thinking' && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-start space-x-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 animate-in fade-in duration-300">
                        <div className="flex-shrink-0 mt-1">
                          <div className="flex items-center space-x-1">
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="text-sm">{msg.reasoningSteps[msg.reasoningSteps.length - 1]?.icon || '🧠'}</span>
                            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                              {msg.reasoningSteps[msg.reasoningSteps.length - 1]?.title || 'Thinking...'}
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
                  
                  {/* Render message content - Show if not in thinking phase */}
                  {msg.text && msg.reasoningPhase !== 'thinking' && (
                    <div className={`px-3 py-2 rounded-xl inline-block ${
                      msg.sender === 'user'
                        ? 'bg-brand-500 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                    }`}>
                      <div className="text-sm leading-relaxed">
                        <MarkdownRenderer content={msg.text} />
                        {msg.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                        )}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <UserIcon className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator - only show when no active reasoning */}
            {isTyping && !isThinking && (
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span>AI is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:text-gray-100"
                disabled={!isConnected || isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || !isConnected || isTyping}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTyping ? <TimeIcon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
