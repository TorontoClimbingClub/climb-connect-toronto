// Legacy ApiService - use individual services instead
// This file is kept for backward compatibility during transition
// TODO: Remove once all imports are updated to use individual services

import { EventService } from './EventService';
import { GroupService } from './GroupService';
import { MessageService } from './MessageService';
import { DashboardService } from './DashboardService';

export class ApiService {
  // Events - delegate to EventService
  static async getEvents() {
    return EventService.getEvents();
  }

  static async getEventParticipants(eventId: string) {
    return EventService.getEventParticipants(eventId);
  }

  static async joinEvent(eventId: string, userId: string) {
    return EventService.joinEvent(eventId, userId);
  }

  static async leaveEvent(eventId: string, userId: string) {
    return EventService.leaveEvent(eventId, userId);
  }

  static async deleteEvent(eventId: string, userId: string) {
    return EventService.deleteEvent(eventId, userId);
  }

  // Groups - delegate to GroupService
  static async getGroups() {
    return GroupService.getGroups();
  }

  static async getGroupMembers(groupId: string) {
    return GroupService.getGroupMembers(groupId);
  }

  static async joinGroup(groupId: string, userId: string) {
    return GroupService.joinGroup(groupId, userId);
  }

  static async leaveGroup(groupId: string, userId: string) {
    return GroupService.leaveGroup(groupId, userId);
  }

  // Messages - delegate to MessageService
  static async getEventMessages(eventId: string) {
    return MessageService.getEventMessages(eventId);
  }

  static async getGroupMessages(groupId: string) {
    return MessageService.getGroupMessages(groupId);
  }

  static async getClubMessages() {
    return MessageService.getClubMessages();
  }

  // Statistics - delegate to DashboardService
  static async getDashboardStats() {
    return DashboardService.getDashboardStats();
  }
}