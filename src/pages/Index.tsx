
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Car, Package, Mountain, ArrowRight } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEventActions } from "@/hooks/useEventActions";
import { Navigation } from "@/components/Navigation";
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
  carpool_seats?: number;
  equipment_count?: number;
}

export default function Index() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userParticipations, setUserParticipations] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { joinEvent, loading: actionLoading } = useEventActions();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingEvents();
    if (user) {
      fetchUserParticipations();
    }
  }, [user]);

  const fetchUpcomingEvents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(3);

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
      navigate('/auth');
      return;
    }

    const result = await joinEvent(eventId, user.id);
    if (result.success) {
      setUserParticipations(prev => new Set([...prev, eventId]));
      fetchUpcomingEvents(); // Refresh to update participant counts
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mountain className="h-12 w-12 text-[#E55A2B]" />
          </div>
          <h1 className="text-3xl font-bold text-[#E55A2B] mb-2">
            Toronto Climbing Club
          </h1>
          <p className="text-stone-600">
            Join the community of passionate climbers in Toronto
          </p>
        </div>

        {/* Welcome Message or Auth CTA */}
        {!user ? (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-[#E55A2B] mb-2">Welcome!</h2>
              <p className="text-stone-600 mb-4">
                Sign up to join climbing events, share gear, and connect with fellow climbers.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-[#E55A2B] hover:bg-[#D14B20] text-white"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold text-[#E55A2B] mb-2">
                Welcome back, {user.email?.split('@')[0]}!
              </h2>
              <p className="text-stone-600">
                Ready for your next climbing adventure?
              </p>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#E55A2B]">Upcoming Events</h2>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/events')}
              className="text-[#E55A2B] hover:bg-orange-50"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
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
                <Calendar className="h-8 w-8 text-stone-400 mx-auto mb-2" />
                <p className="text-stone-600">No upcoming events</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/community')}
          >
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-[#E55A2B] mx-auto mb-2" />
              <p className="font-medium text-[#E55A2B]">Community</p>
              <p className="text-xs text-stone-600">Meet climbers</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/gear')}
          >
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-[#E55A2B] mx-auto mb-2" />
              <p className="font-medium text-[#E55A2B]">Gear</p>
              <p className="text-xs text-stone-600">Manage equipment</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
