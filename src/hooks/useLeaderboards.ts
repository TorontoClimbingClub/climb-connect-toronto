
import { useLeaderboardData } from "./useLeaderboardData";

export function useLeaderboards() {
  const {
    eventLeaderboard: topEventAttendees,
    topGradeLeaderboard: topGradeClimbers,
    tradLeaderboard: topTradClimbers,
    sportLeaderboard: topSportClimbers,
    topRopeLeaderboard: topTopRopeClimbers,
    gearLeaderboard: topGearOwners,
    loading,
    refreshData: refreshLeaderboards
  } = useLeaderboardData();

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topEventAttendees,
    topGearOwners,
    loading,
    refreshLeaderboards
  };
}
