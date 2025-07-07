import { supabase } from '@/integrations/supabase/client';

/**
 * Soft delete a message instead of permanently removing it
 * This follows industry standards like WhatsApp/Facebook Messenger
 */
export async function softDeleteMessage(
  tableName: 'messages' | 'group_messages' | 'event_messages' | 'club_messages',
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(tableName)
      .update({ 
        deleted_at: new Date().toISOString(),
        deleted_by: (await supabase.auth.getUser()).data.user?.id 
      })
      .eq('id', messageId);

    if (error) {
      console.error('Soft delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Soft delete exception:', error);
    return { success: false, error: 'Failed to delete message' };
  }
}

/**
 * Generate a unique client message ID for deduplication
 * Prevents duplicate messages from network retries
 */
export function generateClientMessageId(): string {
  // Combination of timestamp and random string for uniqueness
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
}

/**
 * Mark a message as delivered (for future delivery tracking)
 */
export async function markMessageDelivered(
  tableName: 'messages' | 'group_messages' | 'event_messages' | 'club_messages',
  messageId: string
): Promise<void> {
  try {
    await supabase
      .from(tableName)
      .update({ delivered_at: new Date().toISOString() })
      .eq('id', messageId);
  } catch (error) {
    console.error('Failed to mark message as delivered:', error);
  }
}

/**
 * Check if a message is deleted (for UI display)
 */
export function isMessageDeleted(message: any): boolean {
  return message.deleted_at !== null && message.deleted_at !== undefined;
}

/**
 * Format deleted message display
 */
export function formatDeletedMessage(message: any): string {
  if (!isMessageDeleted(message)) return message.content;
  
  // Show different text based on who deleted it
  const currentUserId = (window as any).__supabase_user_id; // We'll set this globally
  if (message.deleted_by === currentUserId) {
    return "You deleted this message";
  } else if (message.deleted_by) {
    return "This message was deleted";
  }
  return "This message was deleted";
}