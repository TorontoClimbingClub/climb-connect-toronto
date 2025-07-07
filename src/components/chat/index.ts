// Main entry point for the refactored chat system
export { Chat, CommunityChat, GroupChat, EventChat } from './Chat';
export { ChatProvider } from './ChatProvider';
export { 
  ChatContext, 
  useChatContext, 
  useChatState, 
  useChatActions, 
  useChatConfig, 
  useChatPermissions as useChatContextPermissions, 
  useChatUtils, 
  useChatServices 
} from './ChatContext';

// Export hooks
export * from './hooks';

// Export types
export * from './types';

// Export UI components
export * from './ui';

// Export services
export * from './services';

// Export specific components for backward compatibility
export { MessageBubble } from './ui/MessageBubble';
export { MessageList } from './ui/MessageList';
export { MessageInput } from './ui/MessageInput';
export { ChatHeader } from './ui/ChatHeader';
export { SearchBar } from './ui/SearchBar';
export { ChatContainer } from './ui/ChatContainer';
export { LoadingSpinner } from './ui/LoadingSpinner';
export { AdminControls } from './ui/AdminControls';

// Export configuration presets
export { CHAT_CONFIGS } from './types/ChatTypes';
export { DEFAULT_USER_PERMISSIONS, ADMIN_PERMISSIONS } from './types/PermissionTypes';
export { DEFAULT_READ_STATUS_CONFIG } from './types/ReadStatusTypes';