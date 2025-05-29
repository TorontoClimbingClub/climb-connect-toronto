
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

  // Update local status when participant prop changes - this ensures persistence
  useEffect(() => {
    console.log(`🔄 [STATUS UPDATE] User ${participant.full_name} - Status changed from ${localStatus} to ${participant.attendance_status || 'pending'}`);
    setLocalStatus(participant.attendance_status || 'pending');
  }, [participant.attendance_status, participant.user_id]); // Added participant.user_id to ensure proper updates

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
        return (
          <Badge key={`${participant.user_id}-pending`} variant="secondary" className="text-xs bg-gray-500 text-white">
            Pending
          </Badge>
        );
    }
  };

  // Show attendance buttons for all events - admins can manage attendance anytime
  const showAttendanceButtons = true;
  const isPending = localStatus === 'pending';
  const isApproved = localStatus === 'approved';
  const isRejected = localStatus === 'rejected';

  console.log(`🔘 [BUTTONS] User ${participant.full_name} - Pending: ${isPending}, Approved: ${isApproved}, Rejected: ${isRejected}`);

  const handleConfirm = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onConfirmAttendance(participant.user_id, eventId);
      // Don't set local status here - let it be updated from the prop change
      console.log(`✅ [CONFIRM] User ${participant.full_name} attendance confirmed`);
    } catch (error) {
      console.error('Error confirming attendance:', error);
      // Revert on error
      setLocalStatus(participant.attendance_status || 'pending');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onRejectAttendance(participant.user_id, eventId);
      // Don't set local status here - let it be updated from the prop change
      console.log(`❌ [REJECT] User ${participant.full_name} attendance rejected`);
    } catch (error) {
      console.error('Error rejecting attendance:', error);
      // Revert on error
      setLocalStatus(participant.attendance_status || 'pending');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = async () => {
    if (onResetAttendance && !isUpdating) {
      setIsUpdating(true);
      try {
        await onResetAttendance(participant.user_id, eventId);
        // Don't set local status here - let it be updated from the prop change
        console.log(`🔄 [RESET] User ${participant.full_name} attendance reset`);
      } catch (error) {
        console.error('Error resetting attendance:', error);
        // Revert on error
        setLocalStatus(participant.attendance_status || 'pending');
      } finally {
        setIsUpdating(false);
      }
    }
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
        {getAttendanceBadge()}
      </div>
      
      {showAttendanceButtons && (
        <div className="flex gap-2">
          {isPending && (
            <>
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReject}
                disabled={isUpdating}
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
              onClick={handleReset}
              disabled={isUpdating}
              className="text-gray-600 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
          
          {isRejected && (
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              Confirm
            </Button>
          )}
          
          {isApproved && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              disabled={isUpdating}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Not Present
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
