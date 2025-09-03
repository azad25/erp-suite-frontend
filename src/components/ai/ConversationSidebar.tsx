/**
 * Conversation Sidebar Component
 * 
 * Displays conversation sessions, allows switching between conversations,
 * and provides conversation management features.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChatIcon, PlusIcon, ArchiveIcon, TrashIcon, SearchIcon } from '@/icons';
import { conversationService, ConversationSession } from '@/services/conversationService';
import Button from '@/components/ui/button/Button';

interface ConversationSidebarProps {
  currentConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  currentConversationId,
  onConversationSelect,
  onNewConversation,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [conversations, setConversations] = useState<ConversationSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<ConversationSession[]>([]);

  // Load user conversations
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await conversationService.getUserConversations(1, 50, 'active');
      setConversations(result.items);
      setFilteredConversations(result.items);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      // Gracefully handle 404 errors by showing empty state
      setConversations([]);
      setFilteredConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search conversations
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleArchiveConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const success = await conversationService.archiveConversation(conversationId);
      if (success) {
        setConversations(prev => prev.filter(conv => conv.conversation_id !== conversationId));
        setFilteredConversations(prev => prev.filter(conv => conv.conversation_id !== conversationId));
        
        // If current conversation was archived, create new one
        if (currentConversationId === conversationId) {
          onNewConversation();
        }
      }
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }
    
    try {
      const success = await conversationService.deleteConversation(conversationId);
      if (success) {
        setConversations(prev => prev.filter(conv => conv.conversation_id !== conversationId));
        setFilteredConversations(prev => prev.filter(conv => conv.conversation_id !== conversationId));
        
        // If current conversation was deleted, create new one
        if (currentConversationId === conversationId) {
          onNewConversation();
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          title="Expand conversations"
        >
          <ChatIcon className="w-5 h-5" />
        </button>
        
        <button
          onClick={onNewConversation}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2"
          title="New conversation"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
        
        <div className="flex-1 overflow-y-auto w-full">
          {filteredConversations.slice(0, 5).map((conversation) => (
            <button
              key={conversation.conversation_id}
              onClick={() => onConversationSelect(conversation.conversation_id)}
              className={`w-full p-2 mb-1 rounded-md transition-colors ${
                currentConversationId === conversation.conversation_id
                  ? 'bg-brand-100 dark:bg-brand-900/20'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={conversation.title}
            >
              <div className={`w-2 h-2 rounded-full ${
                conversation.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col shadow-sm backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <ChatIcon className="w-5 h-5 mr-2" />
            Conversations
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewConversation}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="New conversation"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Collapse sidebar"
              >
                <ChatIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500 mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center">
            <ChatIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNewConversation}
                className="mt-2"
              >
                Start your first conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.conversation_id}
                className={`group relative p-3 mb-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  currentConversationId === conversation.conversation_id
                    ? 'bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20 border-l-4 border-brand-500 shadow-md backdrop-blur-sm'
                    : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-700 dark:hover:to-gray-600/50 hover:shadow-sm backdrop-blur-sm'
                }`}
                onClick={() => onConversationSelect(conversation.conversation_id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {truncateTitle(conversation.title)}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(conversation.updated_at)}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {conversation.message_count} messages
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        conversation.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {conversation.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleArchiveConversation(conversation.conversation_id, e)}
                      className="p-1 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                      title="Archive conversation"
                    >
                      <ArchiveIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteConversation(conversation.conversation_id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete conversation"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <Button
          variant="primary"
          size="sm"
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>
    </div>
  );
};

export default ConversationSidebar;
