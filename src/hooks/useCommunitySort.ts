
import { useState, useMemo } from "react";
import { CommunityMember } from "@/types/community";
import { ClimbCompletion } from "@/hooks/useClimbCompletions";

type SortOption = 'name' | 'climbing-progress' | 'gear-count';

export function useCommunitySort(
  members: CommunityMember[], 
  getUserCompletionStats: (userId: string) => { completions: ClimbCompletion[] }
) {
  const [sortBy, setSortBy] = useState<SortOption>('climbing-progress');

  const sortedMembers = useMemo(() => {
    if (!members?.length) return [];

    const membersWithStats = members.map(member => {
      const stats = getUserCompletionStats(member.id);
      return {
        ...member,
        completionCount: stats.completions.length,
        equipmentCount: member.equipment_count || 0
      };
    });

    return [...membersWithStats].sort((a, b) => {
      switch (sortBy) {
        case 'climbing-progress':
          // Sort by completion count (highest to lowest)
          if (b.completionCount !== a.completionCount) {
            return b.completionCount - a.completionCount;
          }
          // If same completion count, sort by name
          return a.full_name.localeCompare(b.full_name);
        
        case 'gear-count':
          // Sort by equipment count (highest to lowest)
          if (b.equipmentCount !== a.equipmentCount) {
            return b.equipmentCount - a.equipmentCount;
          }
          // If same equipment count, sort by name
          return a.full_name.localeCompare(b.full_name);
        
        case 'name':
        default:
          return a.full_name.localeCompare(b.full_name);
      }
    });
  }, [members, sortBy, getUserCompletionStats]);

  return {
    sortedMembers,
    sortBy,
    setSortBy
  };
}
