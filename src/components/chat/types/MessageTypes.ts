// Message types and interfaces
export interface BaseMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
  } | null;
}

export interface CommunityMessage extends BaseMessage {
  // Community chat specific fields
}

export interface GroupMessage extends BaseMessage {
  group_id: string;
}

export interface EventMessage extends BaseMessage {
  event_id: string;
}

// Enhanced message types for future features
export interface EnhancedMessage extends BaseMessage {
  edited_at?: string;
  original_content?: string;
  mentioned_users?: string[];
  message_type?: MessageType;
  metadata?: MessageMetadata;
}

export type MessageType = 'text' | 'event_created' | 'system' | 'poll' | 'file' | 'voice';

export interface MessageMetadata {
  event_data?: EventMessageData;
  file_data?: FileMessageData;
  voice_data?: VoiceMessageData;
  poll_data?: PollMessageData;
}

export interface EventMessageData {
  event_id: string;
  title: string;
  date: string;
  location: string;
  max_participants: number;
  current_participants: number;
  interactive_elements: {
    join_button: boolean;
    interested_button: boolean;
  };
}

export interface FileMessageData {
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
}

export interface VoiceMessageData {
  audio_url: string;
  duration: number;
  waveform?: number[];
}

export interface PollMessageData {
  question: string;
  options: PollOption[];
  expires_at?: string;
  allow_multiple: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voted_users: string[];
}

// Message reactions (from existing database schema)
export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface MessageReactionSummary {
  emoji: string;
  count: number;
  users: Array<{
    id: string;
    username: string;
  }>;
  hasUserReacted: boolean;
}

// Typing indicators (from existing database schema)
export interface TypingIndicator {
  id: string;
  room_name: string;
  user_id: string;
  username: string;
  is_typing: boolean;
  updated_at: string;
}

// Message utilities
export interface MessageFilters {
  search?: string;
  user_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
  message_type?: MessageType;
}

export interface MessageWithReactions extends BaseMessage {
  reactions: MessageReactionSummary[];
}

export interface MessageFormattingOptions {
  showAvatar: boolean;
  showTimestamp: boolean;
  showUsername: boolean;
  maxWidth: string;
  enableMentions: boolean;
  enableReactions: boolean;
}

// Message operations
export interface MessageOperations {
  send: (content: string, type?: MessageType, metadata?: MessageMetadata) => Promise<BaseMessage>;
  edit: (messageId: string, newContent: string) => Promise<void>;
  delete: (messageId: string) => Promise<void>;
  react: (messageId: string, emoji: string) => Promise<void>;
  unreact: (messageId: string, emoji: string) => Promise<void>;
  reply: (messageId: string, content: string) => Promise<BaseMessage>;
}