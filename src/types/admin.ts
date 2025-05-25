
export interface User {
  id: string;
  email?: string;
  full_name: string;
  phone?: string;
  is_carpool_driver?: boolean;
  passenger_capacity?: number;
  created_at: string;
  updated_at?: string;
  user_role?: 'member' | 'organizer' | 'admin';
  climbing_level?: string;
  climbing_experience?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_participants: number | null;
  difficulty_level: string | null;
  organizer_id: string;
  participants_count?: number;
  required_climbing_level?: string | null;
  capacity_limit?: number | null;
}

export interface ProfileData {
  id: string;
  full_name: string;
  phone?: string;
  is_carpool_driver?: boolean;
  passenger_capacity?: number;
  created_at: string;
  updated_at?: string;
  climbing_level?: string;
  climbing_experience?: string[];
}
