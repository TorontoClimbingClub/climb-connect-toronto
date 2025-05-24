
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  difficulty_level: string | null;
  participants_count?: number;
}

interface JoinedEventsSectionProps {
  events: Event[];
}

export function JoinedEventsSection({ events }: JoinedEventsSectionProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-stone-400 mx-auto mb-4" />
          <p className="text-stone-600 mb-4">No upcoming events joined</p>
          <p className="text-sm text-stone-500">Join events to see them here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card 
          key={event.id} 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => window.location.href = `/events/${event.id}`}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-emerald-800 line-clamp-1">{event.title}</h3>
              <div className="flex gap-2 ml-2 flex-shrink-0">
                <Badge variant="default" className="text-xs">
                  Joined
                </Badge>
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
                <span>{event.participants_count || 0} participants</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
