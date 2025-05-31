import type { LeaderboardUser } from "@/hooks/types/leaderboard";

export const processGearData = (
  profilesData: any[],
  gearData: any[]
) => {
  console.log('🔍 [GEAR LEADERBOARD] Processing gear data:', { 
    profiles: profilesData.length, 
    gear: gearData.length 
  });

  // Log sample data to understand structure
  if (gearData.length > 0) {
    console.log('📊 [GEAR DATA] Sample gear:', gearData[0]);
  }

  // Group gear by user and count total quantity
  const userGearCounts = gearData.reduce((acc: any, gear) => {
    const userId = gear.user_id;
    const quantity = gear.quantity || 0;
    
    if (!userId) {
      console.warn('⚠️ [GEAR WARNING] Gear missing user_id:', gear);
      return acc;
    }
    
    if (!acc[userId]) {
      acc[userId] = 0;
    }
    
    acc[userId] += quantity;
    console.log(`📈 [GEAR STATS] User ${userId} total gear: ${acc[userId]}`);
    
    return acc;
  }, {});

  console.log('📊 [GEAR STATS] User gear counts calculated:', Object.keys(userGearCounts).length, 'users');
  console.log('📊 [GEAR STATS] Full user counts:', userGearCounts);

  // Create leaderboard entries - ENSURE TOP 5
  const results = Object.entries(userGearCounts)
    .map(([userId, gearCount]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      if (!profile) {
        console.warn(`⚠️ [GEAR WARNING] Profile not found for user: ${userId}`);
        return null;
      }
      
      // Filter out users with zero gear
      if (gearCount === 0) {
        console.log(`📊 [GEAR FILTER] User ${userId} (${profile.full_name}) filtered out - no gear`);
        return null;
      }
      
      console.log(`✅ [GEAR INCLUDE] User ${userId} (${profile.full_name}) - Gear: ${gearCount}`);
      return {
        id: userId,
        full_name: profile.full_name,
        metric_value: gearCount
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.metric_value - a.metric_value)
    .slice(0, 5); // ENSURE TOP 5 ONLY

  console.log(`📊 [GEAR RESULT] Gear leaderboard:`, results.length, 'entries');
  console.log(`📊 [GEAR RESULT] Top 5 entries:`, results);
  
  return results;
};
