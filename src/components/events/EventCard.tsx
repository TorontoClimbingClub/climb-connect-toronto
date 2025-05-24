
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Car, Package } from "lucide-react";

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
  participants_count?: number;
  user_joined?: boolean;
}

interface EventCardProps {
  event: Event;
  user: any;
  onEventClick: (eventId: string) => void;
  onJoinEvent: (eventId: string) => void;
  onLeaveEvent: (eventId: string) => void;
}

export function EventCard({ event, user, onEventClick, onJoinEvent, onLeaveEvent }: EventCardProps) {
  return (
    <Card className="overflow-hidden w-full h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle 
              className="text-base sm:text-lg cursor-pointer hover:text-emerald-700 transition-colors truncate"
              onClick={() => onEventClick(event.id)}
            >
              {event.title}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2 text-xs sm:text-sm">
              {event.description}
            </CardDescription>
          </div>
          {event.difficulty_level && (
            <Badge variant="outline" className="text-xs shrink-0">
              {event.difficulty_level}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        <div className="flex items-center text-xs sm:text-sm text-stone-600">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
          <span className="truncate">
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </span>
        </div>
        
        <div className="flex items-center text-xs sm:text-sm text-stone-600">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs sm:text-sm text-stone-600">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
            <span>
              {event.participants_count || 0} joined
              {event.max_participants && ` / ${event.max_participants} max`}
            </span>
          </div>
          
          <div className="flex gap-1 sm:gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEventClick(event.id)}
              className="px-1 sm:px-2 text-xs"
            >
              <Car className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Carpool</span>
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEventClick(event.id)}
              className="px-1 sm:px-2 text-xs"
            >
              <Package className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Gear</span>
            </Button>
          </div>
        </div>

        <div className="pt-2 space-y-2 mt-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEventClick(event.id)}
            className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs sm:text-sm"
          >
            View Details
          </Button>
          
          {user && (
            <div>
              {event.user_joined ? (
                <Button 
                  onClick={() => onLeaveEvent(event.id)}
                  variant="outline" 
                  className="w-full text-xs sm:text-sm"
                >
                  Leave Event
                </Button>
              ) : (
                <Button 
                  onClick={() => onJoinEvent(event.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm"
                >
                  Join Event
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
