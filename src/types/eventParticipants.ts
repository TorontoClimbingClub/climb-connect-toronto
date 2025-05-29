
export interface EventParticipant {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  attendance_status?: 'pending' | 'approved' | 'rejected';
  approval_id?: string;
}

export interface EventParticipantItemProps {
  participant: EventParticipant;
  eventId: string;
  eventStatus: string;
  onConfirmAttendance: (userId: string, eventId: string) => Promise<void>;
  onRejectAttendance: (userId: string, eventId: string) => Promise<void>;
  onResetAttendance?: (userId: string, eventId: string) => Promise<void>;
}
