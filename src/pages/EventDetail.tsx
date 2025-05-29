import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { EventHeader } from "@/components/event-detail/EventHeader";
import { EventDetailsCard } from "@/components/event-detail/EventDetailsCard";
import { CarpoolCard } from "@/components/event-detail/CarpoolCard";
import { ParticipantsTable } from "@/components/event-detail/ParticipantsTable";
import { EquipmentCard } from "@/components/event-detail/EquipmentCard";
import { EventCommentsSection } from "@/components/event-detail/EventCommentsSection";
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
    const result = await updateCarpoolStatus(currentUserParticipation.id, isDriver, seats, notes);
    if (result.success) {
      refreshData();
    }
  };

  const handleAssignToDriver = async (driverId: string) => {
    if (!currentUserParticipation) return;
    try {
      const { error } = await supabase.from('event_participants').update({
        assigned_driver_id: driverId || null
      }).eq('id', currentUserParticipation.id);
      if (error) throw error;
      refreshData();
    } catch (error) {
      console.error('Error updating carpool assignment:', error);
    }
  };

  const handleUpdateCarpoolPreference = async (needsCarpool: boolean) => {
    if (!currentUserParticipation) return;
    try {
      const { error } = await supabase.from('event_participants').update({
        needs_carpool: needsCarpool
      }).eq('id', currentUserParticipation.id);
      if (error) throw error;
      refreshData();
    } catch (error) {
      console.error('Error updating carpool preference:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading event details...</div>
      </div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Event not found</p>
          <button onClick={() => navigate('/events')}>Back to Events</button>
        </div>
      </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="w-full max-w-4xl mx-auto p-4">
        <EventHeader 
          event={event} 
          userJoined={userJoined} 
          user={user} 
          onBack={() => navigate('/events')} 
          onJoinEvent={handleJoinEvent} 
          onLeaveEvent={handleLeaveEvent} 
          onEventUpdated={refreshData} 
        />

        {/* Event Details - Full width */}
        <div className="mb-6">
          <EventDetailsCard event={event} participantsCount={participants.length} />
        </div>

        {/* Event Details Section */}
        {(event as any).details && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-stone-800 text-xl font-semibold leading-relaxed whitespace-pre-wrap">
                {(event as any).details}
              </div>
            </div>
          </div>
        )}

        {/* Carpool Section */}
        <div className="mb-6">
          <CarpoolCard 
            participants={participants} 
            currentUserId={user?.id} 
            currentUserParticipation={currentUserParticipation} 
            onUpdateCarpoolStatus={handleUpdateCarpoolStatus} 
            onAssignToDriver={handleAssignToDriver} 
            onUpdateCarpoolPreference={handleUpdateCarpoolPreference} 
          />
        </div>

        {/* Comments Section */}
        {eventId && (
          <div className="mb-6">
            <EventCommentsSection eventId={eventId} />
          </div>
        )}

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
