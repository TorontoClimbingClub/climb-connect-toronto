
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEquipmentManagement } from "./useEquipmentManagement";

export function useEventActions() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { removeUserEquipmentFromEvent, addEquipmentToEvent } = useEquipmentManagement();

  const joinEvent = async (eventId: string, userId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('event_participants')
        .insert({ event_id: eventId, user_id: userId });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've joined the event",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const leaveEvent = async (eventId: string, userId: string) => {
    try {
      setLoading(true);

      // First remove user's equipment from the event
      await removeUserEquipmentFromEvent(userId, eventId);

      // Then remove user from participants
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You've left the event and your equipment has been removed",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave event",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateCarpoolStatus = async (participationId: string, isDriver: boolean, seats: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('event_participants')
        .update({
          is_carpool_driver: isDriver,
          available_seats: isDriver ? seats : null
        })
        .eq('id', participationId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Carpool status updated",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update carpool status",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const addEquipment = async (equipmentIds: string[], eventId: string, userId: string) => {
    return await addEquipmentToEvent(equipmentIds, eventId, userId);
  };

  return {
    joinEvent,
    leaveEvent,
    updateCarpoolStatus,
    addEquipment,
    loading
  };
}
