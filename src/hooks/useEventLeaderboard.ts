
import type { LeaderboardUser } from "./useLeaderboardData";

export const processEventData = (
  profilesData: any[],
  eventData: any[]
): LeaderboardUser[] => {
  console.log('Processing event data for Event Enthusiast leaderboard:', { 
    profilesData: profilesData.length, 
    eventData: eventData.length 
  });
  
  // Filter and count only approved attendances for each user
  const approvedAttendances = eventData.filter(approval => approval.status === 'approved');
  console.log('Approved attendances found:', approvedAttendances.length);
  
  const eventStats = approvedAttendances.reduce((acc: any, approval) => {
    if (!acc[approval.user_id]) {
      acc[approval.user_id] = { event_count: 0 };
    }
    acc[approval.user_id].event_count += 1;
    return acc;
  }, {});

  console.log('Event attendance stats:', eventStats);

  // Create leaderboard entries for users with approved attendances
  const topEventAttendees = Object.entries(eventStats)
    .map(([userId, stats]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      if (!profile) {
        console.warn('Profile not found for user:', userId);
        return null;
      }
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

  console.log('Top event attendees for leaderboard:', topEventAttendees);
  return topEventAttendees;
};
