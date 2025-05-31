
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
  console.log('🔍 [CLIMBING DEBUG] Processing climbing data:', { 
    profiles: profilesData.length, 
    completions: completionsData.length 
  });

  // Log sample data to understand structure
  if (completionsData.length > 0) {
    console.log('📊 [CLIMBING DATA] Sample completion:', completionsData[0]);
  }

  // Group completions by user
  const userStats = completionsData.reduce((acc: any, completion) => {
    const userId = completion.user_id;
    const grade = completion.routes?.grade;
    const style = completion.routes?.style;
    
    if (!userId) {
      console.warn('⚠️ [CLIMBING WARNING] Completion missing user_id:', completion);
      return acc;
    }
    
    if (!grade || !style) {
      console.warn('⚠️ [CLIMBING WARNING] Completion missing route data:', { userId, grade, style, completion });
      return acc;
    }
    
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
    
    // IMPROVED STYLE MATCHING: Handle various style naming conventions
    const normalizedStyle = style.toLowerCase().trim().replace(/[-_\s]/g, '');
    console.log(`🔍 [CLIMBING STYLE] User ${userId} route style: "${style}" (normalized: "${normalizedStyle}")`);
    
    if (normalizedStyle === 'trad' || normalizedStyle === 'traditional') {
      acc[userId].tradRoutes++;
      console.log(`📈 [CLIMBING STATS] User ${userId} trad routes: ${acc[userId].tradRoutes}`);
    } else if (normalizedStyle === 'sport') {
      acc[userId].sportRoutes++;
      console.log(`📈 [CLIMBING STATS] User ${userId} sport routes: ${acc[userId].sportRoutes}`);
    } else if (normalizedStyle === 'toprope' || normalizedStyle === 'topropeclimbing' || normalizedStyle === 'tr') {
      acc[userId].topRopeRoutes++;
      console.log(`📈 [CLIMBING STATS] User ${userId} top rope routes: ${acc[userId].topRopeRoutes}`);
    } else {
      console.warn(`⚠️ [CLIMBING WARNING] Unknown style "${style}" (normalized: "${normalizedStyle}") for user ${userId}`);
    }
    
    // Track highest grade
    const gradeValue = gradeOrder[grade] || 0;
    if (gradeValue > acc[userId].highestGradeValue) {
      acc[userId].highestGrade = grade;
      acc[userId].highestGradeValue = gradeValue;
      console.log(`🏆 [CLIMBING GRADE] User ${userId} new highest grade: ${grade} (${gradeValue})`);
    }
    
    return acc;
  }, {});

  console.log('📊 [CLIMBING STATS] User stats calculated:', Object.keys(userStats).length, 'users');
  console.log('📊 [CLIMBING STATS] Full user stats:', userStats);

  // Create leaderboard entries for each category
  const createLeaderboard = (metric: string, isGrade = false) => {
    console.log(`🔍 [CLIMBING DEBUG] Creating ${metric} leaderboard (isGrade: ${isGrade})`);
    
    const results = Object.entries(userStats)
      .map(([userId, stats]: [string, any]) => {
        const profile = profilesData.find(p => p.id === userId);
        if (!profile) {
          console.warn(`⚠️ [CLIMBING WARNING] Profile not found for user: ${userId}`);
          return null;
        }
        
        const value = isGrade ? stats.highestGrade : stats[metric];
        console.log(`🔍 [CLIMBING VALUE] User ${userId} (${profile.full_name}) - ${metric}: ${value} (type: ${typeof value})`);
        
        if (!value || (typeof value === 'number' && value === 0)) {
          console.log(`📊 [CLIMBING FILTER] User ${userId} (${profile.full_name}) filtered out - ${metric}: ${value}`);
          return null;
        }
        
        console.log(`✅ [CLIMBING INCLUDE] User ${userId} (${profile.full_name}) - ${metric}: ${value}`);
        return {
          id: userId,
          full_name: profile.full_name,
          metric_value: value
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

    console.log(`📊 [CLIMBING RESULT] ${metric} leaderboard:`, results.length, 'entries');
    console.log(`📊 [CLIMBING RESULT] ${metric} top entries:`, results);
    return results;
  };

  const results = {
    topGradeClimbers: createLeaderboard('highestGrade', true),
    topTradClimbers: createLeaderboard('tradRoutes'),
    topSportClimbers: createLeaderboard('sportRoutes'),
    topTopRopeClimbers: createLeaderboard('topRopeRoutes')
  };

  console.log('🏁 [CLIMBING FINAL] All climbing leaderboards processed:', {
    topGradeClimbers: results.topGradeClimbers.length,
    topTradClimbers: results.topTradClimbers.length,
    topSportClimbers: results.topSportClimbers.length,
    topTopRopeClimbers: results.topTopRopeClimbers.length
  });
  
  return results;
};
