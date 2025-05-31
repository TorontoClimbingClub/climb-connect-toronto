
import type { LeaderboardUser } from "@/hooks/types/leaderboard";

export const processEventData = (
  profilesData: any[],
  eventData: any[]
) => {
  console.log('🔍 [EVENT LEADERBOARD] Processing event attendance with new RLS policies:', { 
    profiles: profilesData.length, 
    events: eventData.length 
  });

  // Log all profiles to verify visibility
  console.log('👥 [EVENT LEADERBOARD] All profiles:', profilesData.map(p => ({
    id: p.id,
    name: p.full_name,
    allow_viewing: p.allow_profile_viewing
  })));

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
    
    // Log progress for debugging
    const userProfile = profilesData.find(p => p.id === userId);
    console.log(`📈 [EVENT COUNT] User ${userProfile?.full_name || 'Unknown'} (${userId}): ${acc[userId]} events`);
    
    return acc;
  }, {});

  console.log('📊 [EVENT STATS] User event counts calculated:', Object.keys(userEventCounts).length, 'users with events');

  // Create leaderboard entries with proper visibility handling
  const results = Object.entries(userEventCounts)
    .map(([userId, eventCount]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      if (!profile) {
        console.warn(`⚠️ [EVENT WARNING] Profile not found for user: ${userId}`);
        return null;
      }
      
      // Check if profile viewing is allowed (default to true if not explicitly set to false)
      // This matches the new RLS policy: allow_profile_viewing IS NOT FALSE
      const isProfileVisible = profile.allow_profile_viewing !== false;
      
      if (!isProfileVisible) {
        console.log(`🔒 [EVENT PRIVACY] User ${userId} (${profile.full_name}) excluded due to privacy settings`);
        return null;
      }
      
      console.log(`✅ [EVENT INCLUDE] User ${userId} (${profile.full_name}) - Events: ${eventCount}, Visible: ${isProfileVisible}`);
      return {
        id: userId,
        full_name: profile.full_name,
        metric_value: eventCount
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.metric_value - a.metric_value)
    .slice(0, 10); // Show top 10 for event leaderboard

  console.log(`🏆 [EVENT RESULT] Event leaderboard final results:`, results.length, 'entries');
  console.log(`🏆 [EVENT RESULT] Leaderboard entries:`, results);
  
  // Final verification for specific users
  const mateoInResults = results.find(r => r.full_name?.toLowerCase().includes('mateo'));
  const jeffInResults = results.find(r => r.full_name?.toLowerCase().includes('jeff'));
  console.log(`🔍 [EVENT FINAL] Mateo in results:`, mateoInResults);
  console.log(`🔍 [EVENT FINAL] Jeff in results:`, jeffInResults);
  
  return results;
};
