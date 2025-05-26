
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEventActions } from "@/hooks/useEventActions";
import { Navigation } from "@/components/Navigation";
import { useEvents } from "@/hooks/useEvents";

export default function Events() {
  const { upcomingEvents, userParticipations, loading, fetchEvents, fetchUserParticipations, updateUserParticipation } = useEvents();
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
