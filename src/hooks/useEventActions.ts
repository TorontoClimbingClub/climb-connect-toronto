
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useEventActions(eventId: string | undefined, refreshCallbacks: {
  fetchEventDetails: () => void;
  fetchParticipants: () => void;
  fetchEquipment: () => void;
  fetchUserEquipment: () => void;
  setUserJoined: (joined: boolean) => void;
  setCurrentUserParticipation: (participation: any) => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();

  const updateCarpoolStatus = async (isDriver: boolean, seats: number) => {
    if (!user || !eventId) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .update({
          is_carpool_driver: isDriver,
          available_seats: isDriver ? seats : null
        })
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Carpool status updated",
      });

      // Refresh both participants and current user participation
      refreshCallbacks.fetchParticipants();
      refreshCallbacks.fetchEventDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update carpool status",
        variant: "destructive",
      });
    }
  };

  const addEquipment = async (equipmentIds: string[]) => {
    if (!user || !eventId) return;

    try {
      const equipmentRecords = equipmentIds.map(id => ({
        event_id: eventId,
        user_equipment_id: id,
        user_id: user.id
      }));

      const { error } = await supabase
        .from('event_equipment')
        .insert(equipmentRecords);

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Added ${equipmentIds.length} item(s) to event equipment`,
      });

      refreshCallbacks.fetchEquipment();
      refreshCallbacks.fetchUserEquipment();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive",
      });
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

      refreshCallbacks.setUserJoined(true);
      refreshCallbacks.fetchParticipants();
      refreshCallbacks.fetchEventDetails(); // Refresh to get current user participation
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

      refreshCallbacks.setUserJoined(false);
      refreshCallbacks.setCurrentUserParticipation(null);
      refreshCallbacks.fetchParticipants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave event",
        variant: "destructive",
      });
    }
  };

  return {
    updateCarpoolStatus,
    addEquipment,
    joinEvent,
    leaveEvent
  };
}
