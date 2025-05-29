import { UserProfile } from './auth';
import { Event } from './events';

export interface User extends UserProfile {
  email?: string;
  user_role?: 'member' | 'organizer' | 'admin';
  bio?: string;
  climbing_description?: string;
  allow_profile_viewing?: boolean;
  show_climbing_progress?: boolean;
  show_completion_stats?: boolean;
  show_climbing_level?: boolean;
  show_trad_progress?: boolean;
  show_sport_progress?: boolean;
  show_top_rope_progress?: boolean;
}

export interface AdminEvent extends Event {
  participants_count?: number;
}

// Keep existing ProfileData interface for backward compatibility
export interface ProfileData extends UserProfile {
  bio?: string;
  climbing_description?: string;
  allow_profile_viewing?: boolean;
  show_climbing_progress?: boolean;
  show_completion_stats?: boolean;
  show_climbing_level?: boolean;
  show_trad_progress?: boolean;
  show_sport_progress?: boolean;
  show_top_rope_progress?: boolean;
}
