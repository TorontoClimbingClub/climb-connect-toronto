
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";

interface EventParticipant {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  attendance_status?: 'pending' | 'approved' | 'rejected';
  approval_id?: string;
}

interface EventParticipantItemProps {
  participant: EventParticipant;
  eventId: string;
  eventStatus: string;
  onConfirmAttendance: (userId: string, eventId: string) => void;
  onRejectAttendance: (userId: string, eventId: string) => void;
}

export function EventParticipantItem({ 
  participant, 
  eventId, 
  eventStatus, 
  onConfirmAttendance, 
  onRejectAttendance 
}: EventParticipantItemProps) {
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={participant.profile_photo_url || undefined} />
          <AvatarFallback className="text-xs">
            {getUserInitials(participant.full_name)}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{participant.full_name}</span>
        {participant.attendance_status !== 'pending' && (
          <Badge 
            variant={participant.attendance_status === 'approved' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {participant.attendance_status === 'approved' ? 'Confirmed' : 'Not Present'}
          </Badge>
        )}
      </div>
      
      {eventStatus === 'ended' && participant.attendance_status === 'pending' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onConfirmAttendance(participant.user_id, eventId)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRejectAttendance(participant.user_id, eventId)}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Not Present
          </Button>
        </div>
      )}
    </div>
  );
}
