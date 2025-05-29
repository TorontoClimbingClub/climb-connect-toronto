
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAttendanceApprovals } from "@/hooks/useAttendanceApprovals";

export const useAttendanceManagement = () => {
  const { approvals, approveAttendance, rejectAttendance, refreshApprovals } = useAttendanceApprovals();
  const { toast } = useToast();

  const handleConfirmAttendance = async (participantUserId: string, eventId: string) => {
    try {
      console.log('Confirming attendance for user:', participantUserId, 'event:', eventId);
      
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        console.log('Updating existing approval:', existingApproval.id);
        // Update existing approval to approved status
        await approveAttendance(existingApproval.id);
      } else {
        console.log('Creating new approval');
        // Create new approval
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
        // Update existing approval to rejected status
        await rejectAttendance(existingApproval.id);
      } else {
        console.log('Creating new rejection');
        // Create new rejection
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
        // Delete the approval record to reset to pending
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
