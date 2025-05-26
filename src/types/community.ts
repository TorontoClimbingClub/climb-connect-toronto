
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
}
