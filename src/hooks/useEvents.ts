
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types";
import { handleSupabaseError, logError } from "@/utils/error";

export function useEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userParticipations, setUserParticipations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  const fetchEvents = async () => {
    const abortController = new AbortController();
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .abortSignal(abortController.signal);

      if (error) throw error;

      // Fetch additional stats for each event
      const eventsWithStats = await Promise.all(
        (events || []).map(async (event) => {
          if (!mountedRef.current) return null;

          const [participantsResult, carpoolResult, equipmentResult] = await Promise.all([
            supabase.from('event_participants').select('*', { count: 'exact' }).eq('event_id', event.id).abortSignal(abortController.signal),
            supabase.from('event_participants').select('available_seats').eq('event_id', event.id).not('available_seats', 'is', null).abortSignal(abortController.signal),
            supabase.from('event_equipment').select('*', { count: 'exact' }).eq('event_id', event.id).abortSignal(abortController.signal)
          ]);

          const totalCarpoolSeats = carpoolResult.data?.reduce((sum, p) => sum + (p.available_seats || 0), 0) || 0;

          return {
            ...event,
            participants_count: participantsResult.count || 0,
            carpool_seats: totalCarpoolSeats,
            equipment_count: equipmentResult.count || 0
          };
        })
      );

      const validEvents = eventsWithStats.filter(Boolean) as Event[];

      if (mountedRef.current) {
        setUpcomingEvents(validEvents);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && mountedRef.current) {
        const apiError = handleSupabaseError(error);
        logError('fetchEvents', error);
        
        toast({
          title: "Error",
          description: apiError.message || "Failed to load events",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }

    return () => {
      abortController.abort();
    };
  };

  const fetchUserParticipations = async (userId: string) => {
    const abortController = new AbortController();
    
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', userId)
        .abortSignal(abortController.signal);

      if (error) throw error;
      
      if (mountedRef.current) {
        const participatedEventIds = new Set(data?.map(p => p.event_id) || []);
        setUserParticipations(participatedEventIds);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        logError('fetchUserParticipations', error);
      }
    }

    return () => {
      abortController.abort();
    };
  };

  const updateUserParticipation = (eventId: string, joined: boolean) => {
    if (!mountedRef.current) return;
    
    if (joined) {
      setUserParticipations(prev => new Set([...prev, eventId]));
    } else {
      setUserParticipations(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    
    const cleanup = fetchEvents();

    return () => {
      mountedRef.current = false;
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    upcomingEvents,
    userParticipations,
    loading,
    fetchEvents,
    fetchUserParticipations,
    updateUserParticipation
  };
}
