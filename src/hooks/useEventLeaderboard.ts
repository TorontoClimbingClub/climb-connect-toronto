import type { LeaderboardUser } from "@/hooks/types/leaderboard";

export const processEventData = (
  profilesData: any[],
  eventData: any[]
) => {
  console.log('🔍 [EVENT LEADERBOARD] Processing event attendance data:', { 
    profiles: profilesData.length, 
    events: eventData.length 
  });

  // Log sample data to understand structure
  if (eventData.length > 0) {
    console.log('📊 [EVENT DATA] Sample attendance:', eventData[0]);
  }

  // Group attendance by user and count approved events
  const userEventCounts = eventData.reduce((acc: any, attendance) => {
    const userId = attendance.user_id;
    const status = attendance.status;
    
    if (!userId) {
      console.warn('⚠️ [EVENT WARNING] Attendance missing user_id:', attendance);
      return acc;
    }
    
    // Only count approved attendance
    if (status !== 'approved') {
      console.log(`🔍 [EVENT STATUS] User ${userId} attendance not approved: ${status}`);
      return acc;
    }
    
    if (!acc[userId]) {
      acc[userId] = 0;
    }
    
    acc[userId]++;
    console.log(`📈 [EVENT STATS] User ${userId} approved events: ${acc[userId]}`);
    
    return acc;
  }, {});

  console.log('📊 [EVENT STATS] User event counts calculated:', Object.keys(userEventCounts).length, 'users');
  console.log('📊 [EVENT STATS] Full user counts:', userEventCounts);

  // Create leaderboard entries
  const results = Object.entries(userEventCounts)
    .map(([userId, eventCount]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      if (!profile) {
        console.warn(`⚠️ [EVENT WARNING] Profile not found for user: ${userId}`);
        return null;
      }
      
      console.log(`✅ [EVENT INCLUDE] User ${userId} (${profile.full_name}) - Events: ${eventCount}`);
      return {
        id: userId,
        full_name: profile.full_name,
        metric_value: eventCount
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.metric_value - a.metric_value)
    .slice(0, 10); // Show top 10 for event leaderboard

  console.log(`📊 [EVENT RESULT] Event leaderboard:`, results.length, 'entries');
  console.log(`📊 [EVENT RESULT] Top entries:`, results);
  
  return results;
};
