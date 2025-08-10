"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: "ai", content: "Hello! I'm your ERP AI assistant. How can I help you today?", timestamp: "10:00 AM" },
    { id: 2, type: "user", content: "Show me the sales report for this month", timestamp: "10:01 AM" },
    { id: 3, type: "ai", content: "Here's your sales report for February 2024:\n\n• Total Revenue: $125,000\n• New Customers: 45\n• Conversion Rate: 89%\n• Top Product: Laptop Pro ($25,000)\n\nWould you like me to generate a detailed report or analyze any specific metrics?", timestamp: "10:01 AM" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: "user" as const,
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: "ai" as const,
          content: "I understand your request. Let me analyze the data and provide you with the information you need.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Assistant
          </h3>
          <Button variant="outline">Clear Chat</Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-brand-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick Actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about your business..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-700 dark:text-white"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;