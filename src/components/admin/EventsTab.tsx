
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, MapPin, Users } from "lucide-react";
import { CreateEventDialog } from "./CreateEventDialog";

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
}

interface EventsTabProps {
  events: Event[];
  canCreateEvents: boolean;
  canManageUsers: boolean;
  onDeleteEvent: (eventId: string) => void;
  onRefreshEvents: () => void;
}

export function EventsTab({ 
  events, 
  canCreateEvents, 
  canManageUsers, 
  onDeleteEvent, 
  onRefreshEvents 
}: EventsTabProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-emerald-800">Event Management</h2>
        {canCreateEvents && (
          <CreateEventDialog
            showForm={showCreateForm}
            onToggleForm={setShowCreateForm}
            onEventCreated={() => {
              setShowCreateForm(false);
              onRefreshEvents();
            }}
          />
        )}
      </div>

      {/* Mobile-friendly card layout */}
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="w-full">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Event Title and Actions */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#E55A2B] truncate">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                  {canManageUsers && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Event Details - Stacked vertically */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-stone-600">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-stone-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-stone-600">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{event.participants_count || 0} joined</span>
                    </div>
                    
                    {event.difficulty_level && (
                      <Badge variant="outline" className="text-xs">
                        {event.difficulty_level}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {events.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-stone-600">No events found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
