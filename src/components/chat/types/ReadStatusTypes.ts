// Read status tracking types
export interface ReadStatus {
  last_read_at: string;
  unread_count: number;
  room_id: string;
  user_id: string;
}

export interface ReadStatusConfig {
  enabled: boolean;
  trackOnScroll: boolean;
  trackOnSend: boolean;
  trackOnUnmount: boolean;
  debounceMs: number;
  scrollThreshold: number; // pixels from bottom to trigger read
}

export interface ReadStatusOperations {
  updateReadStatus: (roomId: string, userId: string) => Promise<void>;
  getReadStatus: (roomId: string, userId: string) => Promise<ReadStatus | null>;
  getUnreadCount: (roomId: string, userId: string) => Promise<number>;
  markAllAsRead: (roomId: string, userId: string) => Promise<void>;
  subscribeToReadStatus: (roomId: string, callback: (status: ReadStatus) => void) => () => void;
}

export interface ReadStatusState {
  readStatus: ReadStatus | null;
  isUpdating: boolean;
  lastUpdateTime: string | null;
  scrollTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

// Default configuration
export const DEFAULT_READ_STATUS_CONFIG: ReadStatusConfig = {
  enabled: true,
  trackOnScroll: true,
  trackOnSend: true,
  trackOnUnmount: true,
  debounceMs: 1000,
  scrollThreshold: 10
};