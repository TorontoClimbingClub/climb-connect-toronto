
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Edit, Trash2, Clock } from "lucide-react";
import { EditEventDialog } from "../EditEventDialog";
import { EventParticipantItem } from "./EventParticipantItem";

interface EventParticipant {
  id: string;
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  attendance_status?: 'pending' | 'approved' | 'rejected';
  approval_id?: string;
}

interface EventCardProps {
  event: any;
  canManageUsers: boolean;
  onDeleteEvent: (eventId: string) => void;
  onRefreshEvents: () => void;
  onConfirmAttendance: (userId: string, eventId: string) => Promise<void>;
  onRejectAttendance: (userId: string, eventId: string) => Promise<void>;
  onResetAttendance?: (userId: string, eventId: string) => Promise<void>;
}

export function EventCard({ 
  event, 
  canManageUsers, 
  onDeleteEvent, 
  onRefreshEvents, 
  onConfirmAttendance, 
  onRejectAttendance,
  onResetAttendance
}: EventCardProps) {
  return (
    <Card className={`w-full border-${event.event_status.color}-200`}>
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Calendar className="h-4 w-4 text-[#E55A2B] flex-shrink-0" />
              <CardTitle className="text-base sm:text-lg truncate">{event.title}</CardTitle>
              <Badge variant="outline" className={`text-xs text-${event.event_status.color}-700 border-${event.event_status.color}-700 flex-shrink-0`}>
                {event.event_status.label}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs sm:text-sm text-stone-600">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {event.event_date_time.toLocaleDateString()} 
                  {' '}
                  {event.event_date_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {event.end_time && ` - ${new Date(`${event.date}T${event.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {canManageUsers && (
            <div className="flex gap-1 flex-shrink-0">
              <EditEventDialog 
                event={event} 
                onEventUpdated={onRefreshEvents}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteEvent(event.id)}
                className="text-red-600 hover:text-red-700 px-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-3 pb-3">
        <div className="space-y-3">
          {event.description && (
            <p className="text-xs sm:text-sm text-stone-600 line-clamp-2">{event.description}</p>
          )}
          
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Participants ({event.participants_count})
            </h4>
            
            {event.participants && event.participants.length > 0 ? (
              <div className="space-y-1.5">
                {event.participants.map((participant: EventParticipant) => (
                  <EventParticipantItem
                    key={participant.id}
                    participant={participant}
                    eventId={event.id}
                    eventStatus={event.event_status.status}
                    onConfirmAttendance={onConfirmAttendance}
                    onRejectAttendance={onRejectAttendance}
                    onResetAttendance={onResetAttendance}
                  />
                ))}
              </div>
            ) : (
              <p className="text-stone-500 text-xs sm:text-sm">No participants registered for this event</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
