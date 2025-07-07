// Export all chat services from a single entry point
export { MessageService } from './MessageService';
export { RealtimeService } from './RealtimeService';
export { ReadStatusService } from './ReadStatusService';
export { PermissionService } from './PermissionService';

// Service interfaces for dependency injection
export interface IChatServices {
  messageService: typeof MessageService;
  realtimeService: typeof RealtimeService;
  readStatusService: typeof ReadStatusService;
  permissionService: typeof PermissionService;
}

// Default service implementation
export const defaultChatServices: IChatServices = {
  messageService: MessageService,
  realtimeService: RealtimeService,
  readStatusService: ReadStatusService,
  permissionService: PermissionService,
};