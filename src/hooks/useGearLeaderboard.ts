
import type { LeaderboardUser } from "./useLeaderboardData";

export const processGearData = (
  profilesData: any[],
  gearData: any[]
): LeaderboardUser[] => {
  // Count total equipment items for each user
  const gearStats = gearData.reduce((acc: any, item) => {
    if (!acc[item.user_id]) {
      acc[item.user_id] = { total_items: 0 };
    }
    acc[item.user_id].total_items += item.quantity || 1;
    return acc;
  }, {});

  // Create leaderboard entries
  const topGearOwners = Object.entries(gearStats)
    .map(([userId, stats]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      return profile ? {
        id: userId,
        full_name: profile.full_name,
        metric_value: stats.total_items
      } : null;
    })
    .filter(Boolean)
    .filter((user: any) => user.metric_value > 0)
    .sort((a: any, b: any) => b.metric_value - a.metric_value)
    .slice(0, 5); // Show top 5 for gear leaderboards

  return topGearOwners;
};
