
import { useEffect } from "react";
import { useEventManager } from "@/hooks/useEventManager";
import { useAuth } from "@/contexts/AuthContext";

export const useEventsPageData = () => {
  const { user } = useAuth();
  const {
    upcomingEvents,
    userParticipations,
    loading,
    fetchUserParticipations,
    updateUserParticipation
  } = useEventManager();

  useEffect(() => {
    if (user?.id) {
      fetchUserParticipations(user.id);
    }
  }, [user?.id, fetchUserParticipations]);

  return {
    upcomingEvents,
    userParticipations,
    loading,
    updateUserParticipation,
    user
  };
};
