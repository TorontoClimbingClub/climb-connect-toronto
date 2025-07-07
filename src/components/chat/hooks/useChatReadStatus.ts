import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  ReadStatus, 
  ReadStatusConfig, 
  ReadStatusState,
  ChatType,
  DEFAULT_READ_STATUS_CONFIG 
} from '../types';

interface UseChatReadStatusOptions {
  chatType: ChatType;
  roomId: string;
  config?: Partial<ReadStatusConfig>;
  enabled?: boolean;
}

export function useChatReadStatus({
  chatType,
  roomId,
  config = {},
  enabled = true
}: UseChatReadStatusOptions) {
  const { user } = useAuth();
  const fullConfig = { ...DEFAULT_READ_STATUS_CONFIG, ...config };
  
  const [readStatus, setReadStatus] = useState<ReadStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get the appropriate table for read status based on chat type
  const getReadStatusTable = () => {
    switch (chatType) {
      case 'group':
        return 'group_members';
      case 'event':
        return 'event_participants';
      case 'community':
      default:
        return 'profiles'; // Community doesn't have specific read status tracking
    }
  };

  // Get the appropriate room field name based on chat type
  const getRoomFieldName = () => {
    switch (chatType) {
      case 'group':
        return 'group_id';
      case 'event':
        return 'event_id';
      case 'community':
      default:
        return null; // Community doesn't have room-specific tracking
    }
  };

  // Update read status in database
  const updateReadStatus = useCallback(async () => {
    if (!enabled || !user || !roomId || isUpdating) return;
    
    const table = getReadStatusTable();
    const roomField = getRoomFieldName();
    
    // Skip if community chat (no read status tracking)
    if (chatType === 'community' || !roomField) return;
    
    setIsUpdating(true);
    
    try {
      const now = new Date().toISOString();
      
      // Update database with error checking
      const { error } = await supabase
        .from(table)
        .update({ last_read_at: now })
        .eq(roomField, roomId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Database update error:', error);
        // Still update localStorage as fallback
      } else {
        setLastUpdateTime(now);
        setReadStatus(prev => prev ? { ...prev, last_read_at: now } : null);
      }
      
      // Always update localStorage for backward compatibility
      const lastVisitKey = `${chatType}_last_visit_${roomId}`;
      localStorage.setItem(lastVisitKey, now);
    } catch (error) {
      console.error('Error updating read status:', error);
      // Ensure localStorage is updated even if database fails
      try {
        const lastVisitKey = `${chatType}_last_visit_${roomId}`;
        localStorage.setItem(lastVisitKey, new Date().toISOString());
      } catch (storageError) {
        console.error('localStorage fallback failed:', storageError);
      }
    } finally {
      setIsUpdating(false);
    }
  }, [enabled, user, roomId, isUpdating, chatType]);

  // Debounced scroll handler to prevent excessive database calls
  const handleScroll = useCallback((viewportRef: React.RefObject<HTMLDivElement>) => {
    if (!enabled || !fullConfig.trackOnScroll || !viewportRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - fullConfig.scrollThreshold;
    
    if (isAtBottom) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce the update to avoid excessive calls
      scrollTimeoutRef.current = setTimeout(() => {
        updateReadStatus();
        scrollTimeoutRef.current = null;
      }, fullConfig.debounceMs);
    }
  }, [enabled, fullConfig.trackOnScroll, fullConfig.scrollThreshold, fullConfig.debounceMs, updateReadStatus]);

  // Mark as read when user sends a message
  const markAsReadOnSend = useCallback(() => {
    if (enabled && fullConfig.trackOnSend) {
      updateReadStatus();
    }
  }, [enabled, fullConfig.trackOnSend, updateReadStatus]);

  // Mark as read when component unmounts (user leaves chat)
  const markAsReadOnUnmount = useCallback(() => {
    if (enabled && fullConfig.trackOnUnmount) {
      // Clear any pending scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Mark as read when leaving
      updateReadStatus();
    }
  }, [enabled, fullConfig.trackOnUnmount, updateReadStatus]);

  // Load current read status
  const loadReadStatus = useCallback(async () => {
    if (!enabled || !user || !roomId) return;
    
    const table = getReadStatusTable();
    const roomField = getRoomFieldName();
    
    if (chatType === 'community' || !roomField) return;
    
    try {
      const { data, error } = await supabase
        .from(table)
        .select('last_read_at')
        .eq(roomField, roomId)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error loading read status:', error);
        return;
      }
      
      if (data) {
        setReadStatus({
          last_read_at: data.last_read_at,
          unread_count: 0, // Will be calculated separately if needed
          room_id: roomId,
          user_id: user.id
        });
      }
    } catch (error) {
      console.error('Error in loadReadStatus:', error);
    }
  }, [enabled, user, roomId, chatType]);

  // Load read status when dependencies change
  useEffect(() => {
    loadReadStatus();
  }, [loadReadStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    readStatus,
    isUpdating,
    lastUpdateTime,
    updateReadStatus,
    handleScroll,
    markAsReadOnSend,
    markAsReadOnUnmount,
    loadReadStatus,
    scrollTimeoutRef
  };
}