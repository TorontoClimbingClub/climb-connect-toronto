// Permission and admin-related types
export interface UserPermissions {
  canDeleteOwnMessages: boolean;
  canDeleteAnyMessage: boolean;
  canEditOwnMessages: boolean;
  canEditAnyMessage: boolean;
  canCreateEvents: boolean;
  canUploadFiles: boolean;
  canSendVoiceMessages: boolean;
  canMentionUsers: boolean;
  canReactToMessages: boolean;
  canPinMessages: boolean;
  canManageRoom: boolean;
}

export interface AdminCapabilities {
  canDeleteMessages: boolean;
  canEditMessages: boolean;
  canBanUsers: boolean;
  canMuteUsers: boolean;
  canManagePermissions: boolean;
  canViewAuditLog: boolean;
  canExportData: boolean;
}

export interface RoomRole {
  id: string;
  name: string;
  permissions: UserPermissions;
  is_admin: boolean;
  is_moderator: boolean;
  can_assign_roles: boolean;
}

export interface UserRole {
  user_id: string;
  room_id: string;
  role: RoomRole;
  assigned_at: string;
  assigned_by: string;
}

export interface PermissionCheck {
  action: PermissionAction;
  resource: PermissionResource;
  context?: PermissionContext;
}

export type PermissionAction = 
  | 'delete' 
  | 'edit' 
  | 'react' 
  | 'reply' 
  | 'mention' 
  | 'upload' 
  | 'voice' 
  | 'create_event' 
  | 'pin' 
  | 'manage';

export type PermissionResource = 
  | 'message' 
  | 'room' 
  | 'user' 
  | 'event' 
  | 'file';

export interface PermissionContext {
  messageUserId?: string;
  roomId?: string;
  targetUserId?: string;
  messageId?: string;
  isOwnResource?: boolean;
}

export interface PermissionService {
  checkPermission: (
    userId: string, 
    check: PermissionCheck
  ) => Promise<boolean>;
  getUserPermissions: (
    userId: string, 
    roomId: string
  ) => Promise<UserPermissions>;
  hasAdminAccess: (
    userId: string, 
    roomId?: string
  ) => Promise<boolean>;
  canDeleteMessage: (
    userId: string, 
    messageUserId: string, 
    roomId: string
  ) => Promise<boolean>;
  canEditMessage: (
    userId: string, 
    messageUserId: string, 
    roomId: string
  ) => Promise<boolean>;
}

// Default permission sets
export const DEFAULT_USER_PERMISSIONS: UserPermissions = {
  canDeleteOwnMessages: true,
  canDeleteAnyMessage: false,
  canEditOwnMessages: true,
  canEditAnyMessage: false,
  canCreateEvents: false,
  canUploadFiles: true,
  canSendVoiceMessages: true,
  canMentionUsers: true,
  canReactToMessages: true,
  canPinMessages: false,
  canManageRoom: false
};

export const ADMIN_PERMISSIONS: UserPermissions = {
  canDeleteOwnMessages: true,
  canDeleteAnyMessage: true,
  canEditOwnMessages: true,
  canEditAnyMessage: true,
  canCreateEvents: true,
  canUploadFiles: true,
  canSendVoiceMessages: true,
  canMentionUsers: true,
  canReactToMessages: true,
  canPinMessages: true,
  canManageRoom: true
};

export const MODERATOR_PERMISSIONS: UserPermissions = {
  canDeleteOwnMessages: true,
  canDeleteAnyMessage: true,
  canEditOwnMessages: true,
  canEditAnyMessage: false,
  canCreateEvents: true,
  canUploadFiles: true,
  canSendVoiceMessages: true,
  canMentionUsers: true,
  canReactToMessages: true,
  canPinMessages: true,
  canManageRoom: false
};