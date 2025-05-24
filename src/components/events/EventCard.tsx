
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
    <Card className="overflow-hidden w-full max-w-md h-full flex flex-col hover:shadow-lg transition-shadow duration-200 mx-auto">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle 
              className="text-lg sm:text-xl cursor-pointer hover:text-emerald-700 transition-colors line-clamp-2"
              onClick={() => onEventClick(event.id)}
            >
              {event.title}
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-3 text-sm">
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
      <CardContent className="space-y-4 flex-1 flex flex-col p-6 pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-stone-600">
            <Calendar className="h-4 w-4 mr-3 shrink-0" />
            <span className="break-words">
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-stone-600">
            <MapPin className="h-4 w-4 mr-3 shrink-0" />
            <span className="break-words">{event.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-stone-600">
              <Users className="h-4 w-4 mr-3 shrink-0" />
              <span>
                {event.participants_count || 0} joined
                {event.max_participants && ` / ${event.max_participants} max`}
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEventClick(event.id)}
                className="px-3 text-xs"
              >
                <Car className="h-4 w-4 mr-1" />
                Carpool
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEventClick(event.id)}
                className="px-3 text-xs"
              >
                <Package className="h-4 w-4 mr-1" />
                Gear
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3 mt-auto border-t border-stone-100">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEventClick(event.id)}
            className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-sm"
          >
            View Details
          </Button>
          
          {user && (
            <div>
              {event.user_joined ? (
                <Button 
                  onClick={() => onLeaveEvent(event.id)}
                  variant="outline" 
                  className="w-full text-sm"
                >
                  Leave Event
                </Button>
              ) : (
                <Button 
                  onClick={() => onJoinEvent(event.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-sm"
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
