
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EventCardHeader } from "./EventCardHeader";
import { EventCardActions } from "./EventCardActions";
import { useEventCardActions } from "@/hooks/useEventCardActions";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
  isParticipating: boolean;
  onParticipationChange: (eventId: string, joined: boolean) => void;
}

export const EventCard = ({
  event,
  isParticipating,
  onParticipationChange
}: EventCardProps) => {
  const {
    isLoading,
    handleJoinEvent,
    handleLeaveEvent,
    handleViewDetails
  } = useEventCardActions({
    event,
    isParticipating,
    onParticipationChange
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <EventCardHeader event={event} />
      </CardHeader>
      
      <CardContent>
        <EventCardActions
          event={event}
          isParticipating={isParticipating}
          isLoading={isLoading}
          onJoinEvent={handleJoinEvent}
          onLeaveEvent={handleLeaveEvent}
          onViewDetails={handleViewDetails}
        />
      </CardContent>
    </Card>
  );
};
