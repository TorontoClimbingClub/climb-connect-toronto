
import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/events";

interface EventParticipant {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  attendance_status?: 'pending' | 'approved' | 'rejected';
  approval_id?: string;
}

export const useParticipantData = (approvals: any[]) => {
  const [eventsWithParticipants, setEventsWithParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fetchingRef = useRef(false);
  const lastEventIdsRef = useRef<string>('');

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
            // Fetch participants separately to avoid join issues
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

  return {
    eventsWithParticipants,
    loading,
    fetchEventsWithParticipants
  };
};
