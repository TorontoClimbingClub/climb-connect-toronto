
import type { LeaderboardUser } from "./useLeaderboardData";

export const processGearData = (
  profilesData: any[],
  gearData: any[]
): LeaderboardUser[] => {
  console.log('🔍 [GEAR DEBUG] Processing gear data:', { 
    profilesData: profilesData.length, 
    gearData: gearData.length 
  });

  if (gearData.length > 0) {
    console.log('📊 [GEAR DATA] Sample gear:', gearData[0]);
  }

  // Count total equipment items for each user
  const gearStats = gearData.reduce((acc: any, item) => {
    if (!acc[item.user_id]) {
      acc[item.user_id] = { total_items: 0 };
    }
    const quantity = item.quantity || 1;
    acc[item.user_id].total_items += quantity;
    console.log(`📈 [GEAR STATS] User ${item.user_id} total items: ${acc[item.user_id].total_items} (+${quantity})`);
    return acc;
  }, {});

  console.log('📊 [GEAR STATS] Gear stats calculated:', Object.keys(gearStats).length, 'users with gear');

  // Create leaderboard entries
  const topGearOwners = Object.entries(gearStats)
    .map(([userId, stats]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      if (!profile) {
        console.warn('⚠️ [GEAR WARNING] Profile not found for user:', userId);
        return null;
      }
      console.log(`✅ [GEAR INCLUDE] User ${userId} (${profile.full_name}) - items: ${stats.total_items}`);
      return {
        id: userId,
        full_name: profile.full_name,
        metric_value: stats.total_items
      };
    })
    .filter(Boolean)
    .filter((user: any) => user.metric_value > 0)
    .sort((a: any, b: any) => b.metric_value - a.metric_value)
    .slice(0, 5); // Show top 5 for gear leaderboards

  console.log('🏁 [GEAR FINAL] Top gear owners for leaderboard:', topGearOwners.length, 'entries');
  console.log('📊 [GEAR RESULT] Top gear owners:', topGearOwners);
  return topGearOwners;
};
