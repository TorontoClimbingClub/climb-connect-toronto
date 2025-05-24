
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Mountain, ArrowRight, Package, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  difficulty_level: string | null;
  participants_count?: number;
  user_joined?: boolean;
}

export default function Index() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userStats, setUserStats] = useState({
    joinedEvents: 0,
    equipmentCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUpcomingEvents();
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUpcomingEvents = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events_with_participants')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(6);

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

        setUpcomingEvents(eventsWithJoinStatus);
      } else {
        setUpcomingEvents(eventsData || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Get joined events count
      const { count: eventsCount } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Get equipment count
      const { count: gearCount } = await supabase
        .from('user_equipment')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      setUserStats({
        joinedEvents: eventsCount || 0,
        equipmentCount: gearCount || 0,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      window.location.href = '/events';
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    toast({
      title: "Welcome to TCC!",
      description: "You're now part of Toronto's climbing community",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Hero Section */}
        <div className="text-center py-8 px-4">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 rounded-2xl w-20 h-20 mx-auto mb-6">
            <Mountain className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">
            Toronto Climbing Club
          </h1>
          <p className="text-stone-600 mb-6">
            Connect with fellow climbers, join events, and share your gear with the community
          </p>
          
          {!user && (
            <Button 
              onClick={handleGetStarted}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="px-4 space-y-6">
          {/* User Stats (if logged in) */}
          {user && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-800">{userStats.joinedEvents}</p>
                  <p className="text-sm text-stone-600">Events Joined</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-800">{userStats.equipmentCount}</p>
                  <p className="text-sm text-stone-600">Gear Items</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upcoming Events - Dynamic */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-emerald-800">Upcoming Events</h2>
              <Button variant="ghost" onClick={() => window.location.href = '/events'}>
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-stone-500">Loading events...</div>
                  </CardContent>
                </Card>
              ) : upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                    <p className="text-stone-600 mb-4">No upcoming events scheduled</p>
                    {user && (
                      <Button 
                        onClick={() => window.location.href = '/admin'}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Create Event
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => window.location.href = `/events/${event.id}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-emerald-800 line-clamp-1">{event.title}</h3>
                        <div className="flex gap-2 ml-2 flex-shrink-0">
                          {event.user_joined && (
                            <Badge variant="default" className="text-xs">
                              Joined
                            </Badge>
                          )}
                          {event.difficulty_level && (
                            <Badge variant="outline" className="text-xs">
                              {event.difficulty_level}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-sm text-stone-600 mb-3 line-clamp-2">{event.description}</p>
                      )}
                      
                      <div className="space-y-2 text-sm text-stone-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{event.participants_count || 0} joined</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-emerald-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => window.location.href = '/events'}>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Browse Events</h3>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => window.location.href = '/gear'}>
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Manage Gear</h3>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => window.location.href = '/community'}>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Community</h3>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => window.location.href = '/profile'}>
                <CardContent className="p-4 text-center">
                  <Car className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Profile</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Navigation />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleAuthSuccess}
      />
    </div>
  );
}
