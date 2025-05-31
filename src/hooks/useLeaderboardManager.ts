
import { useState, useEffect, useCallback } from "react";
import { useLeaderboardDataFetcher } from "@/hooks/leaderboard/useLeaderboardData";
import { useLeaderboardSubscriptions } from "@/hooks/leaderboard/useLeaderboardSubscriptions";
import type { LeaderboardUser, LeaderboardState } from "@/hooks/types/leaderboard";

export { type LeaderboardUser } from "@/hooks/types/leaderboard";

export function useLeaderboardManager() {
  const [state, setState] = useState<LeaderboardState>({
    topGradeClimbers: [],
    topTradClimbers: [],
    topSportClimbers: [],
    topTopRopeClimbers: [],
    topGearOwners: [],
    topEventAttendees: [],
    loading: true,
    lastSync: 0
  });

  const { fetchAllLeaderboardData, handleFetchError } = useLeaderboardDataFetcher();

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      const now = Date.now();
      if (!forceRefresh && now - state.lastSync < 5000) {
        console.log('🔄 [LEADERBOARD] Skipping fetch due to enhanced debounce');
        return;
      }

      setState(prev => ({ ...prev, loading: true }));
      
      const data = await fetchAllLeaderboardData();
      
      setState(prev => ({
        ...prev,
        ...data,
        loading: false,
        lastSync: now
      }));

    } catch (error: any) {
      handleFetchError(error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [fetchAllLeaderboardData, handleFetchError, state.lastSync]);

  // Set up real-time subscriptions
  useLeaderboardSubscriptions({
    onDataChange: () => fetchData(true),
    lastSync: state.lastSync
  });

  useEffect(() => {
    fetchData(true);
  }, []);

  return {
    topGradeClimbers: state.topGradeClimbers,
    topTradClimbers: state.topTradClimbers,
    topSportClimbers: state.topSportClimbers,
    topTopRopeClimbers: state.topTopRopeClimbers,
    topGearOwners: state.topGearOwners,
    topEventAttendees: state.topEventAttendees,
    loading: state.loading
  };
}
