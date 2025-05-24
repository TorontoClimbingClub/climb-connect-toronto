
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-emerald-600">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Event not found</p>
          <button onClick={() => navigate('/events')}>Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <EventHeader
          event={event}
          userJoined={userJoined}
          user={user}
          onBack={() => navigate('/events')}
          onJoinEvent={joinEvent}
          onLeaveEvent={leaveEvent}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <EventDetailsCard event={event} participantsCount={participants.length} />
          <CarpoolCard 
            participants={participants}
            currentUserId={user?.id}
            currentUserParticipation={currentUserParticipation}
            onUpdateCarpoolStatus={updateCarpoolStatus}
          />
        </div>

        <div className="space-y-6">
          <ParticipantsTable participants={participants} />
          <EquipmentCard 
            equipment={equipment}
            userEquipment={userEquipment}
            currentUserId={user?.id}
            onAddEquipment={addEquipment}
          />
        </div>
      </div>
      <Navigation />
    </div>
  );
}
