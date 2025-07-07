import { supabase } from '@/integrations/supabase/client';
import { BaseMessage, ChatType } from '../types';

export class RealtimeService {
  private static channels: Map<string, any> = new Map();

  /**
   * Subscribe to real-time message updates
   */
  static subscribe(
    chatType: ChatType,
    roomId: string,
    onMessage: (message: BaseMessage) => void
  ): () => void {
    const channelName = `${chatType}-messages-${roomId}`;
    const table = this.getTableName(chatType);
    const filter = this.getFilter(chatType, roomId);

    console.log(`Setting up realtime subscription for ${chatType}:`, channelName);

    // Create channel
    const channel = supabase.channel(channelName);

    // Set up postgres_changes subscription
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table,
        filter
      },
      async (payload) => {
        console.log(`New ${chatType} message received:`, payload.new);
        
        try {
          // Fetch the complete message with profile data
          const { data: messageWithProfile } = await supabase
            .from(table)
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
        } catch (error) {
          console.error('Error fetching message with profile:', error);
        }
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log(`Realtime subscription status for ${chatType}:`, status);
    });

    // Store channel reference
    this.channels.set(channelName, channel);

    // Return cleanup function
    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to message updates (edit, delete)
   */
  static subscribeToUpdates(
    chatType: ChatType,
    roomId: string,
    onUpdate: (messageId: string, operation: 'UPDATE' | 'DELETE', data?: any) => void
  ): () => void {
    const channelName = `${chatType}-updates-${roomId}`;
    const table = this.getTableName(chatType);
    const filter = this.getFilter(chatType, roomId);

    console.log(`Setting up update subscription for ${chatType}:`, channelName);

    const channel = supabase.channel(channelName);

    // Subscribe to updates
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table,
        filter
      },
      (payload) => {
        console.log(`Message updated in ${chatType}:`, payload);
        onUpdate(payload.new.id, 'UPDATE', payload.new);
      }
    );

    // Subscribe to deletes
    channel.on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table,
        filter
      },
      (payload) => {
        console.log(`Message deleted in ${chatType}:`, payload);
        onUpdate(payload.old.id, 'DELETE');
      }
    );

    channel.subscribe();
    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Subscribe to typing indicators
   */
  static subscribeToTyping(
    roomName: string,
    onTypingChange: (users: Array<{ user_id: string; username: string }>) => void
  ): () => void {
    const channelName = `typing-${roomName}`;

    console.log(`Setting up typing subscription:`, channelName);

    const channel = supabase.channel(channelName);

    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'typing_indicators',
        filter: `room_name=eq.${roomName}`
      },
      async () => {
        // Fetch current typing users
        try {
          const { data } = await supabase
            .from('typing_indicators')
            .select('user_id, username')
            .eq('room_name', roomName)
            .eq('is_typing', true);

          onTypingChange(data || []);
        } catch (error) {
          console.error('Error fetching typing indicators:', error);
        }
      }
    );

    channel.subscribe();
    this.channels.set(channelName, channel);

    return () => this.unsubscribe(channelName);
  }

  /**
   * Update typing status
   */
  static async updateTypingStatus(
    roomName: string,
    userId: string,
    username: string,
    isTyping: boolean
  ): Promise<void> {
    try {
      if (isTyping) {
        await supabase
          .from('typing_indicators')
          .upsert({
            room_name: roomName,
            user_id: userId,
            username,
            is_typing: true,
            updated_at: new Date().toISOString()
          });
      } else {
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('room_name', roomName)
          .eq('user_id', userId);
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }

  /**
   * Unsubscribe from a specific channel
   */
  static unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName);
    if (channel) {
      console.log(`Unsubscribing from channel:`, channelName);
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  static unsubscribeAll(): void {
    console.log('Unsubscribing from all realtime channels');
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  /**
   * Get table name based on chat type
   */
  private static getTableName(chatType: ChatType): string {
    switch (chatType) {
      case 'group':
        return 'group_messages';
      case 'event':
        return 'event_messages';
      case 'community':
      default:
        return 'messages';
    }
  }

  /**
   * Get filter for realtime subscriptions
   */
  private static getFilter(chatType: ChatType, roomId: string): string {
    switch (chatType) {
      case 'group':
        return `group_id=eq.${roomId}`;
      case 'event':
        return `event_id=eq.${roomId}`;
      case 'community':
      default:
        return ''; // No filter for community chat
    }
  }
}