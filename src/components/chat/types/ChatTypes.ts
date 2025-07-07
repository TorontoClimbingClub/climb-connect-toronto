// Base chat configuration and interfaces
export type ChatType = 'community' | 'group' | 'event';

export interface ChatUser {
  id: string;
  display_name: string;
  avatar_url?: string;
  is_admin?: boolean;
}

export interface ChatConfig {
  type: ChatType;
  features: ChatFeatures;
  permissions: ChatPermissions;
  realtime: RealtimeConfig;
}

export interface ChatFeatures {
  search: boolean;
  adminDelete: boolean;
  readStatus: boolean;
  eventCreation: boolean;
  reactions: boolean;
  typing: boolean;
  messageEdit: boolean;
  fileUpload: boolean;
  voiceMessages: boolean;
  interactiveMessages: boolean;
}

export interface ChatPermissions {
  canDelete: (userId: string, messageUserId: string, isAdmin: boolean) => boolean;
  canCreateEvents: boolean;
  canEditMessages: boolean;
  canUploadFiles: boolean;
  canSendVoice: boolean;
}

export interface RealtimeConfig {
  channel: string;
  table: string;
  filters?: string[];
}

export interface ChatState {
  messages: BaseMessage[];
  isLoading: boolean;
  searchTerm: string;
  showSearch: boolean;
  newMessage: string;
  isAdmin: boolean;
  readStatus?: ReadStatus;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  loadMessages: () => Promise<void>;
  updateReadStatus: () => Promise<void>;
  toggleSearch: () => void;
  setSearchTerm: (term: string) => void;
  setNewMessage: (message: string) => void;
}

export interface ChatProps {
  config: ChatConfig;
  roomId: string;
  roomName: string;
  className?: string;
  onMessage?: (message: BaseMessage) => void;
}

// Preset configurations for different chat types
export const CHAT_CONFIGS: Record<ChatType, Partial<ChatConfig>> = {
  community: {
    type: 'community',
    features: {
      search: true,
      adminDelete: true,
      readStatus: false,
      eventCreation: false,
      reactions: false,
      typing: false,
      messageEdit: false,
      fileUpload: false,
      voiceMessages: false,
      interactiveMessages: false
    },
    permissions: {
      canDelete: (userId, messageUserId, isAdmin) => isAdmin || userId === messageUserId,
      canCreateEvents: false,
      canEditMessages: false,
      canUploadFiles: false,
      canSendVoice: false
    },
    realtime: {
      table: 'messages',
      channel: 'messages'
    }
  },
  group: {
    type: 'group',
    features: {
      search: true,
      adminDelete: true,
      readStatus: true,
      eventCreation: true,
      reactions: false,
      typing: false,
      messageEdit: false,
      fileUpload: false,
      voiceMessages: false,
      interactiveMessages: true
    },
    permissions: {
      canDelete: (userId, messageUserId, isAdmin) => isAdmin || userId === messageUserId,
      canCreateEvents: true,
      canEditMessages: false,
      canUploadFiles: false,
      canSendVoice: false
    },
    realtime: {
      table: 'group_messages',
      channel: 'group-messages'
    }
  },
  event: {
    type: 'event',
    features: {
      search: false,
      adminDelete: false,
      readStatus: true,
      eventCreation: false,
      reactions: false,
      typing: false,
      messageEdit: false,
      fileUpload: false,
      voiceMessages: false,
      interactiveMessages: false
    },
    permissions: {
      canDelete: () => false,
      canCreateEvents: false,
      canEditMessages: false,
      canUploadFiles: false,
      canSendVoice: false
    },
    realtime: {
      table: 'event_messages',
      channel: 'event_messages'
    }
  }
};