
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAttendanceApprovals } from "@/hooks/useAttendanceApprovals";

export const useAttendanceManagement = () => {
  const { approvals, approveAttendance, rejectAttendance, refreshApprovals } = useAttendanceApprovals();
  const { toast } = useToast();

  // Helper function to trigger cross-client sync
  const triggerLeaderboardSync = async () => {
    try {
      const syncChannel = supabase.channel('leaderboard-sync');
      await syncChannel.send({
        type: 'broadcast',
        event: 'force_refresh',
        payload: {
          timestamp: Date.now(),
          source: 'attendance_change'
        }
      });
      console.log('🔄 [ATTENDANCE] Triggered leaderboard sync for all clients');
    } catch (error) {
      console.error('❌ [ATTENDANCE] Failed to trigger sync:', error);
    }
  };

  const handleConfirmAttendance = async (participantUserId: string, eventId: string) => {
    try {
      console.log('Confirming attendance for user:', participantUserId, 'event:', eventId);
      
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        console.log('Updating existing approval:', existingApproval.id);
        await approveAttendance(existingApproval.id);
      } else {
        console.log('Creating new approval');
        const { error } = await supabase
          .from('event_attendance_approvals')
          .insert({
            user_id: participantUserId,
            event_id: eventId,
            status: 'approved',
            approved_at: new Date().toISOString()
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Attendance confirmed successfully",
        });

        await refreshApprovals();
      }

      // Trigger cross-client synchronization
      await triggerLeaderboardSync();

    } catch (error: any) {
      console.error('Error confirming attendance:', error);
      toast({
        title: "Error",
        description: "Failed to confirm attendance",
        variant: "destructive",
      });
    }
  };

  const handleRejectAttendance = async (participantUserId: string, eventId: string) => {
    try {
      console.log('Rejecting attendance for user:', participantUserId, 'event:', eventId);
      
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        console.log('Updating existing approval to rejected:', existingApproval.id);
        await rejectAttendance(existingApproval.id);
      } else {
        console.log('Creating new rejection');
        const { error } = await supabase
          .from('event_attendance_approvals')
          .insert({
            user_id: participantUserId,
            event_id: eventId,
            status: 'rejected'
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Attendance marked as not present",
        });

        await refreshApprovals();
      }

      // Trigger cross-client synchronization
      await triggerLeaderboardSync();

    } catch (error: any) {
      console.error('Error rejecting attendance:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive",
      });
    }
  };

  const handleResetAttendance = async (participantUserId: string, eventId: string) => {
    try {
      console.log('Resetting attendance for user:', participantUserId, 'event:', eventId);
      
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        console.log('Deleting approval record:', existingApproval.id);
        const { error } = await supabase
          .from('event_attendance_approvals')
          .delete()
          .eq('id', existingApproval.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Attendance status reset to pending",
        });

        await refreshApprovals();
      }

      // Trigger cross-client synchronization
      await triggerLeaderboardSync();

    } catch (error: any) {
      console.error('Error resetting attendance:', error);
      toast({
        title: "Error",
        description: "Failed to reset attendance status",
        variant: "destructive",
      });
    }
  };

  return {
    approvals,
    handleConfirmAttendance,
    handleRejectAttendance,
    handleResetAttendance,
    refreshApprovals
  };
};
