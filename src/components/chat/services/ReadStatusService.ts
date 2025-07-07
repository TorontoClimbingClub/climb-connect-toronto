import { supabase } from '@/integrations/supabase/client';
import { ReadStatus, ChatType } from '../types';

export class ReadStatusService {
  /**
   * Update read status for a user in a specific room
   */
  static async updateReadStatus(
    chatType: ChatType,
    roomId: string,
    userId: string
  ): Promise<void> {
    if (chatType === 'community') {
      // Community chat doesn't track read status
      return;
    }

    const table = this.getTableName(chatType);
    const roomField = this.getRoomFieldName(chatType);
    
    if (!table || !roomField) {
      console.warn(`Read status not supported for chat type: ${chatType}`);
      return;
    }

    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from(table)
        .update({ last_read_at: now })
        .eq(roomField, roomId)
        .eq('user_id', userId);
      
      if (error) {
        throw new Error(`Failed to update read status: ${error.message}`);
      }

      // Also update localStorage as fallback
      const lastVisitKey = `${chatType}_last_visit_${roomId}`;
      localStorage.setItem(lastVisitKey, now);
    } catch (error) {
      console.error('Error updating read status:', error);
      
      // Fallback to localStorage only
      try {
        const lastVisitKey = `${chatType}_last_visit_${roomId}`;
        localStorage.setItem(lastVisitKey, new Date().toISOString());
      } catch (storageError) {
        console.error('localStorage fallback failed:', storageError);
      }
      
      throw error;
    }
  }

  /**
   * Get read status for a user in a specific room
   */
  static async getReadStatus(
    chatType: ChatType,
    roomId: string,
    userId: string
  ): Promise<ReadStatus | null> {
    if (chatType === 'community') {
      return null;
    }

    const table = this.getTableName(chatType);
    const roomField = this.getRoomFieldName(chatType);
    
    if (!table || !roomField) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from(table)
        .select('last_read_at')
        .eq(roomField, roomId)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error getting read status:', error);
        return null;
      }

      if (data) {
        return {
          last_read_at: data.last_read_at,
          room_id: roomId,
          user_id: userId,
          unread_count: 0 // Will be calculated separately if needed
        };
      }

      return null;
    } catch (error) {
      console.error('Error in getReadStatus:', error);
      return null;
    }
  }

  /**
   * Get unread message count for a user in a specific room
   */
  static async getUnreadCount(
    chatType: ChatType,
    roomId: string,
    userId: string
  ): Promise<number> {
    if (chatType === 'community') {
      return 0;
    }

    try {
      // First get the last read timestamp
      const readStatus = await this.getReadStatus(chatType, roomId, userId);
      const lastReadAt = readStatus?.last_read_at;

      if (!lastReadAt) {
        // If no read status, count all messages
        return await this.getAllMessageCount(chatType, roomId);
      }

      // Count messages after last read time
      const messageTable = this.getMessageTableName(chatType);
      const roomField = this.getRoomFieldName(chatType);

      let query = supabase
        .from(messageTable)
        .select('*', { count: 'exact', head: true })
        .gt('created_at', lastReadAt);

      if (roomField) {
        query = query.eq(roomField, roomId);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  }

  /**
   * Mark all messages as read for a user in a specific room
   */
  static async markAllAsRead(
    chatType: ChatType,
    roomId: string,
    userId: string
  ): Promise<void> {
    return this.updateReadStatus(chatType, roomId, userId);
  }

  /**
   * Get unread counts for all rooms for a user
   */
  static async getAllUnreadCounts(
    chatType: ChatType,
    userId: string
  ): Promise<Record<string, number>> {
    if (chatType === 'community') {
      return {};
    }

    try {
      const table = this.getTableName(chatType);
      const roomField = this.getRoomFieldName(chatType);
      
      if (!table || !roomField) {
        return {};
      }

      // Get all rooms for the user with their read status
      const { data: userRooms } = await supabase
        .from(table)
        .select(`${roomField}, last_read_at`)
        .eq('user_id', userId);

      if (!userRooms) {
        return {};
      }

      const unreadCounts: Record<string, number> = {};

      // Calculate unread count for each room
      for (const room of userRooms) {
        const roomId = room[roomField];
        const count = await this.getUnreadCount(chatType, roomId, userId);
        unreadCounts[roomId] = count;
      }

      return unreadCounts;
    } catch (error) {
      console.error('Error getting all unread counts:', error);
      return {};
    }
  }

  /**
   * Subscribe to read status changes
   */
  static subscribeToReadStatus(
    chatType: ChatType,
    roomId: string,
    userId: string,
    callback: (status: ReadStatus) => void
  ): () => void {
    if (chatType === 'community') {
      return () => {}; // No-op for community chat
    }

    const table = this.getTableName(chatType);
    const roomField = this.getRoomFieldName(chatType);
    
    if (!table || !roomField) {
      return () => {};
    }

    const channelName = `read-status-${chatType}-${roomId}-${userId}`;
    
    const channel = supabase.channel(channelName);

    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table,
        filter: `${roomField}=eq.${roomId} AND user_id=eq.${userId}`
      },
      (payload) => {
        callback({
          last_read_at: payload.new.last_read_at,
          room_id: roomId,
          user_id: userId,
          unread_count: 0
        });
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Get total message count for a room
   */
  private static async getAllMessageCount(
    chatType: ChatType,
    roomId: string
  ): Promise<number> {
    const messageTable = this.getMessageTableName(chatType);
    const roomField = this.getRoomFieldName(chatType);

    try {
      let query = supabase
        .from(messageTable)
        .select('*', { count: 'exact', head: true });

      if (roomField) {
        query = query.eq(roomField, roomId);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error getting message count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getAllMessageCount:', error);
      return 0;
    }
  }

  /**
   * Get table name for read status tracking
   */
  private static getTableName(chatType: ChatType): string | null {
    switch (chatType) {
      case 'group':
        return 'group_members';
      case 'event':
        return 'event_participants';
      case 'community':
      default:
        return null; // Community doesn't track read status
    }
  }

  /**
   * Get message table name
   */
  private static getMessageTableName(chatType: ChatType): string {
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
   * Get room field name
   */
  private static getRoomFieldName(chatType: ChatType): string | null {
    switch (chatType) {
      case 'group':
        return 'group_id';
      case 'event':
        return 'event_id';
      case 'community':
      default:
        return null;
    }
  }
}