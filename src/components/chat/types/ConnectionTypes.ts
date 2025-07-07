// Connection state and resilience types
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'reconnecting' | 'failed';

export interface ConnectionState {
  status: ConnectionStatus;
  lastConnected: Date | null;
  lastDisconnected: Date | null;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
  isOnline: boolean;
  latency: number | null;
  error: string | null;
}

export interface ConnectionConfig {
  // Exponential backoff settings
  initialReconnectDelay: number; // Initial delay in ms
  maxReconnectDelay: number; // Maximum delay in ms
  reconnectMultiplier: number; // Multiplier for exponential backoff
  maxReconnectAttempts: number; // Maximum number of reconnection attempts
  
  // Health monitoring settings
  heartbeatInterval: number; // Heartbeat interval in ms
  heartbeatTimeout: number; // Heartbeat timeout in ms
  connectionTimeout: number; // Connection timeout in ms
  
  // Network quality settings
  latencyThreshold: number; // Poor connection threshold in ms
  networkStatusPollInterval: number; // Network status check interval in ms
  
  // Message queue settings
  enableMessageQueue: boolean; // Enable offline message queuing
  maxQueueSize: number; // Maximum queued messages
  queuePersistence: boolean; // Persist queue in localStorage
}

export interface ConnectionCallbacks {
  onConnected?: () => void;
  onDisconnected?: (error?: Error) => void;
  onReconnecting?: (attempt: number) => void;
  onReconnected?: () => void;
  onReconnectFailed?: (error: Error) => void;
  onLatencyChange?: (latency: number) => void;
  onNetworkQualityChange?: (isGood: boolean) => void;
}

export interface ConnectionActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
  resetReconnectionAttempts: () => void;
  measureLatency: () => Promise<number>;
  checkNetworkStatus: () => Promise<boolean>;
}

export interface MessageQueueItem {
  id: string;
  content: string;
  type: string;
  roomId: string;
  userId: string;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
  metadata?: any;
}

export interface MessageQueue {
  items: MessageQueueItem[];
  isProcessing: boolean;
  lastProcessed: Date | null;
  totalQueued: number;
  totalProcessed: number;
  totalFailed: number;
}

export interface NetworkQuality {
  isOnline: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

// Default configuration
export const DEFAULT_CONNECTION_CONFIG: ConnectionConfig = {
  initialReconnectDelay: 1000, // 1 second
  maxReconnectDelay: 30000, // 30 seconds
  reconnectMultiplier: 2, // Double the delay each time
  maxReconnectAttempts: 10,
  
  heartbeatInterval: 30000, // 30 seconds
  heartbeatTimeout: 5000, // 5 seconds
  connectionTimeout: 10000, // 10 seconds
  
  latencyThreshold: 1000, // 1 second
  networkStatusPollInterval: 5000, // 5 seconds
  
  enableMessageQueue: true,
  maxQueueSize: 100,
  queuePersistence: true
};

// Connection status helpers
export const CONNECTION_STATUS_MESSAGES: Record<ConnectionStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting...',
  disconnected: 'Disconnected',
  reconnecting: 'Reconnecting...',
  failed: 'Connection failed'
};

export const CONNECTION_STATUS_COLORS: Record<ConnectionStatus, string> = {
  connected: 'text-green-500',
  connecting: 'text-yellow-500',
  disconnected: 'text-red-500',
  reconnecting: 'text-orange-500',
  failed: 'text-red-600'
};