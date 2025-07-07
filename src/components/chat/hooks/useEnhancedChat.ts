import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useConnectionState } from './useConnectionState';
import { useMessageQueue } from './useMessageQueue';
import { useChatRealtime } from './useChatRealtime';
import { useChatMessages } from './useChatMessages';
import {
  BaseMessage,
  ChatType,
  ConnectionConfig,
  DEFAULT_CONNECTION_CONFIG
} from '../types';

export interface UseEnhancedChatOptions {
  chatType: ChatType;
  roomId: string;
  roomName: string;
  config?: Partial<ConnectionConfig>;
  onMessage?: (message: BaseMessage) => void;
  enabled?: boolean;
}

export interface UseEnhancedChatReturn {
  // Messages
  messages: BaseMessage[];
  isLoading: boolean;
  
  // Connection state
  connectionState: any;
  isConnected: boolean;
  connectionQuality: 'good' | 'poor' | 'unknown';
  
  // Message queue
  messageQueue: any;
  queueSize: number;
  isProcessingQueue: boolean;
  
  // Actions
  sendMessage: (content: string, metadata?: any) => Promise<void>;
  loadMessages: () => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  clearQueue: () => void;
  
  // Connection actions
  reconnect: () => Promise<void>;
  resetConnection: () => void;
  
  // Fallback mode
  isFallbackMode: boolean;
  lastSuccessfulConnection: Date | null;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export function useEnhancedChat({
  chatType,
  roomId,
  roomName,
  config: userConfig = {},
  onMessage,
  enabled = true
}: UseEnhancedChatOptions): UseEnhancedChatReturn {
  const config = { ...DEFAULT_CONNECTION_CONFIG, ...userConfig };
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [error, setError] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [lastSuccessfulConnection, setLastSuccessfulConnection] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCheckRef = useRef<Date>(new Date());

  // Connection state hook
  const {
    connectionState,
    actions: connectionActions,
    isConnected,
    connectionQuality
  } = useConnectionState({
    config,
    callbacks: {
      onConnected: () => {
        setLastSuccessfulConnection(new Date());
        setIsFallbackMode(false);
        setError(null);
        
        // Clear fallback polling
        if (fallbackIntervalRef.current) {
          clearInterval(fallbackIntervalRef.current);
          fallbackIntervalRef.current = null;
        }
        
        toast({
          title: "Connected",
          description: "Real-time chat is now active"
        });
      },
      onDisconnected: (error) => {
        if (error) {
          setError(error.message);
        }
        
        // Start fallback mode after a delay
        setTimeout(() => {
          if (!isConnected) {
            enableFallbackMode();
          }
        }, 5000);
      },
      onReconnectFailed: (error) => {
        setError(error.message);
        enableFallbackMode();
        
        toast({
          title: "Connection failed",
          description: "Switching to fallback mode",
          variant: "destructive"
        });
      }
    },
    enabled
  });

  // Message queue hook
  const {
    queue: messageQueue,
    queueMessage,
    retryMessage,
    clearQueue,
    isProcessing: isProcessingQueue,
    queueSize
  } = useMessageQueue({
    chatType,
    roomId,
    userId: user?.id || '',
    config,
    onMessageSent: (message) => {
      // Add to local messages immediately
      setMessages(prev => [...prev, message]);
      onMessage?.(message);
    },
    onMessageFailed: (item, error) => {
      toast({
        title: "Message failed to send",
        description: `"${item.content.slice(0, 50)}..." will be retried`,
        variant: "destructive"
      });
    },
    enabled
  });

  // Messages hook
  const {
    messages,
    setMessages,
    loadMessages: baseLoadMessages,
    isLoading: messagesLoading
  } = useChatMessages({
    chatType,
    roomId,
    enabled
  });

  // Real-time hook (only when connected)
  const { cleanup: cleanupRealtime } = useChatRealtime({
    chatType,
    roomId,
    realtimeConfig: {
      channel: `${chatType}-messages`,
      table: getTableName(chatType)
    },
    onMessage: (message) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      onMessage?.(message);
    },
    enabled: enabled && isConnected
  });

