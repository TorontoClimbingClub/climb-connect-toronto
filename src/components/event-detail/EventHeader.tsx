
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserPlus, UserMinus } from "lucide-react";

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

interface EventHeaderProps {
  event: Event;
  userJoined: boolean;
  user: any;
  onBack: () => void;
  onJoinEvent: () => void;
  onLeaveEvent: () => void;
}

export function EventHeader({ 
  event, 
  userJoined, 
  user, 
  onBack, 
  onJoinEvent, 
  onLeaveEvent 
}: EventHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 text-sm sm:text-base"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-800 mb-2 break-words">{event.title}</h1>
          {event.description && (
            <p className="text-stone-600 mb-4 text-sm sm:text-base">{event.description}</p>
          )}
        </div>
        {event.difficulty_level && (
          <Badge variant="outline" className="text-xs sm:text-sm shrink-0">
            {event.difficulty_level}
          </Badge>
        )}
      </div>

      {user && (
        <div className="mt-4">
          {userJoined ? (
            <Button 
              onClick={onLeaveEvent}
              variant="outline" 
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Leave Event
            </Button>
          ) : (
            <Button 
              onClick={onJoinEvent}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-sm sm:text-base"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Join Event
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
