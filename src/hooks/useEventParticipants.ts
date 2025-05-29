
import { useAttendanceManagement } from "./useAttendanceManagement";
import { useParticipantData } from "./useParticipantData";
import { useEventParticipantsRealtime } from "./useEventParticipantsRealtime";

export const useEventParticipants = () => {
  const {
    approvals,
    handleConfirmAttendance,
    handleRejectAttendance,
    handleResetAttendance,
    refreshApprovals
  } = useAttendanceManagement();

  const {
    eventsWithParticipants,
    loading,
    fetchEventsWithParticipants
  } = useParticipantData(approvals);

  // Set up real-time subscriptions with proper refresh function
  useEventParticipantsRealtime(refreshApprovals);

  return {
    eventsWithParticipants,
    loading,
    fetchEventsWithParticipants,
    handleConfirmAttendance,
    handleRejectAttendance,
    handleResetAttendance
  };
};
