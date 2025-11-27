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
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [hasStartedStreaming, setHasStartedStreaming] = useState<boolean>(false);

  // Refs for stable access in callbacks
  const activeMessageIdRef = useRef<string | null>(null);
  const hasStartedStreamingRef = useRef<boolean>(false);
  const isOpenRef = useRef<boolean>(false);
  const isTypingRef = useRef<boolean>(false);

  // New states for enhanced UX
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [showMessagePreview, setShowMessagePreview] = useState(false);
  const [messagePreviewText, setMessagePreviewText] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [hasPlayedWelcomeSound, setHasPlayedWelcomeSound] = useState(false);

  // Hide widget on AI chat page
  const shouldHideWidget = pathname?.includes('/ai/chat');

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync refs with state
  useEffect(() => {
    hasStartedStreamingRef.current = hasStartedStreaming;
  }, [hasStartedStreaming]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Play welcome sound and show bubble on first load
  useEffect(() => {
    if (!hasPlayedWelcomeSound && !shouldHideWidget) {
      const timer = setTimeout(() => {

        // Create beep sound with a proper audio data URI
        const playWelcomeSound = () => {
          try {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);

          } catch (error) {
            // Audio blocked or not supported - this is normal behavior
          }
        };

        // Play sound
        playWelcomeSound();

        // Show welcome bubble
        setShowWelcomeBubble(true);
        setHasPlayedWelcomeSound(true);

        // Hide welcome bubble after 5 seconds
        setTimeout(() => {
          setShowWelcomeBubble(false);
        }, 5000);
      }, 2000); // Show after 2 seconds of page load

      return () => clearTimeout(timer);
    }
  }, [hasPlayedWelcomeSound, shouldHideWidget, pathname]);

  // Handle incoming WebSocket messages with modern chatbot-style reasoning
  // This callback is now stable (no dependencies) to prevent stale closures
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

      // Use ref to check if we already have an active thinking message
      if (!activeMessageIdRef.current) {
        // Remove any existing thinking messages to prevent duplicates
        setMessages(prev => prev.filter(msg => !msg.id.startsWith('thinking-')));

        const thinkingMessageId = `thinking-${Date.now()}`;

        // Update both state and ref
        setActiveReasoningMessageId(thinkingMessageId);
        activeMessageIdRef.current = thinkingMessageId;
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
            msg.id === activeMessageIdRef.current
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
      if (activeMessageIdRef.current) {
        const currentId = activeMessageIdRef.current;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === currentId
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

    // Handle streaming chunks - Accumulate all chunks and display complete message
    if (message.type === 'chunk' && message.data?.content) {
      const content = message.data.content;
      const isComplete = message.data.isFinal || (message.data as any).is_complete;

      console.log('=== CHATBOT CHUNK ===', { content, isComplete, hasStartedStreaming: hasStartedStreamingRef.current, activeId: activeMessageIdRef.current });

      // Mark that streaming has started and hide reasoning steps immediately
      if (!hasStartedStreamingRef.current) {
        setHasStartedStreaming(true);
        hasStartedStreamingRef.current = true;

        // Clear the old thinking message ID since we're starting fresh
        const oldThinkingId = activeMessageIdRef.current;
        activeMessageIdRef.current = null;
        setActiveReasoningMessageId(null);

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

        setIsThinking(false);

        console.log('=== CHATBOT: Cleared thinking message ===', { oldThinkingId });
      }

      // Use existing stream ID or create new one
      let currentStreamId = activeMessageIdRef.current;

      if (!currentStreamId) {
        currentStreamId = `stream-${Date.now()}`;
        setActiveReasoningMessageId(currentStreamId);
        activeMessageIdRef.current = currentStreamId;

        // Create initial message with loading state
        const streamMessage: ChatMessage = {
          id: currentStreamId,
          text: content || '', // Start with first chunk
          sender: 'bot',
          timestamp: new Date(),
          messageId: currentStreamId,
          isStreaming: !isComplete,
          reasoningPhase: 'hidden',
          showReasoningSteps: false
        };

        setMessages(prev => [...prev, streamMessage]);
        console.log('=== CHATBOT: Created new stream message ===', { id: currentStreamId, firstChunk: content });
      } else {
        // Accumulate content into existing message
        setMessages(prevMessages => {
          return prevMessages.map(msg => {
            if (msg.id === currentStreamId) {
              const accumulatedText = (msg.text || '') + (content || '');
              console.log('=== CHATBOT: Accumulating chunk ===', { id: currentStreamId, chunk: content, total: accumulatedText });
              return {
                ...msg,
                text: accumulatedText,
                isStreaming: !isComplete,
                reasoningPhase: 'hidden',
                showReasoningSteps: false
              };
            }
            return msg;
          });
        });
      }

      // Handle completion - process accumulated text with markdown
      if (isComplete) {
        console.log('=== CHATBOT: Stream complete, processing with markdown ===');

        setMessages(prevMessages => {
          return prevMessages.map(msg => {
            if (msg.id === currentStreamId) {
              // Process the complete accumulated text
              const finalText = msg.text || '';
              return {
                ...msg,
                text: finalText,
                isStreaming: false,
                reasoningPhase: 'hidden',
                showReasoningSteps: false
              };
            }
            return msg;
          });
        });

        setActiveReasoningMessageId(null);
        activeMessageIdRef.current = null;
        setHasStartedStreaming(false);
        hasStartedStreamingRef.current = false;
        setIsTyping(false);

        // Show message preview if widget is closed
        if (!isOpenRef.current && currentStreamId) {
          setMessages(prevMessages => {
            const finalMessage = prevMessages.find(msg => msg.id === currentStreamId);
            const finalText = finalMessage?.text || '';
            if (finalText) {
              const previewText = finalText.substring(0, 30) + (finalText.length > 30 ? '...' : '');
              setMessagePreviewText(previewText);
              setShowMessagePreview(true);
              setHasNewMessage(true);

              // Hide preview after 4 seconds
              setTimeout(() => {
                setShowMessagePreview(false);
              }, 4000);
            }
            return prevMessages;
          });
        }
      }

      return;
    }

    // Handle final AI response - Only process if streaming hasn't started
    if (message.type === 'final_response' && message.data?.content && !hasStartedStreamingRef.current) {
      console.log('=== CHATBOT: Processing final response ===', message.data.content);

      const responseText = message.data.content || '';

      if (activeMessageIdRef.current) {
        const currentId = activeMessageIdRef.current;
        // Replace reasoning message with final response and hide thinking
        setMessages(prev =>
          prev.map(msg =>
            msg.id === currentId
              ? {
                ...msg,
                text: responseText,
                reasoningPhase: 'hidden',
                showReasoningSteps: false,
                reasoningSteps: undefined,
                isStreaming: false
              }
              : msg
          )
        );
        setActiveReasoningMessageId(null);
        activeMessageIdRef.current = null;
      } else {
        // Create new message if no reasoning was shown
        const aiMessage: ChatMessage = {
          id: msgId,
          text: responseText,
          sender: 'bot',
          timestamp: new Date(),
          messageId: msgId
        };

        setMessages(prev => [...prev, aiMessage]);
      }

      // Show message preview if widget is closed
      if (!isOpenRef.current && responseText) {
        const previewText = responseText.substring(0, 30) + (responseText.length > 30 ? '...' : '');
        setMessagePreviewText(previewText);
        setShowMessagePreview(true);
        setHasNewMessage(true);

        // Hide preview after 4 seconds
        setTimeout(() => {
          setShowMessagePreview(false);
        }, 4000);
      }

      setIsThinking(false);
      setIsTyping(false);
      return;
    }
  }, []); // No dependencies needed thanks to refs!

  // Initialize WebSocket connection - Run once
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initializeWebSocket = async () => {
      try {
        await websocketService.initializeConnection();
      } catch (error) {
        console.error('ChatbotWidget: Failed to initialize WebSocket:', error);
        setIsConnected(false);
      }
    };

    initializeWebSocket();
  }, []);

  // Set up WebSocket listeners - Run once (handler is stable)
  useEffect(() => {
    // Set up event listeners
    const onConnected = () => {
      console.log('ChatbotWidget: Connected to WebSocket');
      setIsConnected(true);
    };

    const onDisconnected = () => {
      console.log('ChatbotWidget: Disconnected from WebSocket');
      setIsConnected(false);
      setIsTyping(false);
    };

    const onError = (error: any) => {
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
    };

    websocketService.on('connected', onConnected);
    websocketService.on('disconnected', onDisconnected);
    websocketService.on('error', onError);
    websocketService.on('message', handleIncomingMessage);

    // Cleanup on unmount
    return () => {
      websocketService.off('connected', onConnected);
      websocketService.off('disconnected', onDisconnected);
      websocketService.off('error', onError);
      websocketService.off('message', handleIncomingMessage);
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
      activeMessageIdRef.current = null;
      setIsThinking(false);
      setHasStartedStreaming(false);
      hasStartedStreamingRef.current = false;

      // Only remove thinking/reasoning messages, keep completed messages
      setMessages(prev => prev.filter(msg => {
        const shouldRemove = (
          (msg.reasoningPhase === 'thinking' && msg.showReasoningSteps === true) ||
          (msg.id.startsWith('reasoning-') && msg.reasoningPhase === 'thinking') ||
          (msg.id.startsWith('thinking-') && msg.reasoningPhase === 'thinking')
        );
        return !shouldRemove;
      }));

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

    // Clear new message indicator when opening
    if (!isOpen) {
      setHasNewMessage(false);
      setShowWelcomeBubble(false);
      setShowMessagePreview(false);
    }
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

  // Render reasoning steps - now just for thinking animation
  const ReasoningStepsDisplay: React.FC<{ steps: ReasoningStep[]; phase?: string }> = ({ steps, phase }) => {
    if (!steps || steps.length === 0 || phase !== 'thinking') return null;
    return <ThinkingAnimation steps={steps} />;
  };

  // Don't render widget on AI chat page
  if (shouldHideWidget) {
    return null;
  }

  // Debug: Uncomment for troubleshooting
  // console.log('ChatbotWidget: Rendering widget', { isOpen, showWelcomeBubble, hasPlayedWelcomeSound });

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleWidget}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center relative ${isOpen
            ? 'bg-gray-500 hover:bg-gray-600'
            : 'bg-brand-500 hover:bg-brand-600 hover:scale-110'
            }`}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? (
            <CloseIcon className="w-6 h-6 text-white" />
          ) : (
            <ChatbotIcon className="w-6 h-6 text-white" />
          )}
        </button>

        {/* New Message Badge */}
        {hasNewMessage && !isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}

        {/* Connection indicator */}
        {!isConnected && !hasNewMessage && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Welcome Bubble */}
      {showWelcomeBubble && !isOpen && (
        <div
          onClick={toggleWidget}
          className="fixed bottom-24 right-20 max-w-xs bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-[60] animate-pulse cursor-pointer hover:shadow-2xl transition-shadow duration-200"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
              <ChatbotIcon className="w-4 h-4 text-brand-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                AI Copilot
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hi, I am your AI Copilot, click to Chat!
              </div>
            </div>
          </div>
          {/* Speech bubble arrow */}
          <div className="absolute bottom-4 -right-2 w-0 h-0 border-l-8 border-l-white dark:border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}

      {/* Message Preview Bubble */}
      {showMessagePreview && !isOpen && (
        <div
          onClick={toggleWidget}
          className="fixed bottom-24 right-20 max-w-xs bg-blue-50 dark:bg-blue-900/30 rounded-lg shadow-lg border border-blue-200 dark:border-blue-700 p-3 z-50 animate-in slide-in-from-right-2 duration-300 cursor-pointer hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-start space-x-2">
            <ChatbotIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {messagePreviewText}
            </div>
          </div>
          {/* Speech bubble arrow */}
          <div className="absolute bottom-3 -right-2 w-0 h-0 border-l-8 border-l-blue-50 dark:border-l-blue-900/30 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[32rem] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-40 animate-in slide-in-from-bottom-2 duration-300 sm:w-96 sm:h-[32rem]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <ChatbotIcon className="w-5 h-5 text-brand-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Assistant</h3>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <button
              onClick={toggleWidget}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
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
                    <div className={`px-4 py-3 rounded-xl inline-block max-w-full ${msg.sender === 'user'
                      ? 'bg-brand-500 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700'
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
                      <div className="text-xs opacity-70 mt-2">
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
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <ChatbotIcon className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl rounded-bl-md">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions - Show when conversation is empty or just welcome message */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 mt-2">Quick Actions</div>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { text: "Sales dashboard", icon: "📊" },
                  { text: "Overdue invoices", icon: "💰" },
                  { text: "Inventory status", icon: "📦" },
                  { text: "ERP features", icon: "🏗️" }
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMessage(`Show ${action.text.toLowerCase()}`);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    disabled={!isConnected || isTyping}
                    className="flex items-center space-x-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xs">{action.icon}</span>
                    <span className="truncate text-xs">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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