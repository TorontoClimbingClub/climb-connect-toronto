import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/events/EventCard";

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
  user_joined?: boolean;
}

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events_with_participants')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      if (user) {
        const { data: userParticipations } = await supabase
          .from('event_participants')
          .select('event_id')
          .eq('user_id', user.id);

        const joinedEventIds = new Set(userParticipations?.map(p => p.event_id) || []);

        const eventsWithJoinStatus = eventsData?.map(event => ({
          ...event,
          user_joined: joinedEventIds.has(event.id)
        })) || [];

        setEvents(eventsWithJoinStatus);
      } else {
        setEvents(eventsData || []);
      }
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

  const joinEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've joined the event",
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive",
      });
    }
  };

  const leaveEvent = async (eventId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've left the event",
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave event",
        variant: "destructive",
      });
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
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
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Upcoming Events</h1>
              <p className="text-stone-600">Join fellow climbers on exciting adventures</p>
            </div>

            <div className="space-y-4">
              {events.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                    <p className="text-stone-600">No upcoming events yet</p>
                  </CardContent>
                </Card>
              ) : (
                events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    user={user}
                    onEventClick={handleEventClick}
                    onJoinEvent={joinEvent}
                    onLeaveEvent={leaveEvent}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
