
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Event } from "@/types";

interface UseEventCardActionsProps {
  event: Event;
  isParticipating: boolean;
  onParticipationChange: (eventId: string, joined: boolean) => void;
}

export const useEventCardActions = ({
  event,
  isParticipating,
  onParticipationChange
}: UseEventCardActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinEvent = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join events",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('event_participants')
        .insert({
          event_id: event.id,
          user_id: user.id,
        });

      if (error) throw error;

      onParticipationChange(event.id, true);
      toast({
        title: "Success",
        description: "You've joined the event!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', event.id)
        .eq('user_id', user.id);

      if (error) throw error;

      onParticipationChange(event.id, false);
      toast({
        title: "Success",
        description: "You've left the event",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return {
    isLoading,
    handleJoinEvent,
    handleLeaveEvent,
    handleViewDetails
  };
};
