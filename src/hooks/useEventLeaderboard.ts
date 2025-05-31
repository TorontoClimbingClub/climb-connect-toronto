
import type { LeaderboardUser } from "@/hooks/types/leaderboard";

export const processEventData = (
  profilesData: any[],
  eventData: any[]
) => {
  console.log('🔍 [EVENT LEADERBOARD] Processing event attendance data:', { 
    profiles: profilesData.length, 
    events: eventData.length 
  });

  // Enhanced logging for debugging admin visibility
  const adminProfiles = profilesData.filter(p => p.full_name?.toLowerCase().includes('mateo'));
  console.log('👑 [EVENT DEBUG] Admin profiles found:', adminProfiles);

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
    
    // Enhanced logging for admin users
    const userProfile = profilesData.find(p => p.id === userId);
    if (userProfile?.full_name?.toLowerCase().includes('mateo')) {
      console.log(`👑 [EVENT ADMIN] Admin ${userProfile.full_name} approved events: ${acc[userId]}`);
    }
    
    console.log(`📈 [EVENT STATS] User ${userId} (${userProfile?.full_name || 'Unknown'}) approved events: ${acc[userId]}`);
    
    return acc;
  }, {});

  console.log('📊 [EVENT STATS] User event counts calculated:', Object.keys(userEventCounts).length, 'users');
  console.log('📊 [EVENT STATS] Full user counts:', userEventCounts);

  // Create leaderboard entries with enhanced admin debugging
  const results = Object.entries(userEventCounts)
    .map(([userId, eventCount]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      if (!profile) {
        console.warn(`⚠️ [EVENT WARNING] Profile not found for user: ${userId}`);
        return null;
      }
      
      // Enhanced logging for admin inclusion
      if (profile.full_name?.toLowerCase().includes('mateo')) {
        console.log(`👑 [EVENT ADMIN INCLUDE] Admin ${profile.full_name} - Events: ${eventCount}, Profile visible: ${profile.allow_profile_viewing !== false}`);
      }
      
      // Check if profile viewing is allowed (default to true if not set)
      if (profile.allow_profile_viewing === false) {
        console.log(`🔒 [EVENT PRIVACY] User ${userId} (${profile.full_name}) excluded due to privacy settings`);
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
  
  // Final check for admin in results
  const adminInResults = results.find(r => r.full_name?.toLowerCase().includes('mateo'));
  console.log(`👑 [EVENT FINAL] Admin in final results:`, adminInResults);
  
  return results;
};
