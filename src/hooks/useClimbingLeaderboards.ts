
import type { LeaderboardUser } from "./useLeaderboardData";

// Grade mapping for sorting
const gradeOrder: { [key: string]: number } = {
  '5.3': 1, '5.4': 2, '5.5': 3, '5.6': 4, '5.7': 5, '5.8': 6, '5.9': 7,
  '5.10a': 8, '5.10b': 9, '5.10c': 10, '5.10d': 11,
  '5.11a': 12, '5.11b': 13, '5.11c': 14, '5.11d': 15,
  '5.12a': 16, '5.12b': 17, '5.12c': 18, '5.12d': 19,
  '5.13a': 20, '5.13b': 21, '5.13c': 22, '5.13d': 23,
  '5.14a': 24, '5.14b': 25, '5.14c': 26, '5.14d': 27,
  '5.15a': 28, '5.15b': 29, '5.15c': 30, '5.15d': 31
};

export const processClimbingData = (
  profilesData: any[],
  completionsData: any[]
) => {
  // Group completions by user
  const userStats = completionsData.reduce((acc: any, completion) => {
    const userId = completion.user_id;
    const grade = completion.routes.grade;
    const style = completion.routes.style;
    
    if (!acc[userId]) {
      acc[userId] = {
        routes: [],
        tradRoutes: 0,
        sportRoutes: 0,
        topRopeRoutes: 0,
        highestGrade: null,
        highestGradeValue: 0
      };
    }
    
    acc[userId].routes.push({ grade, style });
    
    // Count by style
    if (style === 'Traditional') acc[userId].tradRoutes++;
    if (style === 'Sport') acc[userId].sportRoutes++;
    if (style === 'Top Rope') acc[userId].topRopeRoutes++;
    
    // Track highest grade
    const gradeValue = gradeOrder[grade] || 0;
    if (gradeValue > acc[userId].highestGradeValue) {
      acc[userId].highestGrade = grade;
      acc[userId].highestGradeValue = gradeValue;
    }
    
    return acc;
  }, {});

  // Create leaderboard entries for each category
  const createLeaderboard = (metric: string, isGrade = false) => {
    return Object.entries(userStats)
      .map(([userId, stats]: [string, any]) => {
        const profile = profilesData.find(p => p.id === userId);
        if (!profile) return null;
        
        const value = isGrade ? stats.highestGrade : stats[metric];
        if (!value || (typeof value === 'number' && value === 0)) return null;
        
        return {
          id: userId,
          full_name: profile.full_name,
          metric_value: isGrade ? value : value
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => {
        if (isGrade) {
          const aVal = gradeOrder[a.metric_value] || 0;
          const bVal = gradeOrder[b.metric_value] || 0;
          return bVal - aVal;
        }
        return b.metric_value - a.metric_value;
      })
      .slice(0, 5); // Show top 5 for climbing leaderboards
  };

  return {
    topGradeClimbers: createLeaderboard('highestGrade', true),
    topTradClimbers: createLeaderboard('tradRoutes'),
    topSportClimbers: createLeaderboard('sportRoutes'),
    topTopRopeClimbers: createLeaderboard('topRopeRoutes')
  };
};
