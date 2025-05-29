
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
    loading: participantsLoading, 
    fetchEventsWithParticipants, 
    handleConfirmAttendance, 
    handleRejectAttendance 
  } = useEventParticipants();

  // Load events with participants when component mounts or events change
  useEffect(() => {
    console.log('Events changed, total:', events.length);
    if (events.length > 0) {
      const eventsWithStatus = events.map(event => ({
        ...event,
        event_status: getEventStatus(event)
      }));
      console.log('Calling fetchEventsWithParticipants with events:', eventsWithStatus.length);
      fetchEventsWithParticipants(eventsWithStatus);
    } else {
      // Clear events if no events provided
      fetchEventsWithParticipants([]);
    }
  }, [events, getEventStatus, fetchEventsWithParticipants]);

  const handleRefreshAfterUpdate = async () => {
    console.log('Refreshing after update...');
    // First refresh the events from the database
    await onRefreshEvents();
    
    // The useEffect above will automatically trigger fetchEventsWithParticipants
    // when events change, so we don't need to call it manually here
  };

  // Show loading state while fetching participants, but also show events count
  const isLoading = participantsLoading;
  
  // Use eventsWithParticipants if available, otherwise fall back to events with basic structure
  const displayEvents = eventsWithParticipants.length > 0 
    ? eventsWithParticipants 
    : events.map(event => ({
        ...event,
        event_status: getEventStatus(event),
        participants: [],
        participants_count: 0,
        event_date_time: new Date(`${event.date}T${event.time}`)
      }));

  console.log('Rendering CombinedEventsAttendanceTab:', {
    eventsCount: events.length,
    eventsWithParticipantsCount: eventsWithParticipants.length,
    displayEventsCount: displayEvents.length,
    isLoading,
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
          {isLoading && events.length > 0 && (
            <div className="text-center text-stone-600">
              Loading participants for {events.length} events...
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
              />
            ))
          ) : (
            !isLoading && <EmptyEventsState />
          )}
        </div>
      )}
    </div>
  );
}
