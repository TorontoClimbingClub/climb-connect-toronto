import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatContext, ChatContextValue } from './ChatContext';
import { 
  ChatConfig, 
  ChatState, 
  ChatActions, 
  BaseMessage,
  UserPermissions,
  ReadStatus,
  CHAT_CONFIGS,
  DEFAULT_USER_PERMISSIONS 
} from './types';
import { 
  useChatMessages,
  useChatRealtime,
  useChatReadStatus,
  useChatPermissions,
  useChatScroll,
  useChatSearch
} from './hooks';
import { defaultChatServices, IChatServices } from './services';

interface ChatProviderProps {
  children: React.ReactNode;
  config: ChatConfig;
  roomId: string;
  roomName: string;
  services?: Partial<IChatServices>;
  onMessage?: (message: BaseMessage) => void;
}

export function ChatProvider({
  children,
  config,
  roomId,
  roomName,
  services = {},
  onMessage
}: ChatProviderProps) {
  const { user } = useAuth();
  const chatServices = { ...defaultChatServices, ...services };

  // Core chat functionality hooks
  const {
    messages,
    isLoading: isLoadingMessages,
    loadMessages,
    sendMessage,
    deleteMessage,
    addMessage,
    updateMessage,
    setMessages
  } = useChatMessages({
    chatType: config.type,
    roomId,
    realtimeConfig: config.realtime,
    onMessage
  });

  // Real-time functionality
  const { cleanup: cleanupRealtime } = useChatRealtime({
    chatType: config.type,
    roomId,
    realtimeConfig: config.realtime,
    onMessage: addMessage,
    enabled: true
  });

  // Read status tracking
  const {
    readStatus,
    isUpdating: isUpdatingReadStatus,
    updateReadStatus,
    handleScroll,
    markAsReadOnSend,
    markAsReadOnUnmount
  } = useChatReadStatus({
    chatType: config.type,
    roomId,
    enabled: config.features.readStatus
  });

  // Permission management
  const {
    isAdmin,
    permissions,
    isLoading: isLoadingPermissions,
    canDeleteMessage: canUserDeleteMessage,
    canEditMessage: canUserEditMessage,
    deleteMessageWithPermission
  } = useChatPermissions({
    chatType: config.type,
    roomId,
    enabled: true
  });

  // Scroll management
  const {
    viewportRef,
    scrollToBottom,
    scrollToMessage,
    handleScroll: handleScrollEvent,
    handleNewMessage
  } = useChatScroll({
    autoScroll: true,
    scrollThreshold: 10
  });

  // Search functionality
  const {
    searchTerm,
    showSearch,
    filteredMessages,
    searchStats,
    updateSearchTerm,
    clearSearch,
    toggleSearch,
    setSearchTerm,
    setShowSearch
  } = useChatSearch({
    messages,
    enabled: config.features.search
  });

  // Local state
  const [newMessage, setNewMessage] = useState('');

  // Combined state object
  const state: ChatState = useMemo(() => ({
    messages: config.features.search && searchTerm ? filteredMessages : messages,
    isLoading: isLoadingMessages || isLoadingPermissions,
    searchTerm,
    showSearch,
    newMessage,
    isAdmin,
    readStatus
  }), [
    messages,
    filteredMessages,
    isLoadingMessages,
    isLoadingPermissions,
    searchTerm,
    showSearch,
    newMessage,
    isAdmin,
    readStatus,
    config.features.search
  ]);

  // Actions object
  const actions: ChatActions = useMemo(() => ({
    sendMessage: async (content: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const message = await sendMessage(content);
      if (message) {
        setNewMessage('');
        markAsReadOnSend();
        handleNewMessage();
      }
    },
    
    deleteMessage: async (messageId: string) => {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;
      
      if (config.features.adminDelete && isAdmin) {
        await deleteMessageWithPermission(messageId, message.user_id, deleteMessage);
      } else if (message.user_id === user?.id) {
        await deleteMessage(messageId);
      }
    },
    
    loadMessages,
    updateReadStatus,
    
    toggleSearch: () => {
      if (config.features.search) {
        toggleSearch();
      }
    },
    
    setSearchTerm: (term: string) => {
      if (config.features.search) {
        updateSearchTerm(term);
      }
    },
    
    setNewMessage
  }), [
    user,
    sendMessage,
    deleteMessage,
    deleteMessageWithPermission,
    loadMessages,
    updateReadStatus,
    toggleSearch,
    updateSearchTerm,
    messages,
    isAdmin,
    config.features,
    markAsReadOnSend,
    handleNewMessage
  ]);

  // Utility functions
  const utils = useMemo(() => ({
    formatTimestamp: (timestamp: string): string => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 24 * 7) {
        return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
    },
    
    canDeleteMessage: (messageUserId: string): boolean => {
      return canUserDeleteMessage(messageUserId);
    },
    
    canEditMessage: (messageUserId: string): boolean => {
      return canUserEditMessage(messageUserId);
    },
    
    scrollToBottom,
    scrollToMessage
  }), [canUserDeleteMessage, canUserEditMessage, scrollToBottom, scrollToMessage]);

  // Combined scroll handler
  const combinedScrollHandler = useCallback(() => {
    handleScrollEvent();
    if (config.features.readStatus) {
      handleScroll(viewportRef);
    }
  }, [handleScrollEvent, handleScroll, viewportRef, config.features.readStatus]);

  // Load initial data
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Handle new messages
  useEffect(() => {
    if (messages.length > 0) {
      handleNewMessage();
    }
  }, [messages.length, handleNewMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRealtime();
      if (config.features.readStatus) {
        markAsReadOnUnmount();
      }
    };
  }, [cleanupRealtime, markAsReadOnUnmount, config.features.readStatus]);

  // Context value
  const contextValue: ChatContextValue = useMemo(() => ({
    config,
    roomId,
    roomName,
    state,
    actions,
    permissions,
    readStatus,
    isAdmin,
    services: chatServices,
    utils
  }), [
    config,
    roomId,
    roomName,
    state,
    actions,
    permissions,
    readStatus,
    isAdmin,
    chatServices,
    utils
  ]);

  return (
    <ChatContext.Provider value={contextValue}>
      <div 
        ref={viewportRef}
        onScroll={combinedScrollHandler}
        className="h-full overflow-hidden"
      >
        {children}
      </div>
    </ChatContext.Provider>
  );
}