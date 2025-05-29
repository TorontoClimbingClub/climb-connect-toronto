
import { useEffect } from "react";
import { useCommunityData } from "./useCommunityData";

export function useCommunity() {
  const { members, loading, fetchCommunityMembers, mountedRef } = useCommunityData();

  useEffect(() => {
    mountedRef.current = true;
    
    const cleanup = fetchCommunityMembers();

    return () => {
      mountedRef.current = false;
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    members,
    loading,
    refreshMembers: fetchCommunityMembers
  };
}
