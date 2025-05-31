
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Car, Package, Plus, Clock, RefreshCw } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useEventManager } from "@/hooks/useEventManager";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { useAuth } from "@/contexts/AuthContext";
import { format, isToday, isTomorrow } from "date-fns";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";

export default function Events() {
  const { containerClass, paddingClass } = useResponsiveContainer('wide');
  const { user } = useAuth();
  const { 
    upcomingEvents, 
    userParticipations, 
    loading, 
    fetchEvents,
    fetchUserParticipations,
    updateUserParticipation
  } = useEventManager();

  // Set up real-time subscriptions
  useRealtimeEvents(
    () => {
      console.log('🔄 Real-time event change detected, refreshing data...');
      fetchEvents();
      if (user?.id) {
        fetchUserParticipations(user.id);
      }
    },
    (eventId: string, joined: boolean) => {
      updateUserParticipation(eventId, joined);
    }
  );

  const formatEventDate = (date: string) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) return "Today";
    if (isTomorrow(eventDate)) return "Tomorrow";
    return format(eventDate, "MMM d, yyyy");
  };

  const formatEventTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, "h:mm a");
    } catch {
      return time;
    }
  };

  const isUserParticipating = (eventId: string) => {
    return userParticipations.has(eventId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
        <div className={`${containerClass} ${paddingClass}`}>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Community Events</h1>
            <p className="text-stone-600">Loading events...</p>
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className={`${containerClass} ${paddingClass}`}>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Community Events</h1>
            <p className="text-stone-600">Join climbing events and connect with fellow climbers</p>
          </div>
          <Button onClick={fetchEvents} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-600 mb-2">No Upcoming Events</h3>
            <p className="text-stone-500 mb-6">Check back soon for new climbing events!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg font-bold text-[#E55A2B]">
                          {event.title}
                        </CardTitle>
                        {isUserParticipating(event.id) && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Joined
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-stone-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatEventTime(event.time)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-stone-700 line-clamp-2">{event.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{event.participants_count || 0} joined</span>
                        {event.max_participants && (
                          <span>/ {event.max_participants} max</span>
                        )}
                      </div>
                      
                      {event.carpool_seats && event.carpool_seats > 0 && (
                        <div className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          <span>{event.available_carpool_seats || 0} seats available</span>
                        </div>
                      )}
                      
                      {event.equipment_count && event.equipment_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>{event.equipment_count} items shared</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Link to={`/events/${event.id}`} className="flex-1">
                        <Button className="w-full bg-[#E55A2B] hover:bg-[#d14d20] text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
