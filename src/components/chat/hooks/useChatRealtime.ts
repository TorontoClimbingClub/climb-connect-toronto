import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BaseMessage, ChatType, RealtimeConfig } from '../types';

interface UseChatRealtimeOptions {
  chatType: ChatType;
  roomId: string;
  realtimeConfig: RealtimeConfig;
  onMessage: (message: BaseMessage) => void;
  enabled?: boolean;
}

export function useChatRealtime({
  chatType,
  roomId,
  realtimeConfig,
  onMessage,
  enabled = true
}: UseChatRealtimeOptions) {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || !roomId) return;

    const channelName = `${realtimeConfig.channel}-${roomId}`;
    console.log(`Setting up realtime subscription for ${chatType}:`, channelName);

    // Create channel with room-specific name
    const channel = supabase.channel(channelName);

    // Set up postgres_changes subscription
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: realtimeConfig.table,
        filter: getRealtimeFilter(chatType, roomId)
      },
      async (payload) => {
        console.log(`New ${chatType} message received:`, payload.new);
        
        // Fetch the complete message with profile data
        const { data: messageWithProfile } = await supabase
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
          .eq('id', payload.new.id)
          .single();

        if (messageWithProfile) {
          onMessage(messageWithProfile);
        }
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log(`Realtime subscription status for ${chatType}:`, status);
    });

    channelRef.current = channel;

    // Cleanup function
    return () => {
      console.log(`Cleaning up realtime subscription for ${chatType}`);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatType, roomId, realtimeConfig, onMessage, enabled]);

  // Function to manually cleanup the subscription
  const cleanup = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };

  return { cleanup };
}

// Helper function to generate realtime filters based on chat type
function getRealtimeFilter(chatType: ChatType, roomId: string): string {
  switch (chatType) {
    case 'group':
      return `group_id=eq.${roomId}`;
    case 'event':
      return `event_id=eq.${roomId}`;
    case 'community':
    default:
      return ''; // No filter for community chat (all messages)
  }
}