import { useNavigate } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/cards/EventCard';
import { useAuth } from '@/hooks/useAuth';

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    myEvents,
    availableEvents,
    isLoading,
    joinEvent,
    leaveEvent,
    deleteEvent,
    isJoining,
    isLeaving,
    isDeleting
  } = useEvents();

  const navigateToEventChat = (eventId: string) => {
    navigate(`/events/${eventId}/chat`);
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center md:text-left py-8 md:py-0">
          <h1 className="text-3xl font-bold text-gray-900">Climbing Events</h1>
        </div>
        <Card className="text-center p-8">
          <CardContent>
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-500">Please sign in to view and join climbing events.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center md:text-left py-8 md:py-0">
          <h1 className="text-3xl font-bold text-gray-900">Climbing Events</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="text-center md:text-left py-8 md:py-0">
        <h1 className="text-3xl font-bold text-gray-900">Climbing Events</h1>
        <p className="text-gray-600 mt-1">Discover and join climbing events in Toronto</p>
      </div>

      {/* My Events Section */}
      {myEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">You're Attending</h2>
          
          {/* Desktop Layout: Each event as a row */}
          <div className="hidden md:block space-y-4">
            {myEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigateToEventChat(event.id)}
              >
                <EventCard
                  event={event}
                  showChatButton={true}
                  onLeave={leaveEvent}
                  onDelete={deleteEvent}
                  isLeaving={isLeaving}
                  isDeleting={isDeleting}
                  compact={true}
                />
              </div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden desktop-grid-3">
            {myEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => navigateToEventChat(event.id)}
              >
                <EventCard
                  event={event}
                  showChatButton={true}
                  onLeave={leaveEvent}
                  onDelete={deleteEvent}
                  isLeaving={isLeaving}
                  isDeleting={isDeleting}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Events you might be interested in</h1>
      </div>

      {availableEvents.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500">Create the first climbing event for the community!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Layout: Each event as a row */}
          <div className="hidden md:block space-y-4">
            {availableEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  if (event.is_participant) {
                    navigateToEventChat(event.id);
                  } else {
                    joinEvent(event.id);
                  }
                }}
              >
                <EventCard
                  event={event}
                  onJoin={joinEvent}
                  onDelete={deleteEvent}
                  isJoining={isJoining}
                  isDeleting={isDeleting}
                  compact={true}
                />
              </div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden desktop-grid-3">
            {availableEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  if (event.is_participant) {
                    navigateToEventChat(event.id);
                  } else {
                    joinEvent(event.id);
                  }
                }}
              >
                <EventCard
                  event={event}
                  onJoin={joinEvent}
                  onDelete={deleteEvent}
                  isJoining={isJoining}
                  isDeleting={isDeleting}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}