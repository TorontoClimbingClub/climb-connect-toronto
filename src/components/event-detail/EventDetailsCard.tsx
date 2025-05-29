
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

function formatTime12Hour(time24: string) {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function EventDetailsCard({ event, participantsCount }: EventDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Event Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(event.date).toLocaleDateString()} at {formatTime12Hour(event.time)}
        </div>
        
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2" />
          {event.location}
        </div>

        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2" />
          {participantsCount} participants
          {event.max_participants && ` / ${event.max_participants} max`}
        </div>
      </CardContent>
    </Card>
  );
}
