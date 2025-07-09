export type ClimbingType = 'top_rope' | 'lead' | 'bouldering' | 'mixed';
export type BelayGroupPrivacy = 'public' | 'private';
export type BelayGroupStatus = 'active' | 'full' | 'disabled';

export interface BelayGroup {
  id: string;
  gym_id: string;
  creator_id: string;
  name: string;
  description?: string;
  climbing_type: ClimbingType | string; // Allow string to match database response
  location: string;
  session_date: string;
  privacy: BelayGroupPrivacy | string; // Allow string to match database response
  capacity: number;
  status: BelayGroupStatus | string; // Allow string to match database response
  created_at: string;
  updated_at: string;
  
  // Joined data from queries
  creator_name?: string;
  creator_avatar?: string;
  participant_count?: number;
  participants?: BelayGroupParticipant[];
  gym_name?: string;
  is_participant?: boolean;
  creator?: {
    id?: string;
    display_name: string;
    avatar_url?: string;
  };
  gym?: {
    id?: string;
    name: string;
  };
}

export interface BelayGroupParticipant {
  belay_group_id?: string; // Make optional for flexible usage
  user_id: string;
  joined_at?: string; // Make optional for flexible usage
  
  // Joined data from queries
  display_name?: string;
  avatar_url?: string;
  profiles?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface BelayGroupMessage {
  id: string;
  belay_group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  
  // Joined data from queries
  display_name?: string;
  avatar_url?: string;
  profiles?: {
    display_name: string;
    avatar_url?: string;
  } | null;
}

export interface CreateBelayGroupData {
  gym_id: string;
  name: string;
  description?: string;
  climbing_type: ClimbingType;
  location: string;
  session_date: string;
  privacy: BelayGroupPrivacy;
  capacity: number;
}

export interface BelayGroupWithDetails extends BelayGroup {
  creator: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
  gym: {
    id: string;
    name: string;
  };
  participants: Array<{
    belay_group_id?: string; // Make optional to match interface
    user_id: string;
    display_name: string;
    avatar_url?: string;
    joined_at: string;
  }>;
}

export const CLIMBING_TYPE_LABELS: Record<ClimbingType, string> = {
  top_rope: 'Top Rope',
  lead: 'Lead Climbing',
  bouldering: 'Bouldering',
  mixed: 'Mixed (Any Style)'
};

export const CLIMBING_TYPE_ICONS: Record<ClimbingType, string> = {
  top_rope: '🧗‍♂️',
  lead: '🪢',
  bouldering: '🗿',
  mixed: '🎯'
};