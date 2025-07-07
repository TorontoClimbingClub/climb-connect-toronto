import { createContext, useContext } from 'react';
import { 
  ChatConfig, 
  ChatState, 
  ChatActions, 
  BaseMessage,
  ReadStatus,
  UserPermissions 
} from './types';
import { IChatServices } from './services';

export interface ChatContextValue {
  // Configuration
  config: ChatConfig;
  roomId: string;
  roomName: string;
  
  // State
  state: ChatState;
  
  // Actions
  actions: ChatActions;
  
  // Additional features
  permissions: UserPermissions;
  readStatus: ReadStatus | null;
  isAdmin: boolean;
  
  // Services (for advanced usage)
  services: IChatServices;
  
  // Utility functions
  utils: {
    formatTimestamp: (timestamp: string) => string;
    canDeleteMessage: (messageUserId: string) => boolean;
    canEditMessage: (messageUserId: string) => boolean;
    scrollToBottom: () => void;
    scrollToMessage: (messageId: string) => void;
  };
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  
  return context;
}

// Convenience hooks for specific context values
export function useChatState() {
  const { state } = useChatContext();
  return state;
}

export function useChatActions() {
  const { actions } = useChatContext();
  return actions;
}

export function useChatConfig() {
  const { config } = useChatContext();
  return config;
}

export function useChatPermissions() {
  const { permissions, isAdmin } = useChatContext();
  return { permissions, isAdmin };
}

export function useChatUtils() {
  const { utils } = useChatContext();
  return utils;
}

export function useChatServices() {
  const { services } = useChatContext();
  return services;
}