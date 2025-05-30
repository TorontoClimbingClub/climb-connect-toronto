
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

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
  onConfirmAttendance: (userId: string, eventId: string) => Promise<void>;
  onRejectAttendance: (userId: string, eventId: string) => Promise<void>;
  onResetAttendance?: (userId: string, eventId: string) => Promise<void>;
}

export function EventParticipantItem({ 
  participant, 
  eventId, 
  eventStatus, 
  onConfirmAttendance, 
  onRejectAttendance,
  onResetAttendance
}: EventParticipantItemProps) {
  const [localStatus, setLocalStatus] = useState<'pending' | 'approved' | 'rejected'>(
    participant.attendance_status || 'pending'
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Update local status when participant prop changes
  useEffect(() => {
    setLocalStatus(participant.attendance_status || 'pending');
  }, [participant.attendance_status]);

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAttendanceBadge = () => {
    console.log(`🏷️ [BADGE] User ${participant.full_name} status: ${localStatus}`);
    
    switch (localStatus) {
      case 'approved':
        return (
          <Badge key={`${participant.user_id}-approved`} variant="default" className="text-xs bg-green-600 text-white">
            Confirmed
          </Badge>
        );
      case 'rejected':
        return (
          <Badge key={`${participant.user_id}-rejected`} variant="destructive" className="text-xs bg-red-600 text-white">
            Not Present
          </Badge>
        );
      case 'pending':
      default:
        return null; // Remove the pending badge
    }
  };

  const showAttendanceButtons = true;
  const isPending = localStatus === 'pending';
  const isApproved = localStatus === 'approved';
  const isRejected = localStatus === 'rejected';

  console.log(`🔘 [BUTTONS] User ${participant.full_name} - Pending: ${isPending}, Approved: ${isApproved}, Rejected: ${isRejected}`);

  const handleConfirm = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      setLocalStatus('approved'); // Optimistic update
      await onConfirmAttendance(participant.user_id, eventId);
    } catch (error) {
      console.error('Error confirming attendance:', error);
      setLocalStatus(participant.attendance_status || 'pending'); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      setLocalStatus('rejected'); // Optimistic update
      await onRejectAttendance(participant.user_id, eventId);
    } catch (error) {
      console.error('Error rejecting attendance:', error);
      setLocalStatus(participant.attendance_status || 'pending'); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = async () => {
    if (onResetAttendance && !isUpdating) {
      setIsUpdating(true);
      try {
        setLocalStatus('pending'); // Optimistic update
        await onResetAttendance(participant.user_id, eventId);
      } catch (error) {
        console.error('Error resetting attendance:', error);
        setLocalStatus(participant.attendance_status || 'pending'); // Revert on error
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
          <AvatarImage src={participant.profile_photo_url || undefined} />
          <AvatarFallback className="text-xs">
            {getUserInitials(participant.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <span className="font-medium text-sm sm:text-base truncate block">{participant.full_name}</span>
          <div className="mt-1">
            {getAttendanceBadge()}
          </div>
        </div>
      </div>
      
      {showAttendanceButtons && (
        <div className="flex gap-1 flex-shrink-0">
          {isPending && (
            <>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-auto"
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Present</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReject}
                disabled={isUpdating}
                className="text-red-600 hover:text-red-700 text-xs px-2 py-1 h-auto"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Not Present</span>
              </Button>
            </>
          )}
          
          {(isApproved || isRejected) && onResetAttendance && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={isUpdating}
              className="text-gray-600 hover:text-gray-700 text-xs px-2 py-1 h-auto"
            >
              <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
          
          {isRejected && (
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-auto"
            >
              <Check className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Present</span>
            </Button>
          )}
          
          {isApproved && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-700 text-xs px-2 py-1 h-auto"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Not Present</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
