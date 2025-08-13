"use client";
import React, { useState, useRef, useEffect } from "react";
import { MailIcon } from "@/icons";
import Link from "next/link";

interface InboxMessage {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
}

const InboxDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock inbox messages
  const messages: InboxMessage[] = [
    {
      id: "1",
      sender: "John Smith",
      subject: "Project Update Required",
      preview: "Hi, I need an update on the current project status...",
      timestamp: "2 min ago",
      isRead: false,
    },
    {
      id: "2",
      sender: "Sarah Johnson",
      subject: "Meeting Reminder",
      preview: "Don't forget about our meeting tomorrow at 10 AM...",
      timestamp: "15 min ago",
      isRead: false,
    },
    {
      id: "3",
      sender: "Mike Wilson",
      subject: "Invoice #1234",
      preview: "Please find the attached invoice for your review...",
      timestamp: "1 hour ago",
      isRead: true,
    },
    {
      id: "4",
      sender: "Emma Davis",
      subject: "Welcome to the team!",
      preview: "We're excited to have you join our team...",
      timestamp: "2 hours ago",
      isRead: true,
    },
    {
      id: "5",
      sender: "Alex Johnson",
      subject: "Budget Approval",
      preview: "The Q4 budget has been approved and is ready for review...",
      timestamp: "3 hours ago",
      isRead: true,
    },
    {
      id: "6",
      sender: "Maria Garcia",
      subject: "System Maintenance",
      preview: "Scheduled maintenance will occur this weekend...",
      timestamp: "5 hours ago",
      isRead: true,
    },
  ];

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        aria-label="Inbox"
      >
        <MailIcon width="20" height="20" className="fill-current" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0.5 z-10 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full">
            <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
            <span className="relative">{unreadCount > 9 ? '9+' : unreadCount}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px] lg:right-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Messages
            </h5>
            <button
              onClick={toggleDropdown}
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

          {/* Messages List */}
          <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
            {messages.length > 0 ? (
              messages.map((message) => (
                <li key={message.id}>
                  <div
                    onClick={closeDropdown}
                    className={`flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5 cursor-pointer ${
                      !message.isRead ? 'bg-brand-50 dark:bg-brand-500/[0.12]' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                      <div className="w-full h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
                        {getInitials(message.sender)}
                      </div>
                      {!message.isRead && (
                        <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-red-500 dark:border-gray-900"></span>
                      )}
                    </span>

                    {/* Message Content */}
                    <span className="block">
                      <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                        <span className={`font-medium ${
                          !message.isRead 
                            ? 'text-gray-800 dark:text-white/90' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {message.sender}
                        </span>
                        <span className={`${
                          !message.isRead 
                            ? 'text-gray-800 dark:text-white/90 font-medium' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {message.subject}
                        </span>
                      </span>

                      <span className="mb-1.5 block text-theme-sm text-gray-500 dark:text-gray-400">
                        {message.preview}
                      </span>

                      <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                        <span>Message</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{message.timestamp}</span>
                      </span>
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-8 text-center">
                <MailIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No messages</p>
              </li>
            )}
          </ul>

          {/* Footer */}
          <Link
            href="/inbox"
            className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            View All Messages
          </Link>
        </div>
      )}
    </div>
  );
};

export default InboxDropdown;