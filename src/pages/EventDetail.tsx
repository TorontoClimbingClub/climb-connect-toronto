
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
    refreshData
  } = useEventData(eventId);

  const {
    updateCarpoolStatus,
    addEquipment,
    joinEvent,
    leaveEvent
  } = useEventActions();

  const handleJoinEvent = async () => {
    if (!eventId || !user?.id) return;
    const result = await joinEvent(eventId, user.id);
    if (result.success) {
      refreshData();
    }
  };

  const handleLeaveEvent = async () => {
    if (!eventId || !user?.id) return;
    const result = await leaveEvent(eventId, user.id);
    if (result.success) {
      refreshData();
    }
  };

  const handleUpdateCarpoolStatus = async (isDriver: boolean, seats: number, notes?: string) => {
    if (!currentUserParticipation) return;
    const result = await updateCarpoolStatus(currentUserParticipation.id, isDriver, seats);
    if (result.success) {
      refreshData();
    }
  };

  const handleAssignToDriver = async (driverId: string) => {
    // This would need to be implemented in useEventActions
    console.log('Assign to driver:', driverId);
    // For now, just log - you'd need to add this functionality to the backend
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Event not found</p>
          <button onClick={() => navigate('/events')}>Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="w-full max-w-6xl mx-auto p-4">
        <EventHeader
          event={event}
          userJoined={userJoined}
          user={user}
          onBack={() => navigate('/events')}
          onJoinEvent={handleJoinEvent}
          onLeaveEvent={handleLeaveEvent}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <EventDetailsCard event={event} participantsCount={participants.length} />
          <CarpoolCard 
            participants={participants}
            currentUserId={user?.id}
            currentUserParticipation={currentUserParticipation}
            onUpdateCarpoolStatus={handleUpdateCarpoolStatus}
            onAssignToDriver={handleAssignToDriver}
          />
        </div>

        <div className="space-y-6">
          <ParticipantsTable participants={participants} />
          <EquipmentCard 
            equipment={equipment}
            userEquipment={userEquipment}
            currentUserId={user?.id}
            eventId={eventId!}
            onRefresh={refreshData}
          />
        </div>
      </div>
      <Navigation />
    </div>
  );
}
