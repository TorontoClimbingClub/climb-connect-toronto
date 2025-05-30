
import type { LeaderboardUser } from "./useLeaderboardData";

export const processEventData = (
  profilesData: any[],
  eventData: any[]
): LeaderboardUser[] => {
  console.log('🔍 [EVENT DEBUG] Processing event data for Event Enthusiast leaderboard:', { 
    profilesData: profilesData.length, 
    eventData: eventData.length 
  });
  
  if (eventData.length > 0) {
    console.log('📊 [EVENT DATA] Sample event attendance:', eventData[0]);
  }
  
  if (profilesData.length > 0) {
    console.log('📊 [PROFILES DATA] Sample profiles:', profilesData.slice(0, 3));
  }
  
  // Filter and count only approved attendances for each user
  const approvedAttendances = eventData.filter(approval => approval.status === 'approved');
  console.log('✅ [EVENT FILTER] Approved attendances found:', approvedAttendances.length);
  
  if (approvedAttendances.length > 0) {
    console.log('📋 [EVENT USERS] Users with approved attendance:', [...new Set(approvedAttendances.map(a => a.user_id))]);
  }
  
  // Group by user_id and count unique events
  const eventStats = approvedAttendances.reduce((acc: any, approval) => {
    if (!acc[approval.user_id]) {
      acc[approval.user_id] = { 
        event_count: 0, 
        unique_events: new Set()
      };
    }
    
    // Only count if we haven't seen this event for this user before
    if (!acc[approval.user_id].unique_events.has(approval.event_id)) {
      acc[approval.user_id].unique_events.add(approval.event_id);
      acc[approval.user_id].event_count += 1;
    }
    
    return acc;
  }, {});

  console.log('📊 [EVENT STATS] Event attendance stats for', Object.keys(eventStats).length, 'users');
  console.log('📊 [EVENT STATS] Detailed stats:', Object.fromEntries(
    Object.entries(eventStats).map(([userId, stats]: [string, any]) => [userId, stats.event_count])
  ));

  // Create leaderboard entries for users with approved attendances
  const topEventAttendees = Object.entries(eventStats)
    .map(([userId, stats]: [string, any]) => {
      // Find profile for this user - be more flexible in matching
      const profile = profilesData.find(p => p.id === userId);
      
      if (!profile) {
        console.warn('⚠️ [EVENT WARNING] Profile not found for user:', userId);
        console.warn('📋 [AVAILABLE PROFILES] Available profile IDs:', profilesData.map(p => `${p.id} (${p.full_name})`));
        
        // Return a placeholder entry instead of null to ensure we don't lose data
        return {
          id: userId,
          full_name: `User ${userId.slice(0, 8)}...`, // Show partial ID as fallback
          metric_value: stats.event_count
        };
      }
      
      console.log(`✅ [EVENT INCLUDE] User ${userId} (${profile.full_name}) - events: ${stats.event_count}`);
      return {
        id: userId,
        full_name: profile.full_name,
        metric_value: stats.event_count
      };
    })
    .filter((user: any) => user && user.metric_value > 0) // Ensure user exists and has events
    .sort((a: any, b: any) => b.metric_value - a.metric_value)
    .slice(0, 10); // Show top 10 event enthusiasts

  console.log('🏁 [EVENT FINAL] Top event attendees for leaderboard:', topEventAttendees.length, 'entries');
  console.log('📊 [EVENT RESULT] Final leaderboard:', topEventAttendees);
  
  return topEventAttendees;
};
