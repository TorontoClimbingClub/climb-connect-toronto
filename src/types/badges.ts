
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface EventAttendanceApproval {
  id: string;
  event_id: string;
  user_id: string;
  approved_by: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approved_at: string | null;
  created_at: string;
  event?: {
    title: string;
    date: string;
  };
  user?: {
    full_name: string;
  };
}
