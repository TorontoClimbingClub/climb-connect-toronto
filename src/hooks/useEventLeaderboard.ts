
import type { LeaderboardUser } from "./useLeaderboardData";

export const processEventData = (
  profilesData: any[],
  eventData: any[]
): LeaderboardUser[] => {
  console.log('Processing event data:', { profilesData: profilesData.length, eventData: eventData.length });
  
  // Count approved attendances for each user
  const eventStats = eventData
    .filter(approval => approval.status === 'approved') // Only count approved attendances
    .reduce((acc: any, approval) => {
      if (!acc[approval.user_id]) {
        acc[approval.user_id] = { event_count: 0 };
      }
      acc[approval.user_id].event_count += 1;
      return acc;
    }, {});

  console.log('Event stats calculated:', eventStats);

  // Create leaderboard entries
  const topEventAttendees = Object.entries(eventStats)
    .map(([userId, stats]: [string, any]) => {
      const profile = profilesData.find(p => p.id === userId);
      return profile ? {
        id: userId,
        full_name: profile.full_name,
        metric_value: stats.event_count
      } : null;
    })
    .filter(Boolean)
    .filter((user: any) => user.metric_value > 0)
    .sort((a: any, b: any) => b.metric_value - a.metric_value)
    .slice(0, 10); // Show top 10 for event enthusiasts

  console.log('Top event attendees:', topEventAttendees);
  return topEventAttendees;
};
