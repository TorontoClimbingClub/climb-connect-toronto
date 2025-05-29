
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useEventArchiving = () => {
  const { toast } = useToast();

  const archiveEventAttendance = async (eventId: string) => {
    try {
      console.log('Archiving attendance data for event:', eventId);
      
      // Get event details first
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('title, date, organizer_id')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // Get all approved attendance records for this event
      const { data: approvedAttendance, error: attendanceError } = await supabase
        .from('event_attendance_approvals')
        .select('user_id, status, approved_at')
        .eq('event_id', eventId)
        .eq('status', 'approved');

      if (attendanceError) throw attendanceError;

      // Archive the attendance data to a separate table for historical purposes
      if (approvedAttendance && approvedAttendance.length > 0) {
        const archiveData = approvedAttendance.map(approval => ({
          event_id: eventId,
          event_title: event.title,
          event_date: event.date,
          user_id: approval.user_id,
          attended_at: approval.approved_at,
          archived_at: new Date().toISOString()
        }));

        const { error: archiveError } = await supabase
          .from('archived_event_attendance')
          .insert(archiveData);

        if (archiveError) throw archiveError;

        console.log(`Archived ${approvedAttendance.length} attendance records for event ${eventId}`);
      }

      toast({
        title: "Success",
        description: "Event attendance data archived successfully",
      });

    } catch (error: any) {
      console.error('Error archiving event attendance:', error);
      toast({
        title: "Error", 
        description: "Failed to archive attendance data",
        variant: "destructive",
      });
    }
  };

  return {
    archiveEventAttendance
  };
};
