
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types";
import { handleSupabaseError, logError } from "@/utils/error";

export function useOptimizedEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userParticipations, setUserParticipations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  const fetchEventsWithStats = async () => {
    const abortController = new AbortController();
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Use the new events_with_stats view for better performance
      const { data: events, error } = await supabase
        .from('events_with_stats')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .abortSignal(abortController.signal);

      if (error) throw error;

      if (mountedRef.current) {
        setUpcomingEvents(events || []);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && mountedRef.current) {
        const apiError = handleSupabaseError(error);
        logError('fetchEventsWithStats', error);
        
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
    
    const cleanup = fetchEventsWithStats();

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
    fetchEvents: fetchEventsWithStats,
    fetchUserParticipations,
    updateUserParticipation
  };
}
