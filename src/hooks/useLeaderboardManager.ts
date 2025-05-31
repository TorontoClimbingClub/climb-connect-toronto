
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { processClimbingData, processGearData } from "@/hooks/useClimbingLeaderboards";
import { processEventData } from "@/hooks/useEventLeaderboard";

export interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

export function useLeaderboardManager() {
  const [topGradeClimbers, setTopGradeClimbers] = useState<LeaderboardUser[]>([]);
  const [topTradClimbers, setTopTradClimbers] = useState<LeaderboardUser[]>([]);
  const [topSportClimbers, setTopSportClimbers] = useState<LeaderboardUser[]>([]);
  const [topTopRopeClimbers, setTopTopRopeClimbers] = useState<LeaderboardUser[]>([]);
  const [topGearOwners, setTopGearOwners] = useState<LeaderboardUser[]>([]);
  const [topEventAttendees, setTopEventAttendees] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllLeaderboardData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 [LEADERBOARD] Starting comprehensive leaderboard data fetch...');

      // Fetch all required data in parallel
      const [
        { data: profilesData, error: profilesError },
        { data: completionsData, error: completionsError },
        { data: gearData, error: gearError },
        { data: eventData, error: eventError }
      ] = await Promise.all([
        supabase.from('profiles').select('id, full_name').order('full_name'),
        supabase.from('climb_completions').select('user_id, route_id'),
        supabase.from('user_equipment').select('user_id, quantity'),
        supabase.from('event_attendance_approvals').select('user_id, status, event_id, approved_at').eq('status', 'approved')
      ]);

      if (profilesError) throw profilesError;
      if (completionsError) throw completionsError;
      if (gearError) throw gearError;
      if (eventError) throw eventError;

      // Fetch routes data separately to avoid join issues
      const { data: routesData, error: routesError } = await supabase
        .from('routes')
        .select('id, grade, style');

      if (routesError) throw routesError;

      // Create manual join for completions and routes
      const completionsWithRoutes = completionsData?.map(completion => {
        const route = routesData?.find(r => r.id === completion.route_id);
        return {
          user_id: completion.user_id,
          route_id: completion.route_id,
          routes: route ? { grade: route.grade, style: route.style } : null
        };
      }).filter(item => item.routes !== null) || [];

      console.log('✅ [LEADERBOARD] All data fetched successfully');
      console.log('📊 [LEADERBOARD] Data counts:', {
        profiles: profilesData?.length,
        completions: completionsWithRoutes.length,
        gear: gearData?.length,
        events: eventData?.length
      });

      // Process all leaderboard data
      const [gradeClimbers, tradClimbers, sportClimbers, topRopeClimbers] = processClimbingData(profilesData || [], completionsWithRoutes);
      const gearOwners = processGearData(profilesData || [], gearData || []);
      const eventAttendees = processEventData(profilesData || [], eventData || []);

      // Update all leaderboard states
      setTopGradeClimbers(gradeClimbers);
      setTopTradClimbers(tradClimbers);
      setTopSportClimbers(sportClimbers);
      setTopTopRopeClimbers(topRopeClimbers);
      setTopGearOwners(gearOwners);
      setTopEventAttendees(eventAttendees);

    } catch (error: any) {
      console.error('❌ [LEADERBOARD] Error fetching leaderboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllLeaderboardData();
  }, [fetchAllLeaderboardData]);

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topGearOwners,
    topEventAttendees,
    loading,
    refreshLeaderboards: fetchAllLeaderboardData
  };
}
