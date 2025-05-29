
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { EventParticipantItemProps } from "@/types/eventParticipants";
import { AttendanceBadge } from "./AttendanceBadge";
import { AttendanceButtons } from "./AttendanceButtons";
import { getUserInitials } from "@/utils/userUtils";

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
        <AttendanceBadge 
          status={localStatus}
          participantUserId={participant.user_id}
          participantName={participant.full_name}
        />
      </div>
      
      <AttendanceButtons
        status={localStatus}
        participantName={participant.full_name}
        isUpdating={isUpdating}
        onConfirm={handleConfirm}
        onReject={handleReject}
        onReset={onResetAttendance ? handleReset : undefined}
      />
    </div>
  );
}
