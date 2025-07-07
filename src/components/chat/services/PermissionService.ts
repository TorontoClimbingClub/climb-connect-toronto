import { supabase } from '@/integrations/supabase/client';
import { 
  UserPermissions, 
  PermissionCheck, 
  ChatType,
  DEFAULT_USER_PERMISSIONS,
  ADMIN_PERMISSIONS 
} from '../types';

export class PermissionService {
  /**
   * Check if user has admin privileges
   */
  static async hasAdminAccess(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data?.is_admin || false;
    } catch (error) {
      console.error('Error in hasAdminAccess:', error);
      return false;
    }
  }

  /**
   * Get user permissions for a specific room
   */
  static async getUserPermissions(
    userId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<UserPermissions> {
    try {
      const isAdmin = await this.hasAdminAccess(userId);
      
      if (isAdmin) {
        return ADMIN_PERMISSIONS;
      }

      // For now, return default permissions
      // In the future, this could be extended to check room-specific roles
      return {
        ...DEFAULT_USER_PERMISSIONS,
        // Customize permissions based on chat type
        canCreateEvents: chatType === 'group',
        canPinMessages: false, // Only admins for now
        canManageRoom: false   // Only admins for now
      };
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return DEFAULT_USER_PERMISSIONS;
    }
  }

  /**
   * Check a specific permission
   */
  static async checkPermission(
    userId: string,
    check: PermissionCheck,
    chatType: ChatType,
    roomId?: string
  ): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(userId, chatType, roomId);
      const isAdmin = await this.hasAdminAccess(userId);
      
      return this.evaluatePermission(
        permissions,
        check,
        isAdmin,
        userId,
        check.context
      );
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Check if user can delete a specific message
   */
  static async canDeleteMessage(
    userId: string,
    messageUserId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<boolean> {
    const isAdmin = await this.hasAdminAccess(userId);
    const isOwnMessage = userId === messageUserId;
    
    return isAdmin || isOwnMessage;
  }

  /**
   * Check if user can edit a specific message
   */
  static async canEditMessage(
    userId: string,
    messageUserId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, chatType, roomId);
    const isAdmin = await this.hasAdminAccess(userId);
    const isOwnMessage = userId === messageUserId;
    
    if (isAdmin && permissions.canEditAnyMessage) {
      return true;
    }
    
    return isOwnMessage && permissions.canEditOwnMessages;
  }

  /**
   * Check if user can create events in a room
   */
  static async canCreateEvents(
    userId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, chatType, roomId);
    return permissions.canCreateEvents;
  }

  /**
   * Check if user can upload files
   */
  static async canUploadFiles(
    userId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, chatType, roomId);
    return permissions.canUploadFiles;
  }

  /**
   * Check if user can send voice messages
   */
  static async canSendVoiceMessages(
    userId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, chatType, roomId);
    return permissions.canSendVoiceMessages;
  }

  /**
   * Check if user can react to messages
   */
  static async canReactToMessages(
    userId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, chatType, roomId);
    return permissions.canReactToMessages;
  }

  /**
   * Check if user can mention other users
   */
  static async canMentionUsers(
    userId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, chatType, roomId);
    return permissions.canMentionUsers;
  }

  /**
   * Get permission summary for UI display
   */
  static async getPermissionSummary(
    userId: string,
    chatType: ChatType,
    roomId?: string
  ): Promise<{
    isAdmin: boolean;
    permissions: UserPermissions;
    capabilities: string[];
  }> {
    const isAdmin = await this.hasAdminAccess(userId);
    const permissions = await this.getUserPermissions(userId, chatType, roomId);
    
    const capabilities: string[] = [];
    
    if (permissions.canDeleteOwnMessages) capabilities.push('Delete own messages');
    if (permissions.canDeleteAnyMessage) capabilities.push('Delete any message');
    if (permissions.canEditOwnMessages) capabilities.push('Edit own messages');
    if (permissions.canEditAnyMessage) capabilities.push('Edit any message');
    if (permissions.canCreateEvents) capabilities.push('Create events');
    if (permissions.canUploadFiles) capabilities.push('Upload files');
    if (permissions.canSendVoiceMessages) capabilities.push('Send voice messages');
    if (permissions.canMentionUsers) capabilities.push('Mention users');
    if (permissions.canReactToMessages) capabilities.push('React to messages');
    if (permissions.canPinMessages) capabilities.push('Pin messages');
    if (permissions.canManageRoom) capabilities.push('Manage room');
    
    return {
      isAdmin,
      permissions,
      capabilities
    };
  }

  /**
   * Evaluate a permission check
   */
  private static evaluatePermission(
    permissions: UserPermissions,
    check: PermissionCheck,
    isAdmin: boolean,
    userId: string,
    context?: any
  ): boolean {
    const { action, resource } = check;
    
    switch (action) {
      case 'delete':
        if (resource === 'message') {
          if (isAdmin && permissions.canDeleteAnyMessage) return true;
          return context?.isOwnResource && permissions.canDeleteOwnMessages;
        }
        break;
        
      case 'edit':
        if (resource === 'message') {
          if (isAdmin && permissions.canEditAnyMessage) return true;
          return context?.isOwnResource && permissions.canEditOwnMessages;
        }
        break;
        
      case 'upload':
        return permissions.canUploadFiles;
        
      case 'voice':
        return permissions.canSendVoiceMessages;
        
      case 'react':
        return permissions.canReactToMessages;
        
      case 'mention':
        return permissions.canMentionUsers;
        
      case 'create_event':
        return permissions.canCreateEvents;
        
      case 'pin':
        return permissions.canPinMessages;
        
      case 'manage':
        return permissions.canManageRoom;
        
      default:
        return false;
    }
    
    return false;
  }
}