
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/types";

interface EventCardHeaderProps {
  event: Event;
}

export const EventCardHeader = ({ event }: EventCardHeaderProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#E55A2B] mb-2">{event.title}</h3>
      
      <div className="space-y-1 text-sm text-stone-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
      
      {event.description && (
        <p className="text-stone-700 mt-2 text-sm line-clamp-2">{event.description}</p>
      )}
    </div>
  );
};
