
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { EventCard } from "@/components/events/EventCard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events_with_participants')
        .select('*')
        .order('date', { ascending: true });

      const { data: eventsData, error } = await query;

      if (error) throw error;

      let eventsWithUserStatus = eventsData || [];

      if (user) {
        const eventIds = eventsData?.map(event => event.id) || [];
        if (eventIds.length > 0) {
          const { data: participantsData, error: participantsError } = await supabase
            .from('event_participants')
            .select('event_id')
            .eq('user_id', user.id)
            .in('event_id', eventIds);

          if (participantsError) throw participantsError;

          const joinedEventIds = new Set(participantsData?.map(p => p.event_id) || []);
          
          eventsWithUserStatus = eventsData?.map(event => ({
            ...event,
            user_joined: joinedEventIds.has(event.id)
          })) || [];
        }
      }

      setEvents(eventsWithUserStatus);
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

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join events",
        variant: "destructive",
      });
      return;
    }

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

  const handleLeaveEvent = async (eventId: string) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="text-emerald-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      {/* Centered container for all content */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header section - centered */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-800 mb-4">
              Climbing Events
            </h1>
            <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto">
              Discover and join climbing adventures in Toronto
            </p>
          </div>

          {/* Events grid - centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 place-items-center">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      user={user}
                      onEventClick={handleEventClick}
                      onJoinEvent={handleJoinEvent}
                      onLeaveEvent={handleLeaveEvent}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-stone-600 text-lg">No events available at the moment.</p>
                  <p className="text-stone-500 text-sm mt-2">Check back later for new climbing adventures!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
