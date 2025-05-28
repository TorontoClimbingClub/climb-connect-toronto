
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Car, Package, Phone, Mountain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEventActions } from "@/hooks/useEventActions";
import { Navigation } from "@/components/Navigation";
import { useEvents } from "@/hooks/useEvents";
import { useCommunity } from "@/hooks/useCommunity";

export default function Events() {
  const { upcomingEvents, userParticipations, loading: eventsLoading, fetchEvents, fetchUserParticipations, updateUserParticipation } = useEvents();
  const { members, loading: communityLoading } = useCommunity();
  const { user } = useAuth();
  const { toast } = useToast();
  const { joinEvent, loading: actionLoading } = useEventActions();

  useEffect(() => {
    if (user) {
      fetchUserParticipations(user.id);
    }
  }, [user, fetchUserParticipations]);

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
      updateUserParticipation(eventId, true);
      fetchEvents(); // Refresh to update participant counts
    }
  };

  if (eventsLoading || communityLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Community & Events</h1>
          <p className="text-stone-600">Join climbing events and connect with fellow climbers</p>
        </div>

        {/* Events Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#E55A2B] mb-4">Upcoming Events</h2>
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

        {/* Community Section */}
        <div>
          <h2 className="text-xl font-semibold text-[#E55A2B] mb-4">Active Members</h2>
          <div className="mb-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-[#E55A2B] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#E55A2B]">{members.length}</p>
                <p className="text-sm text-stone-600">Active Members</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {members.map((member) => (
              <Card key={member.id} className={member.id === user?.id ? "border-orange-200 bg-orange-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-[#E55A2B]">
                        {member.full_name}
                        {member.id === user?.id && (
                          <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                        )}
                      </h3>
                      {member.phone && (
                        <div className="flex items-center text-sm text-stone-600 mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {member.phone}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      {member.is_carpool_driver && (
                        <Badge variant="secondary" className="text-xs">
                          <Car className="h-3 w-3 mr-1" />
                          Driver ({member.passenger_capacity} seats)
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Climbing Level and Experience */}
                  <div className="mb-3 p-3 bg-stone-50 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <Mountain className="h-4 w-4 text-[#E55A2B] mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-stone-700">
                            {member.climbing_level || "No level specified"}
                          </p>
                          {member.climbing_experience && member.climbing_experience.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.climbing_experience.map((exp) => (
                                <Badge key={exp} variant="outline" className="text-xs bg-white">
                                  {exp}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {member.climbing_description && (
                        <p className="text-sm text-stone-700 mt-1">{member.climbing_description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-stone-600">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {member.equipment_count} gear items
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {member.events_count} events joined
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
