
export interface CommunityMember {
  id: string;
  full_name: string;
  phone: string | null;
  climbing_description: string | null;
  is_carpool_driver: boolean;
  passenger_capacity: number;
  equipment_count?: number;
  events_count?: number;
  climbing_level?: string;
  climbing_experience?: string[];
  bio?: string;
  profile_photo_url?: string | null;
  allow_profile_viewing?: boolean;
  show_climbing_progress?: boolean;
  show_completion_stats?: boolean;
  show_climbing_level?: boolean;
  show_trad_progress?: boolean;
  show_sport_progress?: boolean;
  show_top_rope_progress?: boolean;
}
