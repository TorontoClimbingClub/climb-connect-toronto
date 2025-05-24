
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";

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
}

interface EventDetailsCardProps {
  event: Event;
  participantsCount: number;
}

export function EventDetailsCard({ event, participantsCount }: EventDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Calendar className="h-5 w-5" />
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="flex items-center text-sm sm:text-base break-words">
          <Calendar className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
        </div>
        
        <div className="flex items-center text-sm sm:text-base">
          <MapPin className="h-4 w-4 mr-2 shrink-0" />
          <span className="break-words">{event.location}</span>
        </div>

        <div className="flex items-center text-sm sm:text-base">
          <Users className="h-4 w-4 mr-2 shrink-0" />
          <span>
            {participantsCount} participants
            {event.max_participants && ` / ${event.max_participants} max`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
