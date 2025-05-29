
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";

interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

export function useLeaderboards() {
  const [topGradeClimbers, setTopGradeClimbers] = useState<LeaderboardUser[]>([]);
  const [topTradClimbers, setTopTradClimbers] = useState<LeaderboardUser[]>([]);
  const [topSportClimbers, setTopSportClimbers] = useState<LeaderboardUser[]>([]);
  const [topTopRopeClimbers, setTopTopRopeClimbers] = useState<LeaderboardUser[]>([]);
  const [topGearOwners, setTopGearOwners] = useState<LeaderboardUser[]>([]);
  const [topEventAttendees, setTopEventAttendees] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  // Function to convert grade to numeric value for comparison
  const gradeToNumber = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      '5.0': 50, '5.1': 51, '5.2': 52, '5.3': 53, '5.4': 54, '5.5': 55,
      '5.6': 56, '5.7': 57, '5.8': 58, '5.9': 59, '5.10a': 100, '5.10b': 101,
      '5.10c': 102, '5.10d': 103, '5.11a': 110, '5.11b': 111, '5.11c': 112,
      '5.11d': 113, '5.12a': 120, '5.12b': 121, '5.12c': 122, '5.12d': 123,
      '5.13a': 130, '5.13b': 131, '5.13c': 132, '5.13d': 133, '5.14a': 140,
      '5.14b': 141, '5.14c': 142, '5.14d': 143
    };
    return gradeMap[grade] || 0;
  };

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      console.log('Starting leaderboards fetch...');

      // First, get all profiles that allow profile viewing
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, allow_profile_viewing')
        .eq('allow_profile_viewing', true);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles data:', profilesData);

      if (!profilesData || profilesData.length === 0) {
        console.log('No profiles found with public viewing enabled');
        setLoading(false);
        return;
      }

      // Get all climb completions
      const { data: completionsData, error: completionsError } = await supabase
        .from('climb_completions')
        .select('user_id, route_id');

      if (completionsError) {
        console.error('Error fetching completions:', completionsError);
        throw completionsError;
      }

      console.log('Completions data:', completionsData);

      if (completionsData && completionsData.length > 0) {
        // Process climbing data
        const userClimbingStats: { [userId: string]: {
          full_name: string;
          highest_grade_numeric: number;
          highest_grade_display: string;
          trad_count: number;
          sport_count: number;
          top_rope_count: number;
        }} = {};

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

        completionsData.forEach(completion => {
          const route = rattlesnakeRoutes.find(r => r.id === completion.route_id);
          if (!route || !userClimbingStats[completion.user_id]) return;

          const gradeNumeric = gradeToNumber(route.grade);
          if (gradeNumeric > userClimbingStats[completion.user_id].highest_grade_numeric) {
            userClimbingStats[completion.user_id].highest_grade_numeric = gradeNumeric;
            userClimbingStats[completion.user_id].highest_grade_display = route.grade;
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

        console.log('User climbing stats:', userClimbingStats);

        // Top grade climbers (only those who have climbed something)
        const topGrades = Object.entries(userClimbingStats)
          .filter(([,stats]) => stats.highest_grade_numeric > 0)
          .sort(([,a], [,b]) => b.highest_grade_numeric - a.highest_grade_numeric)
          .slice(0, 5)
          .map(([userId, stats]) => ({
            id: userId,
            full_name: stats.full_name,
            metric_value: stats.highest_grade_display
          }));

        // Top trad climbers
        const topTrad = Object.entries(userClimbingStats)
          .filter(([,stats]) => stats.trad_count > 0)
          .sort(([,a], [,b]) => b.trad_count - a.trad_count)
          .slice(0, 5)
          .map(([userId, stats]) => ({
            id: userId,
            full_name: stats.full_name,
            metric_value: stats.trad_count
          }));

        // Top sport climbers
        const topSport = Object.entries(userClimbingStats)
          .filter(([,stats]) => stats.sport_count > 0)
          .sort(([,a], [,b]) => b.sport_count - a.sport_count)
          .slice(0, 5)
          .map(([userId, stats]) => ({
            id: userId,
            full_name: stats.full_name,
            metric_value: stats.sport_count
          }));

        // Top top-rope climbers
        const topTopRope = Object.entries(userClimbingStats)
          .filter(([,stats]) => stats.top_rope_count > 0)
          .sort(([,a], [,b]) => b.top_rope_count - a.top_rope_count)
          .slice(0, 5)
          .map(([userId, stats]) => ({
            id: userId,
            full_name: stats.full_name,
            metric_value: stats.top_rope_count
          }));

        console.log('Setting climbing leaderboards:', { topGrades, topTrad, topSport, topTopRope });

        setTopGradeClimbers(topGrades);
        setTopTradClimbers(topTrad);
        setTopSportClimbers(topSport);
        setTopTopRopeClimbers(topTopRope);
      }

      // Get top gear owners
      const { data: gearData, error: gearError } = await supabase
        .from('user_equipment')
        .select('user_id, quantity');

      if (gearError) {
        console.error('Error fetching gear data:', gearError);
      } else if (gearData) {
        console.log('Gear data:', gearData);
        
        const gearStats = gearData.reduce((acc: any, item) => {
          if (!acc[item.user_id]) {
            acc[item.user_id] = { total_gear: 0 };
          }
          acc[item.user_id].total_gear += item.quantity;
          return acc;
        }, {});

        const topGear = Object.entries(gearStats)
          .map(([userId, stats]: [string, any]) => {
            const profile = profilesData.find(p => p.id === userId);
            return profile ? {
              id: userId,
              full_name: profile.full_name,
              metric_value: stats.total_gear
            } : null;
          })
          .filter(Boolean)
          .filter((user: any) => user.metric_value > 0)
          .sort((a: any, b: any) => b.metric_value - a.metric_value)
          .slice(0, 5);

        console.log('Setting gear leaderboard:', topGear);
        setTopGearOwners(topGear);
      }

      // Get top event attendees (only count events that have already happened)
      const today = new Date().toISOString().split('T')[0];
      
      const { data: eventData, error: eventError } = await supabase
        .from('event_participants')
        .select(`
          user_id,
          events!inner(date)
        `)
        .lt('events.date', today);

      if (eventError) {
        console.error('Error fetching event data:', eventError);
      } else if (eventData) {
        console.log('Event data:', eventData);
        
        const eventStats = eventData.reduce((acc: any, participation) => {
          if (!acc[participation.user_id]) {
            acc[participation.user_id] = { event_count: 0 };
          }
          acc[participation.user_id].event_count += 1;
          return acc;
        }, {});

        const topEvents = Object.entries(eventStats)
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

        console.log('Setting events leaderboard:', topEvents);
        setTopEventAttendees(topEvents);
      }

    } catch (error) {
      console.error('Error fetching leaderboards:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topGearOwners,
    topEventAttendees,
    loading
  };
}
