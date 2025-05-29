
export interface Event {
  id: string;
  title: string;
  description: string | null;
  details?: string | null;
  date: string;
  time: string;
  location: string;
  max_participants: number | null;
  difficulty_level: string | null;
  organizer_id: string;
  participants_count?: number;
  carpool_seats?: number;
  available_carpool_seats?: number;
  equipment_count?: number;
  required_climbing_level?: string | null;
  required_climbing_experience?: string[] | null;
  capacity_limit?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface Participant {
  id: string;
  user_id: string;
  is_carpool_driver: boolean | null;
  available_seats: number | null;
  joined_at: string;
  full_name: string;
  phone: string | null;
  carpool_driver_notes?: string | null;
  assigned_driver_id?: string | null;
  needs_carpool?: boolean | null;
}

export interface EventEquipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  user_id: string;
  owner_name: string;
  category_name: string;
}
