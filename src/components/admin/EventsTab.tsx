
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
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
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-emerald-800">Event Management</h2>
        {canCreateEvents && (
          <CreateEventDialog
            isOpen={isCreateEventOpen}
            onOpenChange={setIsCreateEventOpen}
            onEventCreated={() => {
              setIsCreateEventOpen(false);
              onRefreshEvents();
            }}
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-sm text-stone-600 truncate max-w-xs">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(event.date).toLocaleDateString()}</div>
                      <div className="text-stone-600">{event.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {event.participants_count || 0} joined
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.difficulty_level && (
                      <Badge variant="outline">{event.difficulty_level}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {canManageUsers && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
