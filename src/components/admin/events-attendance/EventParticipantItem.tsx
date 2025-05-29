
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, RotateCcw } from "lucide-react";

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
  onResetAttendance?: (userId: string, eventId: string) => void;
}

export function EventParticipantItem({ 
  participant, 
  eventId, 
  eventStatus, 
  onConfirmAttendance, 
  onRejectAttendance,
  onResetAttendance
}: EventParticipantItemProps) {
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAttendanceBadge = () => {
    switch (participant.attendance_status) {
      case 'approved':
        return (
          <Badge variant="default" className="text-xs bg-green-600">
            Confirmed
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="text-xs">
            Not Present
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        );
    }
  };

  const showAttendanceButtons = eventStatus === 'ended';
  const isPending = participant.attendance_status === 'pending';
  const isApproved = participant.attendance_status === 'approved';
  const isRejected = participant.attendance_status === 'rejected';

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
        {getAttendanceBadge()}
      </div>
      
      {showAttendanceButtons && (
        <div className="flex gap-2">
          {isPending && (
            <>
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
            </>
          )}
          
          {(isApproved || isRejected) && onResetAttendance && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResetAttendance(participant.user_id, eventId)}
              className="text-gray-600 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
          
          {isApproved && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRejectAttendance(participant.user_id, eventId)}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Not Present
            </Button>
          )}
          
          {isRejected && (
            <Button
              size="sm"
              onClick={() => onConfirmAttendance(participant.user_id, eventId)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Confirm
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
