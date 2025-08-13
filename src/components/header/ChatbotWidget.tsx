"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChatbotIcon, PaperPlaneIcon } from "@/icons";
import Link from "next/link";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm HelpBot, and I'll help you navigate Unibase today.",
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "What would you like help with?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I understand you need help with that. Let me assist you with the best solution for your needs.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChatbot}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        aria-label="Open Chatbot"
      >
        <ChatbotIcon width="20" height="20" />
        <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-green-400">
          <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
        </span>
      </button>

      {/* Chatbot Dropdown */}
      {isOpen && (
        <div className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              HelpBot from Unibase
            </h5>
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

          {/* Chat Messages */}
          <div className="flex flex-col h-auto overflow-y-auto custom-scrollbar flex-1">
            <ul className="flex flex-col space-y-3 p-2">
              {messages.map((msg) => (
                <li key={msg.id}>
                  <div className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'bot' && (
                      <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                        <div className="w-full h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                          <ChatbotIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-green-400 dark:border-gray-900"></span>
                      </span>
                    )}

                    <span className={`block max-w-[80%] ${msg.sender === 'user' ? 'order-first' : ''}`}>
                      <div className={`px-4 py-2 rounded-2xl ${msg.sender === 'user'
                        ? 'bg-brand-500 text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                        }`}>
                        <span className="block text-theme-sm">
                          {msg.text}
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
                      onClick={() => {
                        const userMessage: ChatMessage = {
                          id: Date.now().toString(),
                          text: "Help with user management and permissions",
                          sender: 'user',
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, userMessage]);
                        setIsTyping(true);
                        setTimeout(() => {
                          const botMessage: ChatMessage = {
                            id: (Date.now() + 1).toString(),
                            text: "I'd be happy to help you with user management! What specific area would you like assistance with?",
                            sender: 'bot',
                            timestamp: new Date(),
                          };
                          setMessages(prev => [...prev, botMessage]);
                          setIsTyping(false);
                        }, 1500);
                      }}
                      className="w-full text-left p-3 border border-brand-200 dark:border-brand-700 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors text-sm text-brand-600 dark:text-brand-400"
                    >
                      Help with user management and permissions
                    </button>
                    <button
                      onClick={() => {
                        const userMessage: ChatMessage = {
                          id: Date.now().toString(),
                          text: "Questions about sales and invoicing",
                          sender: 'user',
                          timestamp: new Date(),
                        };
                        setMessages(prev => [...prev, userMessage]);
                        setIsTyping(true);
                        setTimeout(() => {
                          const botMessage: ChatMessage = {
                            id: (Date.now() + 1).toString(),
                            text: "I can help you with sales processes, invoicing, and payment tracking. What would you like to know?",
                            sender: 'bot',
                            timestamp: new Date(),
                          };
                          setMessages(prev => [...prev, botMessage]);
                          setIsTyping(false);
                        }, 1500);
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
                        setTimeout(() => {
                          const botMessage: ChatMessage = {
                            id: (Date.now() + 1).toString(),
                            text: "I can guide you through the system navigation and help you find what you're looking for. Where would you like to go?",
                            sender: 'bot',
                            timestamp: new Date(),
                          };
                          setMessages(prev => [...prev, botMessage]);
                          setIsTyping(false);
                        }, 1500);
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
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20"
                >
                  <PaperPlaneIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
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