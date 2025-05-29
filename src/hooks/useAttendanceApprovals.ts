
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EventAttendanceApproval } from "@/types/badges";

export function useAttendanceApprovals() {
  const [approvals, setApprovals] = useState<EventAttendanceApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchApprovals = async () => {
    try {
      const { data, error } = await supabase
        .from('event_attendance_approvals')
        .select(`
          *,
          event:events(title, date),
          user:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovals(data || []);
    } catch (error: any) {
      console.error('Error fetching attendance approvals:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance approvals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveAttendance = async (approvalId: string) => {
    try {
      const { error } = await supabase
        .from('event_attendance_approvals')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', approvalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance approved successfully",
      });

      await fetchApprovals();
    } catch (error: any) {
      console.error('Error approving attendance:', error);
      toast({
        title: "Error",
        description: "Failed to approve attendance",
        variant: "destructive",
      });
    }
  };

  const rejectAttendance = async (approvalId: string) => {
    try {
      const { error } = await supabase
        .from('event_attendance_approvals')
        .update({
          status: 'rejected'
        })
        .eq('id', approvalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance rejected",
      });

      await fetchApprovals();
    } catch (error: any) {
      console.error('Error rejecting attendance:', error);
      toast({
        title: "Error",
        description: "Failed to reject attendance",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  return {
    approvals,
    loading,
    approveAttendance,
    rejectAttendance,
    refreshApprovals: fetchApprovals
  };
}
