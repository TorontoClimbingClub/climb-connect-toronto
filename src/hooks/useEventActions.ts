
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEventActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const joinEvent = async (eventId: string, userId: string) => {
    setLoading(true);
    try {
      // Check if user can join based on climbing level and experience
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('required_climbing_level, required_climbing_experience, capacity_limit')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // Check current participant count if there's a capacity limit
      if (event.capacity_limit) {
        const { count, error: countError } = await supabase
          .from('event_participants')
          .select('*', { count: 'exact' })
          .eq('event_id', eventId);

        if (countError) throw countError;

        if (count >= event.capacity_limit) {
          toast({
            title: "Event Full",
            description: "This event has reached its capacity limit",
            variant: "destructive",
          });
          return { success: false };
        }
      }

      // Check climbing level and experience requirements
      if (event.required_climbing_level || (event.required_climbing_experience && event.required_climbing_experience.length > 0)) {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('climbing_level, climbing_experience')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        // Check climbing level requirement
        if (event.required_climbing_level) {
          const levelOrder = ['Never Climbed', 'Beginner', 'Intermediate', 'Advanced'];
          const requiredLevelIndex = levelOrder.indexOf(event.required_climbing_level);
          const userLevelIndex = levelOrder.indexOf(userProfile.climbing_level || 'Never Climbed');

          if (userLevelIndex < requiredLevelIndex) {
            toast({
              title: "Climbing Level Requirement",
              description: `This event requires ${event.required_climbing_level} level or higher. We appreciate your interest and encourage you to join events that match your current experience level!`,
              variant: "destructive",
            });
            return { success: false };
          }
        }
        
        // Check for required climbing experience
        if (event.required_climbing_experience && event.required_climbing_experience.length > 0) {
          // Convert user experience to a Set for faster lookups
          const userExperienceSet = new Set(userProfile.climbing_experience || []);
          
          // Check if the user has at least one of the required experiences
          const hasRequiredExperience = event.required_climbing_experience.some(
            exp => userExperienceSet.has(exp)
          );
          
          if (!hasRequiredExperience) {
            toast({
              title: "Climbing Experience Required",
              description: `This event requires one of the following experiences: ${event.required_climbing_experience.join(', ')}. Please update your profile with relevant climbing experience.`,
              variant: "destructive",
            });
            return { success: false };
          }
        }
      }

      // Check if already joined
      const { data: existingParticipation } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (existingParticipation) {
        toast({
          title: "Already joined",
          description: "You're already participating in this event",
          variant: "destructive",
        });
        return { success: false };
      }

      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: eventId,
          user_id: userId,
        });

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
    setLoading(true);
    try {
      // First, get the user's participation to check if they're a driver
      const { data: participation } = await supabase
        .from('event_participants')
        .select('id, user_id, is_carpool_driver')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (participation?.is_carpool_driver) {
        // If user is a driver, clear all passengers assigned to them
        await supabase
          .from('event_participants')
          .update({ assigned_driver_id: null })
          .eq('assigned_driver_id', userId);
      }

      // Remove the user's participation
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Left event",
        description: "You've left the event",
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

  const updateCarpoolStatus = async (participationId: string, isDriver: boolean, seats: number, notes?: string) => {
    setLoading(true);
    try {
      const updateData: any = {
        is_carpool_driver: isDriver,
        available_seats: isDriver ? seats : null,
        carpool_driver_notes: isDriver ? notes : null,
      };

      // If user is no longer a driver, clear their assignment and reset assigned passengers
      if (!isDriver) {
        updateData.assigned_driver_id = null;
        
        // Get the user_id for this participation to clear passengers
        const { data: participation } = await supabase
          .from('event_participants')
          .select('user_id')
          .eq('id', participationId)
          .single();

        if (participation) {
          // Clear any passengers assigned to this user
          await supabase
            .from('event_participants')
            .update({ assigned_driver_id: null })
            .eq('assigned_driver_id', participation.user_id);
        }
      }

      const { error } = await supabase
        .from('event_participants')
        .update(updateData)
        .eq('id', participationId);

      if (error) throw error;

      toast({
        title: "Carpool updated",
        description: isDriver ? `Offering ${seats} seats` : "No longer offering carpool",
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

  const addEquipment = async (eventId: string, userId: string, userEquipmentId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('event_equipment')
        .insert({
          event_id: eventId,
          user_id: userId,
          user_equipment_id: userEquipmentId,
        });

      if (error) throw error;

      toast({
        title: "Equipment added",
        description: "Equipment added to event",
      });

      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add equipment",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    joinEvent,
    leaveEvent,
    updateCarpoolStatus,
    addEquipment,
    loading,
  };
};
