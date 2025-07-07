import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  UserPermissions, 
  PermissionCheck, 
  ChatType,
  DEFAULT_USER_PERMISSIONS,
  ADMIN_PERMISSIONS 
} from '../types';

interface UseChatPermissionsOptions {
  chatType: ChatType;
  roomId?: string;
  enabled?: boolean;
}

export function useChatPermissions({
  chatType,
  roomId,
  enabled = true
}: UseChatPermissionsOptions) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState<UserPermissions>(DEFAULT_USER_PERMISSIONS);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin
  const checkAdminStatus = useCallback(async () => {
    if (!enabled || !user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      const adminStatus = data?.is_admin || false;
      setIsAdmin(adminStatus);
      
      // Set permissions based on admin status
      setPermissions(adminStatus ? ADMIN_PERMISSIONS : DEFAULT_USER_PERMISSIONS);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setPermissions(DEFAULT_USER_PERMISSIONS);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, user]);

  // Check specific permission
  const hasPermission = useCallback((action: string, context?: any): boolean => {
    if (!enabled) return false;
    
    switch (action) {
      case 'delete_message':
        if (isAdmin) return true;
        return context?.isOwnMessage || false;
      
      case 'edit_message':
        if (isAdmin && permissions.canEditAnyMessage) return true;
        return context?.isOwnMessage && permissions.canEditOwnMessages;
      
      case 'create_event':
        return permissions.canCreateEvents;
      
      case 'upload_file':
        return permissions.canUploadFiles;
      
      case 'send_voice':
        return permissions.canSendVoiceMessages;
      
      case 'react_message':
        return permissions.canReactToMessages;
      
      case 'mention_users':
        return permissions.canMentionUsers;
      
      case 'pin_message':
        return permissions.canPinMessages;
      
      case 'manage_room':
        return permissions.canManageRoom;
      
      default:
        return false;
    }
  }, [enabled, isAdmin, permissions]);

  // Check if user can delete a specific message
  const canDeleteMessage = useCallback((messageUserId: string): boolean => {
    if (!enabled || !user) return false;
    
    // Admins can delete any message
    if (isAdmin && permissions.canDeleteAnyMessage) return true;
    
    // Users can delete their own messages
    if (user.id === messageUserId && permissions.canDeleteOwnMessages) return true;
    
    return false;
  }, [enabled, user, isAdmin, permissions]);

  // Check if user can edit a specific message
  const canEditMessage = useCallback((messageUserId: string): boolean => {
    if (!enabled || !user) return false;
    
    // Admins can edit any message (if permission allows)
    if (isAdmin && permissions.canEditAnyMessage) return true;
    
    // Users can edit their own messages
    if (user.id === messageUserId && permissions.canEditOwnMessages) return true;
    
    return false;
  }, [enabled, user, isAdmin, permissions]);

  // Get permission-based features for chat configuration
  const getChatFeatures = useCallback(() => {
    return {
      adminDelete: isAdmin && permissions.canDeleteAnyMessage,
      messageEdit: permissions.canEditOwnMessages || (isAdmin && permissions.canEditAnyMessage),
      eventCreation: permissions.canCreateEvents,
      fileUpload: permissions.canUploadFiles,
      voiceMessages: permissions.canSendVoiceMessages,
      reactions: permissions.canReactToMessages,
      mentions: permissions.canMentionUsers,
      pinMessages: permissions.canPinMessages
    };
  }, [isAdmin, permissions]);

  // Delete message with permission check
  const deleteMessageWithPermission = useCallback(async (
    messageId: string, 
    messageUserId: string,
    deleteFunction: (messageId: string) => Promise<boolean>
  ): Promise<boolean> => {
    if (!canDeleteMessage(messageUserId)) {
      console.warn('User does not have permission to delete this message');
      return false;
    }
    
    const confirmed = confirm('Are you sure you want to delete this message? This action cannot be undone.');
    if (!confirmed) return false;
    
    return deleteFunction(messageId);
  }, [canDeleteMessage]);

  // Check admin status when user changes
  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return {
    isAdmin,
    permissions,
    isLoading,
    hasPermission,
    canDeleteMessage,
    canEditMessage,
    getChatFeatures,
    deleteMessageWithPermission,
    checkAdminStatus
  };
}