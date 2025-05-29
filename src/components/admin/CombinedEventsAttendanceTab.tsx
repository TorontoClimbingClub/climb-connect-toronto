
import React, { useState, useEffect, useMemo } from "react";
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
    loading: participantsLoading, 
    fetchEventsWithParticipants, 
    handleConfirmAttendance, 
    handleRejectAttendance,
    handleResetAttendance
  } = useEventParticipants();

  // Memoize events with status to prevent unnecessary recalculations
  const eventsWithStatus = useMemo(() => {
    return events.map(event => ({
      ...event,
      event_status: getEventStatus(event)
    }));
  }, [events, getEventStatus]);

  // Load events with participants when events change
  useEffect(() => {
    console.log('Events changed, total:', events.length);
    if (events.length > 0) {
      console.log('Calling fetchEventsWithParticipants with events:', eventsWithStatus.length);
      fetchEventsWithParticipants(eventsWithStatus);
    }
  }, [events.length, fetchEventsWithParticipants]); // Only depend on length to prevent loops

  const handleRefreshAfterUpdate = async () => {
    console.log('Refreshing after update...');
    await onRefreshEvents();
  };

  // Use eventsWithParticipants if available and has data, otherwise fall back to events with basic structure
  const displayEvents = eventsWithParticipants.length > 0 
    ? eventsWithParticipants 
    : eventsWithStatus.map(event => ({
        ...event,
        participants: [],
        participants_count: 0,
        event_date_time: new Date(`${event.date}T${event.time}`)
      }));

  console.log('Rendering CombinedEventsAttendanceTab:', {
    eventsCount: events.length,
    eventsWithParticipantsCount: eventsWithParticipants.length,
    displayEventsCount: displayEvents.length,
    participantsLoading,
    showCreateForm
  });

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
        onEventCreated={handleRefreshAfterUpdate}
      />

      {!showCreateForm && (
        <div className="space-y-4">
          {participantsLoading && events.length > 0 && (
            <div className="text-center text-stone-600 py-4">
              Loading participant data for {events.length} events...
            </div>
          )}
          
          {displayEvents.length > 0 ? (
            displayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                canManageUsers={canManageUsers}
                onDeleteEvent={onDeleteEvent}
                onRefreshEvents={handleRefreshAfterUpdate}
                onConfirmAttendance={handleConfirmAttendance}
                onRejectAttendance={handleRejectAttendance}
                onResetAttendance={handleResetAttendance}
              />
            ))
          ) : (
            !participantsLoading && <EmptyEventsState />
          )}
        </div>
      )}
    </div>
  );
}
