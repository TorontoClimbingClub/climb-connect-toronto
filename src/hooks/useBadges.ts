
import { useEffect } from "react";
import { useBadgeData } from "./useBadgeData";
import { useBadgeCalculation } from "./useBadgeCalculation";
import { useBadgeRealtime } from "./useBadgeRealtime";

export function useBadges() {
  const {
    badges,
    userBadges,
    loading,
    fetchBadges,
    fetchUserBadges,
    getUserBadges,
    refreshBadges
  } = useBadgeData();

  const {
    recalculateUserBadges,
    syncAllUserBadges
  } = useBadgeCalculation();

  // Wrapper functions that include refresh callback
  const updateUserBadges = async (userId: string) => {
    await recalculateUserBadges(userId, fetchUserBadges);
  };

  const syncAllUserBadgesWithRefresh = async () => {
    await syncAllUserBadges(fetchUserBadges);
  };

  // Set up real-time subscription
  useBadgeRealtime({
    onAttendanceChange: updateUserBadges
  });

  // Initial data fetch
  useEffect(() => {
    Promise.all([fetchBadges(), fetchUserBadges()]);
  }, []);

  return {
    badges,
    userBadges,
    loading,
    getUserBadges,
    updateUserBadges,
    syncAllUserBadges: syncAllUserBadgesWithRefresh,
    refreshBadges
  };
}
