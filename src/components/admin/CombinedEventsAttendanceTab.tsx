
import React, { useState, useEffect } from "react";
import type { Event } from "@/types/events";
import { useEventStatus } from "@/hooks/useEventStatus";
import { useEventParticipants } from "@/hooks/useEventParticipants";
import { EventsAttendanceHeader } from "./events-attendance/EventsAttendanceHeader";
import { CreateEventForm } from "./events-attendance/CreateEventForm";
import { EventCard } from "./events-attendance/EventCard";
import { EmptyEventsState } from "./events-attendance/EmptyEventsState";

interface CombinedEventsAttendanceTabProps {
  events: Event[];
  canCreateEvents: boolean;
  canManageUsers: boolean;
  onDeleteEvent: (eventId: string) => void;
  onRefreshEvents: () => void;
}

export function CombinedEventsAttendanceTab({ 
  events, 
  canCreateEvents, 
  canManageUsers, 
  onDeleteEvent, 
  onRefreshEvents 
}: CombinedEventsAttendanceTabProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { getEventStatus } = useEventStatus();
  const { 
    eventsWithParticipants, 
    loading, 
    fetchEventsWithParticipants, 
    handleConfirmAttendance, 
    handleRejectAttendance 
  } = useEventParticipants();

  // Load events with participants when component mounts or events change
  useEffect(() => {
    if (events.length > 0) {
      const eventsWithStatus = events.map(event => ({
        ...event,
        event_status: getEventStatus(event)
      }));
      fetchEventsWithParticipants(eventsWithStatus);
    }
  }, [events]);

  return (
    <div className="space-y-6">
      <EventsAttendanceHeader
        canCreateEvents={canCreateEvents}
        showCreateForm={showCreateForm}
        onToggleCreateForm={setShowCreateForm}
      />

      <CreateEventForm
        showForm={showCreateForm}
        onToggleForm={setShowCreateForm}
        onEventCreated={onRefreshEvents}
      />

      {!showCreateForm && (
        <div className="space-y-4">
          {eventsWithParticipants.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              canManageUsers={canManageUsers}
              onDeleteEvent={onDeleteEvent}
              onRefreshEvents={onRefreshEvents}
              onConfirmAttendance={handleConfirmAttendance}
              onRejectAttendance={handleRejectAttendance}
            />
          ))}
          
          {events.length === 0 && <EmptyEventsState />}
        </div>
      )}
    </div>
  );
}
