
import { useState, useEffect, useCallback, useRef } from "react";
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
  const fetchingRef = useRef(false);
  const lastEventIdsRef = useRef<string>('');

  // Set up real-time subscriptions for participants and approvals
  useEffect(() => {
    const participantsChannel = supabase
      .channel('admin-participants-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants'
        },
        (payload) => {
          console.log('🔄 Event participants updated:', payload);
          // Debounce to prevent rapid updates
          setTimeout(() => {
            if (!fetchingRef.current) {
              refreshApprovals();
            }
          }, 500);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        (payload) => {
          console.log('🔄 Attendance approvals updated:', payload);
          refreshApprovals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(participantsChannel);
    };
  }, [refreshApprovals]);

  const fetchEventsWithParticipants = useCallback(async (events: Event[]) => {
    if (!events || events.length === 0) {
      console.log('No events provided to fetchEventsWithParticipants');
      setEventsWithParticipants([]);
      setLoading(false);
      return;
    }

    // Prevent concurrent fetches
    if (fetchingRef.current) {
      console.log('Already fetching, skipping...');
      return;
    }

    const eventIds = events.map(e => e.id).sort().join(',');
    if (eventIds === lastEventIdsRef.current && eventsWithParticipants.length > 0) {
      console.log('Same events already loaded, skipping...');
      return;
    }

    fetchingRef.current = true;
    lastEventIdsRef.current = eventIds;
    setLoading(true);
    console.log('Fetching participants for events:', events.length);
    
    try {
      const eventsWithParticipantsData = await Promise.all(
        events.map(async (event) => {
          try {
            // Fetch participants and their profiles separately to avoid join issues
            const { data: participants, error: participantsError } = await supabase
              .from('event_participants')
              .select('id, user_id')
              .eq('event_id', event.id);

            if (participantsError) {
              console.error('Error fetching participants for event', event.id, participantsError);
              return {
                ...event,
                participants: [],
                participants_count: 0,
                event_date_time: new Date(`${event.date}T${event.time}`)
              };
            }

            console.log(`Fetched ${participants?.length || 0} participants for event ${event.id}`);

            // Fetch profile data for each participant
            const participantsWithProfiles = await Promise.all(
              (participants || []).map(async (participant) => {
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('full_name, profile_photo_url')
                  .eq('id', participant.user_id)
                  .single();

                if (profileError || !profile) {
                  console.warn('Could not fetch profile for user:', participant.user_id, profileError);
                  return {
                    id: participant.id,
                    user_id: participant.user_id,
                    full_name: 'Unknown User',
                    profile_photo_url: null,
                  };
                }

                return {
                  id: participant.id,
                  user_id: participant.user_id,
                  full_name: profile.full_name || 'Unknown User',
                  profile_photo_url: profile.profile_photo_url,
                };
              })
            );

            const eventApprovals = approvals.filter(approval => approval.event_id === event.id);

            const participantsWithStatus = participantsWithProfiles.map(participant => {
              const approval = eventApprovals.find(a => a.user_id === participant.user_id);
              return {
                ...participant,
                attendance_status: approval?.status || 'pending',
                approval_id: approval?.id
              };
            });

            return {
              ...event,
              participants: participantsWithStatus,
              participants_count: participantsWithStatus.length,
              event_date_time: new Date(`${event.date}T${event.time}`)
            };
          } catch (eventError) {
            console.error('Error processing event', event.id, eventError);
            return {
              ...event,
              participants: [],
              participants_count: 0,
              event_date_time: new Date(`${event.date}T${event.time}`)
            };
          }
        })
      );

      console.log('Successfully fetched events with participants:', eventsWithParticipantsData.map(e => ({
        id: e.id,
        title: e.title,
        participantCount: e.participants.length
      })));
      
      setEventsWithParticipants(eventsWithParticipantsData);
    } catch (error: any) {
      console.error('Error fetching events with participants:', error);
      const eventsWithoutParticipants = events.map(event => ({
        ...event,
        participants: [],
        participants_count: 0,
        event_date_time: new Date(`${event.date}T${event.time}`)
      }));
      setEventsWithParticipants(eventsWithoutParticipants);
      
      toast({
        title: "Warning",
        description: "Events loaded but participant data may be incomplete",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [approvals, toast]);

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

  const handleResetAttendance = async (participantUserId: string, eventId: string) => {
    try {
      const existingApproval = approvals.find(
        a => a.user_id === participantUserId && a.event_id === eventId
      );

      if (existingApproval) {
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
    eventsWithParticipants,
    loading,
    fetchEventsWithParticipants,
    handleConfirmAttendance,
    handleRejectAttendance,
    handleResetAttendance
  };
};
