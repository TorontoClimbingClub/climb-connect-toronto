import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type ChatType = 'club_talk' | 'group_chat' | 'event_chat' | 'community_topic';

interface UnreadTrackingOptions {
  chatType: ChatType;
  chatIdentifier: string; // group_id, event_id, 'club_talk', topic_name
}

export function useUnreadTracking({ chatType, chatIdentifier }: UnreadTrackingOptions) {
  const { user } = useAuth();

  // Universal function to mark chat as read
  const markAsRead = useCallback(async () => {
    if (!user) return;

    try {
      switch (chatType) {
        case 'group_chat':
          // Update group_members table
          await supabase
            .from('group_members')
            .update({ last_read_at: new Date().toISOString() })
            .eq('group_id', chatIdentifier)
            .eq('user_id', user.id);
          break;

        case 'event_chat':
          // Update event_participants table
          await supabase
            .from('event_participants')
            .update({ last_read_at: new Date().toISOString() })
            .eq('event_id', chatIdentifier)
            .eq('user_id', user.id);
          break;

        case 'club_talk':
        case 'community_topic':
          // Use universal chat_read_status table
          await supabase.rpc('update_chat_read_status', {
            p_user_id: user.id,
            p_chat_type: chatType,
            p_chat_identifier: chatIdentifier
          });
          break;
      }
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  }, [user, chatType, chatIdentifier]);

  // Universal function to check if chat has unread messages
  const checkUnreadStatus = useCallback(async (latestMessageTime?: string): Promise<boolean> => {
    if (!user || !latestMessageTime) return false;

    try {
      let lastReadAt: string | null = null;

      switch (chatType) {
        case 'group_chat':
          const { data: groupMember } = await supabase
            .from('group_members')
            .select('last_read_at')
            .eq('group_id', chatIdentifier)
            .eq('user_id', user.id)
            .single();
          lastReadAt = groupMember?.last_read_at;
          break;

        case 'event_chat':
          const { data: eventParticipant } = await supabase
            .from('event_participants')
            .select('last_read_at')
            .eq('event_id', chatIdentifier)
            .eq('user_id', user.id)
            .single();
          lastReadAt = eventParticipant?.last_read_at;
          break;

        case 'club_talk':
        case 'community_topic':
          const { data: readStatus } = await supabase
            .from('chat_read_status')
            .select('last_read_at')
            .eq('user_id', user.id)
            .eq('chat_type', chatType)
            .eq('chat_identifier', chatIdentifier)
            .single();
          lastReadAt = readStatus?.last_read_at;
          break;
      }

      if (!lastReadAt) {
        return true; // Never read any messages
      }

      const lastReadTime = new Date(lastReadAt);
      const latestTime = new Date(latestMessageTime);
      
      return latestTime > lastReadTime;
    } catch (error) {
      console.error('Error checking unread status:', error);
      return false;
    }
  }, [user, chatType, chatIdentifier]);

  return {
    markAsRead,
    checkUnreadStatus
  };
}