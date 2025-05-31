
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define the type locally since we deleted the badges types file
interface EventAttendanceApproval {
  id: string;
  user_id: string;
  event_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  event?: { title: string; date: string };
  user?: { full_name: string };
}

export function useAttendanceApprovals() {
  const [approvals, setApprovals] = useState<EventAttendanceApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchApprovals = async () => {
    try {
      // First get the approvals
      const { data: approvalsData, error: approvalsError } = await supabase
        .from('event_attendance_approvals')
        .select('*')
        .order('created_at', { ascending: false });

      if (approvalsError) throw approvalsError;

      // Then get events and profiles separately to avoid join issues
      const eventIds = [...new Set(approvalsData?.map(a => a.event_id) || [])];
      const userIds = [...new Set(approvalsData?.map(a => a.user_id) || [])];

      const [{ data: eventsData }, { data: profilesData }] = await Promise.all([
        supabase.from('events').select('id, title, date').in('id', eventIds),
        supabase.from('profiles').select('id, full_name').in('id', userIds)
      ]);

      // Map the data together
      const enrichedApprovals = approvalsData?.map(approval => ({
        ...approval,
        status: approval.status as 'pending' | 'approved' | 'rejected',
        event: eventsData?.find(e => e.id === approval.event_id) || { title: 'Unknown Event', date: '' },
        user: profilesData?.find(p => p.id === approval.user_id) || { full_name: 'Unknown User' }
      })) || [];

      setApprovals(enrichedApprovals);
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
