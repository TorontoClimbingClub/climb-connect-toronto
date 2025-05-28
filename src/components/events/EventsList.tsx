
import { EventCard } from "./EventCard";
import { Event } from "@/types/events";

interface EventsListProps {
  events: Event[];
  loading: boolean;
  onEventClick: (eventId: string) => void;
}

export function EventsList({ events, loading, onEventClick }: EventsListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-[#E55A2B]">Loading events...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        <p>No events scheduled at the moment.</p>
        <p className="text-sm">Check back later for upcoming climbing events!</p>
      </div>
    );
  }

  const handleEventClick = (eventId: string) => {
    onEventClick(eventId);
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} onClick={() => handleEventClick(event.id)} className="cursor-pointer">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}
