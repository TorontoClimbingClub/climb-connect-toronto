import { useAttendanceManagement } from "./useAttendanceManagement";
import { useParticipantData } from "./useParticipantData";
import { useEventParticipantsRealtime } from "./useEventParticipantsRealtime";

export const useEventParticipants = () => {
  const {
    approvals,
    handleConfirmAttendance,
    handleRejectAttendance,
    handleResetAttendance
  } = useAttendanceManagement();

  const {
    eventsWithParticipants,
    loading,
    fetchEventsWithParticipants
  } = useParticipantData(approvals);

  // Set up real-time subscriptions
  useEventParticipantsRealtime(() => {
    // This will trigger a refresh of approvals which will cascade to participant data
  });

  return {
    eventsWithParticipants,
    loading,
    fetchEventsWithParticipants,
    handleConfirmAttendance,
    handleRejectAttendance,
    handleResetAttendance
  };
};
