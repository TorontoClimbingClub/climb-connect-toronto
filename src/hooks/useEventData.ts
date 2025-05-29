import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  participants_count?: number;
  carpool_seats?: number;
  equipment_count?: number;
}

interface Participant {
  id: string;
  user_id: string;
  is_carpool_driver: boolean | null;
  available_seats: number | null;
  joined_at: string;
  full_name: string;
  phone: string | null;
  carpool_driver_notes?: string | null;
  assigned_driver_id?: string | null;
  needs_carpool?: boolean | null;
}

interface Equipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  user_id: string;
  owner_name: string;
  category_name: string;
}

interface UserEquipment {
  id: string;
  item_name: string;
  quantity: number;
  notes: string | null;
  category_name: string;
  is_assigned?: boolean;
  assigned_event?: string;
}

export function useEventData(eventId: string | undefined) {
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [userEquipment, setUserEquipment] = useState<UserEquipment[]>([]);
  const [userJoined, setUserJoined] = useState(false);
  const [currentUserParticipation, setCurrentUserParticipation] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEventDetails = async () => {
    try {
      // Fetch basic event details
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;

      // Get additional stats
      const [participantsResult, carpoolResult, equipmentResult] = await Promise.all([
        supabase.from('event_participants').select('*', { count: 'exact' }).eq('event_id', eventId),
        supabase.from('event_participants').select('available_seats').eq('event_id', eventId).not('available_seats', 'is', null),
        supabase.from('event_equipment').select('*', { count: 'exact' }).eq('event_id', eventId)
      ]);

      const totalCarpoolSeats = carpoolResult.data?.reduce((sum, p) => sum + (p.available_seats || 0), 0) || 0;

      setEvent({
        ...data,
        participants_count: participantsResult.count || 0,
        carpool_seats: totalCarpoolSeats,
        equipment_count: equipmentResult.count || 0
      });

    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    }
  };

  const checkUserParticipation = async () => {
    if (!user || !eventId) return;

    try {
      console.log('Checking participation for user:', user.id, 'in event:', eventId);
      
      const { data: participation, error } = await supabase
        .from('event_participants')
        .select('*, carpool_driver_notes, assigned_driver_id, needs_carpool')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking participation:', error);
        return;
      }

      console.log('Participation result:', participation);

      if (participation) {
        setUserJoined(true);
        
        // Get user profile data for the participation
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();

        if (profile) {
          const participantData: Participant = {
            id: participation.id,
            user_id: participation.user_id,
            is_carpool_driver: participation.is_carpool_driver,
            available_seats: participation.available_seats,
            joined_at: participation.joined_at,
            full_name: profile.full_name,
            phone: profile.phone,
            carpool_driver_notes: participation.carpool_driver_notes,
            assigned_driver_id: participation.assigned_driver_id,
            needs_carpool: participation.needs_carpool
          };
          setCurrentUserParticipation(participantData);
        }
      } else {
        setUserJoined(false);
        setCurrentUserParticipation(null);
      }
    } catch (error) {
      console.error('Error checking user participation:', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data: participantsData, error: participantsError } = await supabase
        .from('event_participants')
        .select('*, carpool_driver_notes, assigned_driver_id, needs_carpool')
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
            quantity,
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

  const fetchUserEquipment = async () => {
    if (!user) return;

    try {
      const { data: userEquipmentData, error } = await supabase
        .from('user_equipment')
        .select(`
          id,
          item_name,
          quantity,
          notes,
          category_id,
          equipment_categories(name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Check which equipment is already assigned to events
      const equipmentIds = userEquipmentData?.map(e => e.id) || [];
      const { data: assignedEquipment } = await supabase
        .from('event_equipment')
        .select('user_equipment_id, event_id')
        .in('user_equipment_id', equipmentIds);

      const assignedMap = new Map(assignedEquipment?.map(a => [a.user_equipment_id, a.event_id]) || []);

      const equipmentWithAssignments = userEquipmentData?.map(item => ({
        ...item,
        category_name: item.equipment_categories?.name || 'Unknown Category',
        is_assigned: assignedMap.has(item.id),
        assigned_event: assignedMap.get(item.id)
      })) || [];

      setUserEquipment(equipmentWithAssignments);
    } catch (error) {
      console.error('Error fetching user equipment:', error);
    }
  };

  const refreshData = () => {
    fetchEventDetails();
    fetchParticipants();
    fetchEquipment();
    checkUserParticipation();
    if (user) {
      fetchUserEquipment();
    }
  };

  useEffect(() => {
    if (eventId) {
      Promise.all([
        fetchEventDetails(),
        fetchParticipants(),
        fetchEquipment(),
        checkUserParticipation()
      ]).finally(() => {
        setLoading(false);
      });
      
      if (user) {
        fetchUserEquipment();
      }
    }
  }, [eventId, user]);

  return {
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
    fetchUserEquipment,
    refreshData
  };
}
