
import type { LeaderboardUser } from "./useLeaderboardData";

export const processEventData = (
  profilesData: any[],
  eventData: any[]
): LeaderboardUser[] => {
  const eventStats = eventData.reduce((acc: any, participation) => {
    if (!acc[participation.user_id]) {
      acc[participation.user_id] = { event_count: 0 };
    }
    acc[participation.user_id].event_count += 1;
    return acc;
  }, {});

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
    .slice(0, 5);

  console.log('Setting events leaderboard:', topEventAttendees);
  return topEventAttendees;
};
