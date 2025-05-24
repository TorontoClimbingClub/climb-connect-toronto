
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Users, Car, Package } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEventActions } from "@/hooks/useEventActions";
import { Navigation } from "@/components/Navigation";

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

export default function Events() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userParticipations, setUserParticipations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { joinEvent, loading: actionLoading } = useEventActions();

  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchUserParticipations();
    }
  }, [user]);

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

  const fetchUserParticipations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('event_participants')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const participatedEventIds = new Set(data?.map(p => p.event_id) || []);
      setUserParticipations(participatedEventIds);
    } catch (error) {
      console.error('Error fetching user participations:', error);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join events",
        variant: "destructive",
      });
      return;
    }

    const result = await joinEvent(eventId, user.id);
    if (result.success) {
      setUserParticipations(prev => new Set([...prev, eventId]));
      fetchEvents(); // Refresh to update participant counts
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Upcoming Events</h1>
          <p className="text-stone-600">Join climbing events and adventures</p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showJoinButton={!!user}
                userJoined={userParticipations.has(event.id)}
                onJoin={() => handleJoinEvent(event.id)}
                isLoading={actionLoading}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 mb-4">No upcoming events scheduled</p>
              <p className="text-sm text-stone-500">Check back later for new climbing adventures!</p>
            </CardContent>
          </Card>
        )}
      </div>
      <Navigation />
    </div>
  );
}
