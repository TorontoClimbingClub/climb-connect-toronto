
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_participants: number | null;
  difficulty_level: string | null;
  organizer_id: string;
  participants_count?: number;
  carpool_seats?: number;
  equipment_count?: number;
}

export function useEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userParticipations, setUserParticipations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true });

      if (error) throw error;

      // Fetch additional stats for each event
      const eventsWithStats = await Promise.all(
        (events || []).map(async (event) => {
          const [participantsResult, carpoolResult, equipmentResult] = await Promise.all([
            supabase.from('event_participants').select('*', { count: 'exact' }).eq('event_id', event.id),
            supabase.from('event_participants').select('available_seats').eq('event_id', event.id).not('available_seats', 'is', null),
            supabase.from('event_equipment').select('*', { count: 'exact' }).eq('event_id', event.id)
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

      setUpcomingEvents(eventsWithStats);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserParticipations = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', userId);

      if (error) throw error;
      
      const participatedEventIds = new Set(data?.map(p => p.event_id) || []);
      setUserParticipations(participatedEventIds);
    } catch (error) {
      console.error('Error fetching user participations:', error);
    }
  };

  const updateUserParticipation = (eventId: string, joined: boolean) => {
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
    const abortController = new AbortController();
    
    fetchEvents();

    return () => {
      abortController.abort();
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
