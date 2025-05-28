
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { CreateEventDialog } from "@/components/admin/CreateEventDialog";
import { EventActions } from "@/components/events/EventActions";
import { EventsList } from "@/components/events/EventsList";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/contexts/AuthContext";

export default function Events() {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { events, loading, refreshEvents } = useEvents();
  const { user } = useAuth();

  // Get user role from localStorage (set during login)
  const userRole = localStorage.getItem('userRole');

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const handleCreateEvent = () => {
    setCreateDialogOpen(true);
  };

  const handleEventCreated = () => {
    refreshEvents();
    setCreateDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Events</h1>
          <p className="text-stone-600">Join upcoming climbing events and meet fellow climbers</p>
        </div>

        <EventActions 
          userRole={userRole}
          onCreateEvent={handleCreateEvent}
        />

        <EventsList 
          events={events}
          loading={loading}
          onEventClick={handleEventClick}
        />

        <CreateEventDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onEventCreated={handleEventCreated}
          organizerId={user?.id || ''}
        />
      </div>
      <Navigation />
    </div>
  );
}
