
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { EventHeader } from "@/components/event-detail/EventHeader";
import { EventDetailsCard } from "@/components/event-detail/EventDetailsCard";
import { CarpoolCard } from "@/components/event-detail/CarpoolCard";
import { ParticipantsTable } from "@/components/event-detail/ParticipantsTable";
import { EquipmentTable } from "@/components/event-detail/EquipmentTable";

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
}

interface Participant {
  id: string;
  user_id: string;
  is_carpool_driver: boolean | null;
  available_seats: number | null;
  joined_at: string;
  full_name: string;
  phone: string | null;
}

interface Equipment {
  id: string;
  item_name: string;
  brand: string | null;
  notes: string | null;
  user_id: string;
  owner_name: string;
  category_name: string;
}

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [userJoined, setUserJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchParticipants();
      fetchEquipment();
    }
  }, [eventId, user]);

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      setEvent(data);

      if (user) {
        const { data: participation } = await supabase
          .from('event_participants')
          .select('id')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        setUserJoined(!!participation);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data: participantsData, error: participantsError } = await supabase
        .from('event_participants')
        .select('*')
        .eq('event_id', eventId);

      if (participantsError) throw participantsError;

      if (participantsData && participantsData.length > 0) {
        const userIds = participantsData.map(p => p.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const participantsWithProfiles = participantsData.map(participant => {
          const profile = profilesData?.find(p => p.id === participant.user_id);
          return {
            ...participant,
            full_name: profile?.full_name || 'Unknown User',
            phone: profile?.phone || null,
          };
        });

        setParticipants(participantsWithProfiles);
      } else {
        setParticipants([]);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const { data: eventEquipmentData, error: eventEquipmentError } = await supabase
        .from('event_equipment')
        .select('user_equipment_id, user_id')
        .eq('event_id', eventId);

      if (eventEquipmentError) throw eventEquipmentError;

      if (eventEquipmentData && eventEquipmentData.length > 0) {
        const equipmentIds = eventEquipmentData.map(e => e.user_equipment_id);
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('user_equipment')
          .select(`
            id,
            item_name,
            brand,
            notes,
            user_id,
            category_id
          `)
          .in('id', equipmentIds);

        if (equipmentError) throw equipmentError;

        const userIds = [...new Set(equipmentData?.map(e => e.user_id) || [])];
        const categoryIds = [...new Set(equipmentData?.map(e => e.category_id) || [])];

        const [profilesResult, categoriesResult] = await Promise.all([
          supabase.from('profiles').select('id, full_name').in('id', userIds),
          supabase.from('equipment_categories').select('id, name').in('id', categoryIds)
        ]);

        if (profilesResult.error || categoriesResult.error) {
          throw profilesResult.error || categoriesResult.error;
        }

        const equipmentWithDetails = equipmentData?.map(item => {
          const profile = profilesResult.data?.find(p => p.id === item.user_id);
          const category = categoriesResult.data?.find(c => c.id === item.category_id);
          return {
            ...item,
            owner_name: profile?.full_name || 'Unknown User',
            category_name: category?.name || 'Unknown Category',
          };
        }) || [];

        setEquipment(equipmentWithDetails);
      } else {
        setEquipment([]);
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async () => {
    if (!user || !eventId) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've joined the event",
      });

      setUserJoined(true);
      fetchParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive",
      });
    }
  };

  const leaveEvent = async () => {
    if (!user || !eventId) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've left the event",
      });

      setUserJoined(false);
      fetchParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave event",
        variant: "destructive",
      });
    }
  };

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
          <CarpoolCard participants={participants} />
        </div>

        <div className="space-y-6">
          <ParticipantsTable participants={participants} />
          <EquipmentTable equipment={equipment} />
        </div>
      </div>
      <Navigation />
    </div>
  );
}
