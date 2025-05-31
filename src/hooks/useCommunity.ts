
import { useEffect } from "react";
import { useCommunityData } from "./useCommunityData";

export function useCommunity() {
  const { members, loading, fetchCommunityMembers } = useCommunityData();

  useEffect(() => {
    fetchCommunityMembers();
  }, []);

  return {
    members,
    loading,
    refreshMembers: fetchCommunityMembers
  };
}
