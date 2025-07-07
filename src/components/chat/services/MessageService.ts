import { supabase } from '@/integrations/supabase/client';
import { 
  BaseMessage, 
  CommunityMessage, 
  GroupMessage, 
  EventMessage,
  ChatType,
  MessageFilters
} from '../types';

export class MessageService {
  /**
   * Load messages for a specific chat type and room
   */
  static async loadMessages(
    chatType: ChatType, 
    roomId: string
  ): Promise<BaseMessage[]> {
    const table = this.getTableName(chatType);
    const roomField = this.getRoomFieldName(chatType);
    
    try {
      let query = supabase
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
        .order('created_at', { ascending: true });

      // Apply room-specific filters
      if (roomField && chatType !== 'community') {
        query = query.eq(roomField, roomId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to load ${chatType} messages: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error(`Error loading ${chatType} messages:`, error);
      throw error;
    }
  }

  /**
   * Send a new message
   */
  static async sendMessage(
    chatType: ChatType,
    roomId: string,
    content: string,
    userId: string
  ): Promise<BaseMessage> {
    const table = this.getTableName(chatType);
    
    try {
      const messageData: any = {
        content,
        user_id: userId,
      };

      // Add room-specific fields
      if (chatType === 'group') {
        messageData.group_id = roomId;
      } else if (chatType === 'event') {
        messageData.event_id = roomId;
      }

      const { data, error } = await supabase
        .from(table)
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
        throw new Error(`Failed to send ${chatType} message: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error(`Error sending ${chatType} message:`, error);
      throw error;
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(
    chatType: ChatType,
    messageId: string
  ): Promise<void> {
    const table = this.getTableName(chatType);
    
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', messageId);

      if (error) {
        throw new Error(`Failed to delete message: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  /**
   * Edit a message
   */
  static async editMessage(
    chatType: ChatType,
    messageId: string,
    newContent: string
  ): Promise<BaseMessage> {
    const table = this.getTableName(chatType);
    
    try {
      const { data, error } = await supabase
        .from(table)
        .update({
          content: newContent,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select(`
          id,
          content,
          created_at,
          user_id,
          edited_at,
          ${chatType === 'group' ? 'group_id,' : ''}
          ${chatType === 'event' ? 'event_id,' : ''}
          profiles!inner(display_name, avatar_url)
        `)
        .single();

      if (error) {
        throw new Error(`Failed to edit message: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  /**
   * Search messages
   */
  static async searchMessages(
    chatType: ChatType,
    roomId: string,
    searchTerm: string,
    filters?: MessageFilters
  ): Promise<BaseMessage[]> {
    const table = this.getTableName(chatType);
    const roomField = this.getRoomFieldName(chatType);
    
    try {
      let query = supabase
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
        .order('created_at', { ascending: true });

      // Apply room filter
      if (roomField && chatType !== 'community') {
        query = query.eq(roomField, roomId);
      }

      // Apply search filter
      if (searchTerm) {
        query = query.or(`content.ilike.%${searchTerm}%,profiles.display_name.ilike.%${searchTerm}%`);
      }

      // Apply additional filters
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }

      if (filters?.date_range) {
        query = query
          .gte('created_at', filters.date_range.start)
          .lte('created_at', filters.date_range.end);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to search messages: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  /**
   * Get message count for a room
   */
  static async getMessageCount(
    chatType: ChatType,
    roomId: string
  ): Promise<number> {
    const table = this.getTableName(chatType);
    const roomField = this.getRoomFieldName(chatType);
    
    try {
      let query = supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (roomField && chatType !== 'community') {
        query = query.eq(roomField, roomId);
      }

      const { count, error } = await query;

      if (error) {
        throw new Error(`Failed to get message count: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting message count:', error);
      return 0;
    }
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
   * Get room field name based on chat type
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