
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useEquipmentManagement() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const removeUserEquipmentFromEvent = async (userId: string, eventId: string) => {
    try {
      setLoading(true);
      
      // Remove all equipment assigned by this user to this event
      const { error } = await supabase
        .from('event_equipment')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error removing user equipment from event:', error);
      toast({
        title: "Error",
        description: "Failed to remove equipment from event",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const addEquipmentToEvent = async (equipmentIds: string[], eventId: string, userId: string) => {
    try {
      setLoading(true);

      // Check if user is participating in the event
      const { data: participation, error: participationError } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (participationError || !participation) {
        toast({
          title: "Error", 
          description: "You must be attending the event to share equipment",
          variant: "destructive",
        });
        return { success: false };
      }

      // Add equipment to event
      const equipmentData = equipmentIds.map(equipmentId => ({
        event_id: eventId,
        user_equipment_id: equipmentId,
        user_id: userId
      }));

      const { error } = await supabase
        .from('event_equipment')
        .insert(equipmentData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Equipment added to event successfully",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error adding equipment to event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment to event",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    removeUserEquipmentFromEvent,
    addEquipmentToEvent,
    loading
  };
}
