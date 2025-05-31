
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeEvents = (onEventChange?: () => void, onParticipationChange?: (eventId: string, joined: boolean) => void) => {
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
          onEventChange?.();
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
            onParticipationChange?.(payload.new.event_id, true);
          } else if (payload.eventType === 'DELETE') {
            onParticipationChange?.(payload.old.event_id, false);
          }
          onEventChange?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [onEventChange, onParticipationChange]);
};
