
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
    console.log('🔍 [LEADERBOARD] Starting comprehensive leaderboard data fetch with new RLS policies...');

    // Fetch all required data in parallel with comprehensive queries
    const [
      { data: profilesData, error: profilesError },
      { data: completionsData, error: completionsError },
      { data: gearData, error: gearError },
      { data: eventData, error: eventError }
    ] = await Promise.all([
      // Fetch ALL profiles that allow leaderboard viewing (new RLS policy handles this)
      supabase
        .from('profiles')
        .select('id, full_name, allow_profile_viewing')
        .order('full_name'),
      supabase
        .from('climb_completions')
        .select('user_id, route_id'),
      supabase
        .from('user_equipment')
        .select('user_id, quantity'),
      // Fetch ALL approved attendance records (new RLS policy allows this)
      supabase
        .from('event_attendance_approvals')
        .select('user_id, status, event_id, approved_at')
        .eq('status', 'approved')
    ]);

    if (profilesError) {
      console.error('❌ [LEADERBOARD] Profiles error:', profilesError);
      throw profilesError;
    }
    if (completionsError) {
      console.error('❌ [LEADERBOARD] Completions error:', completionsError);
      throw completionsError;
    }
    if (gearError) {
      console.error('❌ [LEADERBOARD] Gear error:', gearError);
      throw gearError;
    }
    if (eventError) {
      console.error('❌ [LEADERBOARD] Event error:', eventError);
      throw eventError;
    }

    console.log('✅ [LEADERBOARD] RLS policy check - Data fetched successfully');
    console.log('📊 [LEADERBOARD] Profiles found:', profilesData?.length || 0);
    console.log('📊 [LEADERBOARD] Event attendance records:', eventData?.length || 0);

    // Log specific check for visibility
    const publicProfiles = profilesData?.filter(p => p.allow_profile_viewing !== false) || [];
    console.log('👥 [LEADERBOARD] Public profiles (visible on leaderboards):', publicProfiles.length);
    
    // Enhanced logging to verify Mateo and Jeff visibility
    const mateoProfile = profilesData?.find(p => p.full_name?.toLowerCase().includes('mateo'));
    const jeffProfile = profilesData?.find(p => p.full_name?.toLowerCase().includes('jeff'));
    console.log('🔍 [LEADERBOARD] Mateo profile found:', mateoProfile);
    console.log('🔍 [LEADERBOARD] Jeff profile found:', jeffProfile);

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

    // Also fetch archived attendance data for comprehensive event leaderboard
    let archivedEventData: any[] = [];
    try {
      const { data: archived, error: archivedError } = await supabase
        .from('archived_event_attendance')
        .select('user_id, event_id, attended_at');
      
      if (archivedError) {
        console.log('📊 [LEADERBOARD] Archived attendance query error:', archivedError);
      } else {
        archivedEventData = archived || [];
        console.log('📊 [LEADERBOARD] Archived attendance loaded:', archivedEventData.length, 'records');
      }
    } catch (error) {
      console.log('📊 [LEADERBOARD] No archived attendance data available:', error);
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

    console.log('📊 [LEADERBOARD] Combined event data:', combinedEventData.length, 'total records');

    // Log event data for specific users to debug visibility
    const mateoEvents = combinedEventData.filter(record => {
      const profile = profilesData?.find(p => p.id === record.user_id);
      return profile?.full_name?.toLowerCase().includes('mateo');
    });
    const jeffEvents = combinedEventData.filter(record => {
      const profile = profilesData?.find(p => p.id === record.user_id);
      return profile?.full_name?.toLowerCase().includes('jeff');
    });
    
    console.log('📊 [LEADERBOARD] Mateo event records:', mateoEvents.length);
    console.log('📊 [LEADERBOARD] Jeff event records:', jeffEvents.length);

    // Process all leaderboard data
    const climbingResults = processClimbingData(profilesData || [], completionsWithRoutes);
    const gearOwners = processGearData(profilesData || [], gearData || []);
    const eventAttendees = processEventData(profilesData || [], combinedEventData);

    console.log('🏆 [LEADERBOARD] Final event leaderboard entries:', eventAttendees.length);
    console.log('🏆 [LEADERBOARD] Event leaderboard results:', eventAttendees);

    return {
      topGradeClimbers: climbingResults.topGradeClimbers,
      topTradClimbers: climbingResults.topTradClimbers,
      topSportClimbers: climbingResults.topSportClimbers,
      topTopRopeClimbers: climbingResults.topTopRopeClimbers,
      topGearOwners: gearOwners,
      topEventAttendees: eventAttendees
    };
  }, []);

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
