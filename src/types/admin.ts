import { UserProfile, Event } from './index';

export interface User extends UserProfile {
  email?: string;
  user_role?: 'member' | 'organizer' | 'admin';
}

export interface AdminEvent extends Event {
  participants_count?: number;
}

// Keep existing ProfileData interface for backward compatibility
export interface ProfileData extends UserProfile {}
