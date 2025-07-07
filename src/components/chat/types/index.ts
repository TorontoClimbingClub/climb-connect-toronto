// Export all chat types from a single entry point
export * from './ChatTypes';
export * from './MessageTypes';
export * from './ReadStatusTypes';
export * from './PermissionTypes';
export * from './ConnectionTypes';

// Re-export commonly used types for convenience
export type {
  ChatType,
  ChatConfig,
  ChatFeatures,
  ChatPermissions,
  ChatState,
  ChatActions,
  ChatProps
} from './ChatTypes';

export type {
  BaseMessage,
  CommunityMessage,
  GroupMessage,
  EventMessage,
  EnhancedMessage,
  MessageType,
  MessageReaction,
  MessageWithReactions,
  MessageOperations
} from './MessageTypes';

export type {
  ReadStatus,
  ReadStatusConfig,
  ReadStatusOperations,
  ReadStatusState
} from './ReadStatusTypes';

export type {
  UserPermissions,
  AdminCapabilities,
  PermissionCheck,
  PermissionService
} from './PermissionTypes';

export type {
  ConnectionStatus,
  ConnectionState,
  ConnectionConfig,
  ConnectionCallbacks,
  ConnectionActions,
  MessageQueueItem,
  MessageQueue,
  NetworkQuality
} from './ConnectionTypes';