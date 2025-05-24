
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { EventHeader } from "@/components/event-detail/EventHeader";
import { EventDetailsCard } from "@/components/event-detail/EventDetailsCard";
import { CarpoolCard } from "@/components/event-detail/CarpoolCard";
import { ParticipantsTable } from "@/components/event-detail/ParticipantsTable";
import { EquipmentCard } from "@/components/event-detail/EquipmentCard";
import { useEventData } from "@/hooks/useEventData";
import { useEventActions } from "@/hooks/useEventActions";

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    event,
    participants,
    equipment,
    userEquipment,
    userJoined,
    currentUserParticipation,
    loading,
    setUserJoined,
    setCurrentUserParticipation,
    fetchEventDetails,
    fetchParticipants,
    fetchEquipment,
    fetchUserEquipment
  } = useEventData(eventId);

  const {
    updateCarpoolStatus,
    addEquipment,
    joinEvent,
    leaveEvent
  } = useEventActions(eventId, {
    fetchEventDetails,
    fetchParticipants,
    fetchEquipment,
    fetchUserEquipment,
    setUserJoined,
    setCurrentUserParticipation
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="text-emerald-600">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Event not found</p>
          <button onClick={() => navigate('/events')}>Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      {/* Centered responsive container */}
      <div className="flex justify-center w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-7xl">
          <EventHeader
            event={event}
            userJoined={userJoined}
            user={user}
            onBack={() => navigate('/events')}
            onJoinEvent={joinEvent}
            onLeaveEvent={leaveEvent}
          />

          {/* Responsive grid that adjusts from 1 column on mobile to 2 columns on large screens */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <EventDetailsCard event={event} participantsCount={participants.length} />
            <CarpoolCard 
              participants={participants}
              currentUserId={user?.id}
              currentUserParticipation={currentUserParticipation}
              onUpdateCarpoolStatus={updateCarpoolStatus}
            />
          </div>

          {/* Full width sections with proper spacing */}
          <div className="space-y-4 sm:space-y-6">
            <ParticipantsTable participants={participants} />
            <EquipmentCard 
              equipment={equipment}
              userEquipment={userEquipment}
              currentUserId={user?.id}
              onAddEquipment={addEquipment}
            />
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
