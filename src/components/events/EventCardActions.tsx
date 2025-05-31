
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Car, Package } from "lucide-react";
import { Event } from "@/types";

interface EventCardActionsProps {
  event: Event;
  isParticipating: boolean;
  isLoading: boolean;
  onJoinEvent: () => void;
  onLeaveEvent: () => void;
  onViewDetails: () => void;
}

export const EventCardActions = ({
  event,
  isParticipating,
  isLoading,
  onJoinEvent,
  onLeaveEvent,
  onViewDetails
}: EventCardActionsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {event.participants_count || 0}
        </Badge>
        
        {event.carpool_seats && event.carpool_seats > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Car className="h-3 w-3" />
            {event.available_carpool_seats || 0}/{event.carpool_seats}
          </Badge>
        )}
        
        {event.equipment_count && event.equipment_count > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            {event.equipment_count}
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onViewDetails}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          View Details
        </Button>
        
        {isParticipating ? (
          <Button
            onClick={onLeaveEvent}
            variant="destructive"
            size="sm"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Leaving..." : "Leave"}
          </Button>
        ) : (
          <Button
            onClick={onJoinEvent}
            size="sm"
            disabled={isLoading}
            className="flex-1 bg-[#E55A2B] hover:bg-orange-700"
          >
            {isLoading ? "Joining..." : "Join Event"}
          </Button>
        )}
      </div>
    </div>
  );
};
