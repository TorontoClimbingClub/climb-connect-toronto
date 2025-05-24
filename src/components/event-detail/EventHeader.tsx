
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
    <div className="mb-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">{event.title}</h1>
          {event.description && (
            <p className="text-muted-foreground mb-4">{event.description}</p>
          )}
        </div>
        {event.difficulty_level && (
          <Badge variant="outline" className="ml-4">
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
              className="w-full md:w-auto"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              Leave Event
            </Button>
          ) : (
            <Button 
              onClick={onJoinEvent}
              className="w-full md:w-auto"
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
