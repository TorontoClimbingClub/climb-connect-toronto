import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  MessageQueueItem,
  MessageQueue,
  ConnectionConfig,
  DEFAULT_CONNECTION_CONFIG
} from '../types/ConnectionTypes';
import { BaseMessage, ChatType } from '../types';

export interface UseMessageQueueOptions {
  chatType: ChatType;
  roomId: string;
  userId: string;
  config?: Partial<ConnectionConfig>;
  onMessageSent?: (message: BaseMessage) => void;
  onMessageFailed?: (item: MessageQueueItem, error: Error) => void;
  onQueueChanged?: (queue: MessageQueue) => void;
  enabled?: boolean;
}

export interface UseMessageQueueReturn {
  queue: MessageQueue;
  queueMessage: (content: string, metadata?: any) => Promise<string>;
  retryMessage: (messageId: string) => Promise<void>;
  removeMessage: (messageId: string) => void;
  clearQueue: () => void;
  processQueue: () => Promise<void>;
  isProcessing: boolean;
  queueSize: number;
}

const QUEUE_STORAGE_KEY = 'chat-message-queue';

export function useMessageQueue({
  chatType,
  roomId,
  userId,
  config: userConfig = {},
  onMessageSent,
  onMessageFailed,
  onQueueChanged,
  enabled = true
}: UseMessageQueueOptions): UseMessageQueueReturn {
  const config = { ...DEFAULT_CONNECTION_CONFIG, ...userConfig };
  
  const [queue, setQueue] = useState<MessageQueue>({
    items: [],
    isProcessing: false,
    lastProcessed: null,
    totalQueued: 0,
    totalProcessed: 0,
    totalFailed: 0
  });

  const processingRef = useRef(false);
  const processTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get the appropriate table name for the chat type
  const getTableName = useCallback((): string => {
    switch (chatType) {
      case 'group':
        return 'group_messages';
      case 'event':
        return 'event_messages';
      case 'community':
      default:
        return 'messages';
    }
  }, [chatType]);

  // Load queue from localStorage on mount
  useEffect(() => {
    if (!enabled || !config.queuePersistence) return;

    try {
      const savedQueue = localStorage.getItem(`${QUEUE_STORAGE_KEY}-${roomId}`);
      if (savedQueue) {
        const parsedQueue: MessageQueue = JSON.parse(savedQueue);
        // Convert string dates back to Date objects
        parsedQueue.items = parsedQueue.items.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        parsedQueue.lastProcessed = parsedQueue.lastProcessed 
          ? new Date(parsedQueue.lastProcessed) 
          : null;
        
        setQueue(parsedQueue);
      }
    } catch (error) {
      console.error('Failed to load message queue from localStorage:', error);
    }
  }, [enabled, config.queuePersistence, roomId]);

  // Save queue to localStorage when it changes
  useEffect(() => {
    if (!enabled || !config.queuePersistence) return;

    try {
      localStorage.setItem(`${QUEUE_STORAGE_KEY}-${roomId}`, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save message queue to localStorage:', error);
    }
  }, [queue, enabled, config.queuePersistence, roomId]);

  // Notify parent of queue changes
  useEffect(() => {
    if (onQueueChanged) {
      onQueueChanged(queue);
    }
  }, [queue, onQueueChanged]);

  // Generate unique message ID
  const generateMessageId = useCallback((): string => {
    return `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Calculate exponential backoff delay for retries
  const calculateRetryDelay = useCallback((retryCount: number): number => {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = baseDelay * Math.pow(2, retryCount);
    return Math.min(delay, maxDelay);
  }, []);

  // Add message to queue
  const queueMessage = useCallback(async (content: string, metadata?: any): Promise<string> => {
    if (!enabled) {
      throw new Error('Message queue is disabled');
    }

    const messageId = generateMessageId();
    const queueItem: MessageQueueItem = {
      id: messageId,
      content,
      type: chatType,
      roomId,
      userId,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: 3,
      metadata
    };

    setQueue(prev => ({
      ...prev,
      items: [...prev.items, queueItem],
      totalQueued: prev.totalQueued + 1
    }));

    // Try to process the queue immediately
    processQueue();

    return messageId;
  }, [enabled, chatType, roomId, userId, generateMessageId]);

  // Remove message from queue
  const removeMessage = useCallback((messageId: string) => {
    setQueue(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== messageId)
    }));
  }, []);

  // Retry specific message
  const retryMessage = useCallback(async (messageId: string): Promise<void> => {
    setQueue(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === messageId 
          ? { ...item, retryCount: 0 } // Reset retry count
          : item
      )
    }));

    // Process the queue to retry the message
    await processQueue();
  }, []);

  // Clear entire queue
  const clearQueue = useCallback(() => {
    setQueue(prev => ({
      ...prev,
      items: []
    }));
  }, []);

  // Send a single message
  const sendMessage = useCallback(async (item: MessageQueueItem): Promise<BaseMessage> => {
    const tableName = getTableName();
    
    // Prepare message data based on chat type
    const messageData: any = {
      content: item.content,
      user_id: item.userId
    };

    // Add room-specific fields
    if (chatType === 'group') {
      messageData.group_id = roomId;
    } else if (chatType === 'event') {
      messageData.event_id = roomId;
    }

    // Add metadata if present
    if (item.metadata) {
      Object.assign(messageData, item.metadata);
    }

    // Insert message into database
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

    if (error) {
      throw error;
    }

    return data;
  }, [chatType, roomId, getTableName]);

  // Process the message queue
  const processQueue = useCallback(async (): Promise<void> => {
    if (!enabled || processingRef.current || queue.items.length === 0) {
      return;
    }

    processingRef.current = true;
    setQueue(prev => ({ ...prev, isProcessing: true }));

    try {
      const itemsToProcess = [...queue.items];
      const processedItems: string[] = [];
      const failedItems: MessageQueueItem[] = [];

      for (const item of itemsToProcess) {
        try {
          // Check if item has exceeded max retries
          if (item.retryCount >= item.maxRetries) {
            console.warn(`Message ${item.id} exceeded max retries (${item.maxRetries})`);
            failedItems.push(item);
            continue;
          }

          // Attempt to send the message
          const sentMessage = await sendMessage(item);
          
          // Message sent successfully
          processedItems.push(item.id);
          
          if (onMessageSent) {
            onMessageSent(sentMessage);
          }

          setQueue(prev => ({
            ...prev,
            totalProcessed: prev.totalProcessed + 1
          }));

        } catch (error) {
          console.error(`Failed to send queued message ${item.id}:`, error);
          
          // Increment retry count
          const updatedItem = {
            ...item,
            retryCount: item.retryCount + 1
          };

          if (updatedItem.retryCount >= updatedItem.maxRetries) {
            // Max retries reached, mark as failed
            failedItems.push(updatedItem);
            
            if (onMessageFailed) {
              onMessageFailed(updatedItem, error as Error);
            }

            setQueue(prev => ({
              ...prev,
              totalFailed: prev.totalFailed + 1
            }));
          } else {
            // Schedule retry with exponential backoff
            const delay = calculateRetryDelay(updatedItem.retryCount);
            
            setTimeout(() => {
              setQueue(prev => ({
                ...prev,
                items: prev.items.map(qItem => 
                  qItem.id === item.id ? updatedItem : qItem
                )
              }));
              
              // Retry processing after delay
              processQueue();
            }, delay);
          }
        }
      }

      // Remove successfully processed and permanently failed items
      const itemsToRemove = [...processedItems, ...failedItems.map(item => item.id)];
      
      setQueue(prev => ({
        ...prev,
        items: prev.items.filter(item => !itemsToRemove.includes(item.id)),
        lastProcessed: new Date()
      }));

    } finally {
      processingRef.current = false;
      setQueue(prev => ({ ...prev, isProcessing: false }));
    }
  }, [enabled, queue.items, sendMessage, onMessageSent, onMessageFailed, calculateRetryDelay]);

  // Auto-process queue when items are added
  useEffect(() => {
    if (queue.items.length > 0 && !processingRef.current) {
      // Debounce processing to avoid excessive calls
      if (processTimeoutRef.current) {
        clearTimeout(processTimeoutRef.current);
      }
      
      processTimeoutRef.current = setTimeout(() => {
        processQueue();
      }, 100);
    }

    return () => {
      if (processTimeoutRef.current) {
        clearTimeout(processTimeoutRef.current);
      }
    };
  }, [queue.items.length, processQueue]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (processTimeoutRef.current) {
        clearTimeout(processTimeoutRef.current);
      }
    };
  }, []);

  return {
    queue,
    queueMessage,
    retryMessage,
    removeMessage,
    clearQueue,
    processQueue,
    isProcessing: queue.isProcessing,
    queueSize: queue.items.length
  };
}