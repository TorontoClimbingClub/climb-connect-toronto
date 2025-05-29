
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEvents } from './useEvents';

export const useRealtimeEvents = () => {
  const { fetchEvents, updateUserParticipation } = useEvents();

  useEffect(() => {
    // Subscribe to events changes
    const eventsChannel = supabase
      .channel('events-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('🔄 Event updated:', payload);
          fetchEvents();
        }
      )
      .subscribe();

    // Subscribe to event participants changes
    const participantsChannel = supabase
      .channel('participants-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants'
        },
        (payload) => {
          console.log('🔄 Participant updated:', payload);
          if (payload.eventType === 'INSERT') {
            updateUserParticipation(payload.new.event_id, true);
          } else if (payload.eventType === 'DELETE') {
            updateUserParticipation(payload.old.event_id, false);
          }
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [fetchEvents, updateUserParticipation]);
};
