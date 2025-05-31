
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { processClimbingData } from "@/hooks/useClimbingLeaderboards";
import { processGearData } from "@/hooks/useGearLeaderboard";
import { processEventData } from "@/hooks/useEventLeaderboard";
import type { LeaderboardData } from "@/hooks/types/leaderboard";

export function useLeaderboardDataFetcher() {
  const { toast } = useToast();

  const fetchAllLeaderboardData = useCallback(async (): Promise<LeaderboardData> => {
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

    // Also fetch archived attendance data for event leaderboard
    let archivedEventData: any[] = [];
    try {
      const { data: archived } = await supabase
        .from('archived_event_attendance')
        .select('user_id, event_id, attended_at');
      archivedEventData = archived || [];
    } catch (error) {
      console.log('📊 [LEADERBOARD] No archived attendance data available');
    }

    // Combine current and archived event data
    const combinedEventData = [...(eventData || [])];
    if (archivedEventData.length > 0) {
      const currentEventMap = new Map();
      eventData?.forEach(record => {
        const key = `${record.user_id}-${record.event_id}`;
        currentEventMap.set(key, true);
      });

      archivedEventData.forEach(record => {
        const key = `${record.user_id}-${record.event_id}`;
        if (!currentEventMap.has(key)) {
          combinedEventData.push({
            user_id: record.user_id,
            status: 'approved',
            event_id: record.event_id,
            approved_at: record.attended_at
          });
        }
      });
    }

    console.log('✅ [LEADERBOARD] All data fetched successfully');
    console.log('📊 [LEADERBOARD] Data counts:', {
      profiles: profilesData?.length,
      completions: completionsWithRoutes.length,
      gear: gearData?.length,
      events: combinedEventData.length
    });

    // Process all leaderboard data
    const climbingResults = processClimbingData(profilesData || [], completionsWithRoutes);
    const gearOwners = processGearData(profilesData || [], gearData || []);
    const eventAttendees = processEventData(profilesData || [], combinedEventData);

    return {
      topGradeClimbers: climbingResults.topGradeClimbers,
      topTradClimbers: climbingResults.topTradClimbers,
      topSportClimbers: climbingResults.topSportClimbers,
      topTopRopeClimbers: climbingResults.topTopRopeClimbers,
      topGearOwners: gearOwners,
      topEventAttendees: eventAttendees
    };
  }, [toast]);

  const handleFetchError = useCallback((error: any) => {
    console.error('❌ [LEADERBOARD] Error fetching leaderboard data:', error);
    toast({
      title: "Error",
      description: "Failed to load leaderboard data",
      variant: "destructive",
    });
  }, [toast]);

  return {
    fetchAllLeaderboardData,
    handleFetchError
  };
}
