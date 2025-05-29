
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAttendanceApprovals } from "@/hooks/useAttendanceApprovals";
import type { Event } from "@/types/events";

interface EventParticipant {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  attendance_status?: 'pending' | 'approved' | 'rejected';
  approval_id?: string;
}

export const useEventParticipants = () => {
  const [eventsWithParticipants, setEventsWithParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { approvals, approveAttendance, rejectAttendance, refreshApprovals } = useAttendanceApprovals();
  const { toast } = useToast();

  const fetchEventsWithParticipants = async (events: Event[]) => {
    setLoading(true);
    try {
      const eventsWithParticipantsData = await Promise.all(
        events.map(async (event) => {
          const { data: participants, error: participantsError } = await supabase
            .from('event_participants')
            .select(`
              id,
              user_id,
              profiles!inner(
                full_name,
                profile_photo_url
              )
            `)
            .eq('event_id', event.id);

          if (participantsError) throw participantsError;

          const eventApprovals = approvals.filter(approval => approval.event_id === event.id);

          const participantsWithStatus = participants?.map(participant => {
            const approval = eventApprovals.find(a => a.user_id === participant.user_id);
            return {
              id: participant.id,
              user_id: participant.user_id,
              full_name: participant.profiles.full_name,
              profile_photo_url: participant.profiles.profile_photo_url,
              attendance_status: approval?.status || 'pending',
              approval_id: approval?.id
            };
          }) || [];

          return {
            ...event,
            participants: participantsWithStatus,
            participants_count: participantsWithStatus.length,
            event_date_time: new Date(`${event.date}T${event.time}`)
          };
        })
      );

      setEventsWithParticipants(eventsWithParticipantsData);
    } catch (error: any) {
      console.error('Error fetching events with participants:', error);
      toast({
        title: "Error",
        description: "Failed to load events and participants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAttendance = async (participantUserId: string, eventId: string) => {
    try {
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        await approveAttendance(existingApproval.id);
      } else {
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
      }

      await refreshApprovals();
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
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
        await rejectAttendance(existingApproval.id);
      } else {
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
      }

      await refreshApprovals();
    } catch (error: any) {
      console.error('Error rejecting attendance:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive",
      });
    }
  };

  return {
    eventsWithParticipants,
    loading,
    fetchEventsWithParticipants,
    handleConfirmAttendance,
    handleRejectAttendance
  };
};