  // Get table name for chat type
  function getTableName(type: ChatType): string {
    switch (type) {
      case 'group': return 'group_messages';
      case 'event': return 'event_messages';
      case 'community': 
      default: return 'messages';
    }
  }

  // Enable fallback mode (REST API polling)
  const enableFallbackMode = useCallback(() => {
    if (isFallbackMode) return;
    
    setIsFallbackMode(true);
    
    // Poll for new messages every 10 seconds
    fallbackIntervalRef.current = setInterval(async () => {
      try {
        const tableName = getTableName(chatType);
        const { data, error } = await supabase
          .from(tableName)
          .select(`
            id,
            content,
            created_at,
            user_id,
            ${chatType === 'group' ? 'group_id,' : ''}
            ${chatType === 'event' ? 'event_id,' : ''}
            profiles!inner(display_name, avatar_url)
          `)
          .gt('created_at', lastMessageCheckRef.current.toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMessages = data.filter(m => !existingIds.has(m.id));
            return [...prev, ...newMessages];
          });
          
          lastMessageCheckRef.current = new Date(data[data.length - 1].created_at);
        }
      } catch (error) {
        console.error('Fallback polling failed:', error);
      }
    }, 10000);
  }, [isFallbackMode, chatType]);

  // Send message with intelligent routing
  const sendMessage = useCallback(async (content: string, metadata?: any): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!content.trim()) {
      throw new Error('Message cannot be empty');
    }

    try {
      if (isConnected) {
        // Try direct send first
        const tableName = getTableName(chatType);
        const messageData: any = {
          content: content.trim(),
          user_id: user.id
        };

        // Add room-specific fields
        if (chatType === 'group') {
          messageData.group_id = roomId;
        } else if (chatType === 'event') {
          messageData.event_id = roomId;
        }

        // Add metadata
        if (metadata) {
          Object.assign(messageData, metadata);
        }

        const { data, error } = await supabase
          .from(tableName)
          .insert([messageData])
          .select(`
            id,
            content,
            created_at,
            user_id,
            ${chatType === 'group' ? 'group_id,' : ''}
            ${chatType === 'event' ? 'event_id,' : ''}
            profiles!inner(display_name, avatar_url)
          `)
          .single();

        if (error) throw error;

        // Add to local state (if not added by real-time)
        setMessages(prev => {
          if (prev.find(m => m.id === data.id)) {
            return prev;
          }
          return [...prev, data];
        });

        onMessage?.(data);
        setError(null);
        
      } else {
        // Queue the message for later sending
        await queueMessage(content.trim(), metadata);
        
        toast({
          title: "Message queued",
          description: "Will send when connection is restored"
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Fallback to queueing
      try {
        await queueMessage(content.trim(), metadata);
        toast({
          title: "Message queued",
          description: "Connection issue - will send when restored"
        });
      } catch (queueError) {
        setError((error as Error).message);
        throw error;
      }
    }
  }, [user, isConnected, chatType, roomId, queueMessage, onMessage, toast]);

  // Load messages with error handling
  const loadMessages = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await baseLoadMessages();
      setError(null);
    } catch (error) {
      setError((error as Error).message);
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [baseLoadMessages]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset connection
  const resetConnection = useCallback(() => {
    connectionActions.resetReconnectionAttempts();
    setError(null);
    setIsFallbackMode(false);
    
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }
  }, [connectionActions]);

  // Initial load
  useEffect(() => {
    if (enabled) {
      loadMessages();
    }
  }, [enabled, loadMessages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
      }
      cleanupRealtime();
    };
  }, [cleanupRealtime]);

  return {
    // Messages
    messages,
    isLoading: isLoading || messagesLoading,
    
    // Connection state
    connectionState,
    isConnected,
    connectionQuality,
    
    // Message queue
    messageQueue,
    queueSize,
    isProcessingQueue,
    
    // Actions
    sendMessage,
    loadMessages,
    retryMessage,
    clearQueue,
    
    // Connection actions
    reconnect: connectionActions.reconnect,
    resetConnection,
    
    // Fallback mode
    isFallbackMode,
    lastSuccessfulConnection,
    
    // Error handling
    error,
    clearError
  };
}