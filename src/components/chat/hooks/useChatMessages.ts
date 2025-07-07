import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  BaseMessage, 
  CommunityMessage, 
  GroupMessage, 
  EventMessage,
  ChatType,
  RealtimeConfig 
} from '../types';

interface UseChatMessagesOptions {
  chatType: ChatType;
  roomId: string;
  realtimeConfig: RealtimeConfig;
  onMessage?: (message: BaseMessage) => void;
}

export function useChatMessages({
  chatType,
  roomId,
  realtimeConfig,
  onMessage
}: UseChatMessagesOptions) {
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load messages based on chat type
  const loadMessages = useCallback(async () => {
    console.log(`Loading ${chatType} messages for:`, roomId);
    setIsLoading(true);
    
    try {
      let query = supabase
        .from(realtimeConfig.table)
        .select(`
          id,
          content,
          created_at,
          user_id,
          ${chatType === 'group' ? 'group_id,' : ''}
          ${chatType === 'event' ? 'event_id,' : ''}
          profiles!inner(display_name, avatar_url)
        `)
        .order('created_at', { ascending: true });

      // Apply room-specific filters
      if (chatType === 'group') {
        query = query.eq('group_id', roomId);
      } else if (chatType === 'event') {
        query = query.eq('event_id', roomId);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error loading ${chatType} messages:`, error);
        return;
      }

      console.log(`Loaded ${chatType} messages:`, data);
      setMessages(data || []);
    } catch (error) {
      console.error(`Error in load${chatType}Messages:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [chatType, roomId, realtimeConfig.table]);

  // Send message based on chat type
  const sendMessage = useCallback(async (content: string): Promise<BaseMessage | null> => {
    if (!content.trim() || !user) return null;

    console.log(`Sending ${chatType} message:`, { content, user_id: user.id, room_id: roomId });

    try {
      const messageData: any = {
        content,
        user_id: user.id,
      };

      // Add room-specific fields
      if (chatType === 'group') {
        messageData.group_id = roomId;
      } else if (chatType === 'event') {
        messageData.event_id = roomId;
      }

      const { data, error } = await supabase
        .from(realtimeConfig.table)
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
        console.error(`Error sending ${chatType} message:`, error);
        return null;
      }

      console.log(`${chatType} message sent successfully:`, data);
      return data;
    } catch (error) {
      console.error(`Error in send${chatType}Message:`, error);
      return null;
    }
  }, [chatType, roomId, user, realtimeConfig.table]);

  // Delete message
  const deleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from(realtimeConfig.table)
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      // Remove message from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }, [realtimeConfig.table]);

  // Add message to local state (used by realtime hook)
  const addMessage = useCallback((message: BaseMessage) => {
    setMessages(prev => {
      // Check if message already exists
      if (prev.find(m => m.id === message.id)) {
        return prev;
      }
      const newMessages = [...prev, message];
      onMessage?.(message);
      return newMessages;
    });
  }, [onMessage]);

  // Update message in local state
  const updateMessage = useCallback((messageId: string, updates: Partial<BaseMessage>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  }, []);

  // Search messages
  const searchMessages = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return messages;
    
    const lowercaseQuery = searchTerm.toLowerCase();
    return messages.filter(message => 
      message.content.toLowerCase().includes(lowercaseQuery) ||
      message.profiles?.display_name?.toLowerCase().includes(lowercaseQuery)
    );
  }, [messages]);

  return {
    messages,
    isLoading,
    loadMessages,
    sendMessage,
    deleteMessage,
    addMessage,
    updateMessage,
    searchMessages,
    setMessages
  };
}