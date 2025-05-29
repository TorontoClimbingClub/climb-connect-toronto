
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { gradeToNumber } from "@/utils/gradeUtils";
import type { LeaderboardUser } from "./useLeaderboardData";

interface UserClimbingStats {
  full_name: string;
  highest_grade_numeric: number;
  highest_grade_display: string;
  trad_count: number;
  sport_count: number;
  top_rope_count: number;
}

export const processClimbingData = (
  profilesData: any[],
  completionsData: any[]
): {
  topGradeClimbers: LeaderboardUser[];
  topTradClimbers: LeaderboardUser[];
  topSportClimbers: LeaderboardUser[];
  topTopRopeClimbers: LeaderboardUser[];
} => {
  const userClimbingStats: { [userId: string]: UserClimbingStats } = {};

  // Initialize stats for all public profiles
  profilesData.forEach(profile => {
    userClimbingStats[profile.id] = {
      full_name: profile.full_name,
      highest_grade_numeric: 0,
      highest_grade_display: '5.0',
      trad_count: 0,
      sport_count: 0,
      top_rope_count: 0
    };
  });

  console.log('Processing completions:', completionsData);
  console.log('Available routes count:', rattlesnakeRoutes.length);

  completionsData.forEach(completion => {
    // Convert route_id to string to ensure proper matching
    const routeId = String(completion.route_id);
    const route = rattlesnakeRoutes.find(r => String(r.id) === routeId);
    
    console.log(`Looking for route ID: ${routeId}, found:`, route?.name, route?.grade, route?.style);
    
    if (!route || !userClimbingStats[completion.user_id]) {
      if (!route) {
        console.log(`Route not found for ID: ${routeId}`);
      }
      return;
    }

    const gradeNumeric = gradeToNumber(route.grade);
    console.log(`User ${completion.user_id}: Route ${route.name} (${route.grade}) = ${gradeNumeric} numeric`);
    
    if (gradeNumeric > userClimbingStats[completion.user_id].highest_grade_numeric) {
      userClimbingStats[completion.user_id].highest_grade_numeric = gradeNumeric;
      userClimbingStats[completion.user_id].highest_grade_display = route.grade;
      console.log(`Updated highest grade for user ${completion.user_id}: ${route.grade} (${gradeNumeric})`);
    }

    // Count by climbing style
    if (route.style === 'Trad') {
      userClimbingStats[completion.user_id].trad_count++;
    } else if (route.style === 'Sport') {
      userClimbingStats[completion.user_id].sport_count++;
    } else if (route.style === 'Top Rope') {
      userClimbingStats[completion.user_id].top_rope_count++;
    }
  });

  console.log('Final user climbing stats:', userClimbingStats);

  // Top grade climbers (only those who have climbed something)
  const topGradeClimbers = Object.entries(userClimbingStats)
    .filter(([,stats]) => stats.highest_grade_numeric > 0)
    .sort(([,a], [,b]) => {
      console.log(`Comparing grades: ${a.full_name} (${a.highest_grade_display}=${a.highest_grade_numeric}) vs ${b.full_name} (${b.highest_grade_display}=${b.highest_grade_numeric})`);
      return b.highest_grade_numeric - a.highest_grade_numeric;
    })
    .slice(0, 5)
    .map(([userId, stats]) => ({
      id: userId,
      full_name: stats.full_name,
      metric_value: stats.highest_grade_display
    }));

  console.log('Top grade climbers result:', topGradeClimbers);

  // Top trad climbers
  const topTradClimbers = Object.entries(userClimbingStats)
    .filter(([,stats]) => stats.trad_count > 0)
    .sort(([,a], [,b]) => b.trad_count - a.trad_count)
    .slice(0, 5)
    .map(([userId, stats]) => ({
      id: userId,
      full_name: stats.full_name,
      metric_value: stats.trad_count
    }));

  // Top sport climbers
  const topSportClimbers = Object.entries(userClimbingStats)
    .filter(([,stats]) => stats.sport_count > 0)
    .sort(([,a], [,b]) => b.sport_count - a.sport_count)
    .slice(0, 5)
    .map(([userId, stats]) => ({
      id: userId,
      full_name: stats.full_name,
      metric_value: stats.sport_count
    }));

  // Top top-rope climbers
  const topTopRopeClimbers = Object.entries(userClimbingStats)
    .filter(([,stats]) => stats.top_rope_count > 0)
    .sort(([,a], [,b]) => b.top_rope_count - a.top_rope_count)
    .slice(0, 5)
    .map(([userId, stats]) => ({
      id: userId,
      full_name: stats.full_name,
      metric_value: stats.top_rope_count
    }));

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers
  };
};
