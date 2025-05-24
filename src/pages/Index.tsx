import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Mountain, UserPlus, Package } from 'lucide-react';

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
}

export default function Index() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalMembers: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchUpcomingEvents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('events')
        .select('id, title, description, date, time, location, max_participants')
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(3);

      if (error) {
        console.error("Error fetching upcoming events:", error);
        return;
      }

      if (data && data.length > 0) {
        const eventsWithParticipants = await Promise.all(
          data.map(async (event) => {
            const { data: participantsData, error: participantsError } = await supabase
              .from('event_participants')
              .select('count(*)')
              .eq('event_id', event.id);

            if (participantsError) {
              console.error("Error fetching participants count:", participantsError);
              return { ...event, participants_count: 0 };
            }

            const participants_count = participantsData && participantsData.length > 0 ?
              parseInt(participantsData[0].count) : 0;

            return { ...event, participants_count };
          })
        );
        setUpcomingEvents(eventsWithParticipants);
      } else {
        setUpcomingEvents([]);
      }

    } catch (error) {
      console.error("Unexpected error fetching upcoming events:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('count(*)');

      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('count(*)');

      const today = new Date().toISOString().split('T')[0];
      const { data: upcomingEventsData, error: upcomingEventsError } = await supabase
        .from('events')
        .select('count(*)')
        .gte('date', today);

      if (eventsError || membersError || upcomingEventsError) {
        console.error("Error fetching stats:", eventsError, membersError, upcomingEventsError);
        return;
      }

      const totalEvents = eventsData ? parseInt(eventsData[0].count) : 0;
      const totalMembers = membersData ? parseInt(membersData[0].count) : 0;
      const upcomingEventsCount = upcomingEventsData ? parseInt(upcomingEventsData[0].count) : 0;

      setStats({
        totalEvents,
        totalMembers,
        upcomingEvents: upcomingEventsCount
      });

    } catch (error) {
      console.error("Unexpected error fetching stats:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchUpcomingEvents(), fetchStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="text-emerald-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      {/* Responsive container with proper max-width for different screen sizes */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Mountain className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-emerald-800 mb-3 sm:mb-4">
            Climb Connect Toronto
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto px-4">
            Join Toronto's premier climbing community. Discover events, share gear, and connect with fellow climbers.
          </p>
        </div>

        {/* Stats Section - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card>
            <CardContent className="flex flex-col items-center p-4 sm:p-6">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600 mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-emerald-800">{stats.totalEvents}</div>
              <div className="text-xs sm:text-sm text-stone-600">Total Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 sm:p-6">
              <Users className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600 mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-emerald-800">{stats.totalMembers}</div>
              <div className="text-xs sm:text-sm text-stone-600">Community Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4 sm:p-6">
              <Mountain className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600 mb-2 sm:mb-3" />
              <div className="text-2xl sm:text-3xl font-bold text-emerald-800">{stats.upcomingEvents}</div>
              <div className="text-xs sm:text-sm text-stone-600">Upcoming Events</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events Section */}
        <Card className="mb-8 sm:mb-12">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Upcoming Events</CardTitle>
            <CardDescription className="text-sm sm:text-base">Join the next climbing adventures</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-emerald-50 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                      <h3 className="font-semibold text-emerald-800 text-sm sm:text-base truncate">{event.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-stone-600">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                          <span className="truncate">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="flex items-center text-xs sm:text-sm text-stone-600">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span>{event.participants_count || 0} joined</span>
                      </div>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm px-2 sm:px-3">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-stone-600">
                <p className="text-sm sm:text-base">No upcoming events at the moment.</p>
                <p className="text-xs sm:text-sm mt-1">Check back later for new adventures!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6" />
                Join Events
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Discover climbing events and connect with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/events')} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm sm:text-base"
              >
                Browse All Events
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Package className="h-5 w-5 sm:h-6 sm:w-6" />
                Manage Gear
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Track your equipment and share with other climbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/gear')} 
                variant="outline" 
                className="w-full text-sm sm:text-base"
              >
                View My Gear
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
