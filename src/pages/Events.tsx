
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Car, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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
  user_joined?: boolean;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          event_participants!inner(count)
        `)
        .order('date', { ascending: true });

      const { data: eventsData, error } = await query;

      if (error) throw error;

      if (user) {
        // Check which events the user has joined
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

      fetchEvents(); // Refresh events
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

      fetchEvents(); // Refresh events
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-emerald-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-emerald-800 mb-2">Upcoming Events</h1>
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
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {event.description}
                      </CardDescription>
                    </div>
                    {event.difficulty_level && (
                      <Badge variant="outline" className="ml-2">
                        {event.difficulty_level}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-stone-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  
                  <div className="flex items-center text-sm text-stone-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-stone-600">
                      <Users className="h-4 w-4 mr-2" />
                      {event.participants_count || 0} joined
                      {event.max_participants && ` / ${event.max_participants} max`}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Car className="h-4 w-4 mr-1" />
                        Carpool
                      </Button>
                      <Button size="sm" variant="outline">
                        <Package className="h-4 w-4 mr-1" />
                        Gear
                      </Button>
                    </div>
                  </div>

                  {user && (
                    <div className="pt-2">
                      {event.user_joined ? (
                        <Button 
                          onClick={() => leaveEvent(event.id)}
                          variant="outline" 
                          className="w-full"
                        >
                          Leave Event
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => joinEvent(event.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          Join Event
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
