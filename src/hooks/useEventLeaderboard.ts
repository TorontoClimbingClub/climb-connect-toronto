
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
    console.log('📊 [EVENT DATA] All event data:', eventData);
  }
  
  // Filter and count only approved attendances for each user
  const approvedAttendances = eventData.filter(approval => approval.status === 'approved');
  console.log('✅ [EVENT FILTER] Approved attendances found:', approvedAttendances.length);
  console.log('✅ [EVENT FILTER] All approved attendances:', approvedAttendances);
  
  const eventStats = approvedAttendances.reduce((acc: any, approval) => {
    if (!acc[approval.user_id]) {
      acc[approval.user_id] = { event_count: 0, events: [] };
    }
    acc[approval.user_id].event_count += 1;
    acc[approval.user_id].events.push(approval.event_id);
    console.log(`📈 [EVENT STATS] User ${approval.user_id} events: ${acc[approval.user_id].event_count}`);
    return acc;
  }, {});

  console.log('📊 [EVENT STATS] Event attendance stats:', Object.keys(eventStats).length, 'users with events');
  console.log('📊 [EVENT STATS] Full event stats:', eventStats);

  // Create leaderboard entries for users with approved attendances
  const topEventAttendees = Object.entries(eventStats)
    .map(([userId, stats]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      if (!profile) {
        console.warn('⚠️ [EVENT WARNING] Profile not found for user:', userId);
        return null;
      }
      console.log(`✅ [EVENT INCLUDE] User ${userId} (${profile.full_name}) - events: ${stats.event_count}`);
      return {
        id: userId,
        full_name: profile.full_name,
        metric_value: stats.event_count
      };
    })
    .filter(Boolean)
    .filter((user: any) => user.metric_value > 0)
    .sort((a: any, b: any) => b.metric_value - a.metric_value)
    .slice(0, 10); // Show top 10 event enthusiasts

  console.log('🏁 [EVENT FINAL] Top event attendees for leaderboard:', topEventAttendees.length, 'entries');
  console.log('📊 [EVENT RESULT] Top event attendees:', topEventAttendees);
  return topEventAttendees;
};
