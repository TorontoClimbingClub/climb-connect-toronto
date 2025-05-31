
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { processClimbingData } from "@/hooks/useClimbingLeaderboards";
import { processGearData } from "@/hooks/useGearLeaderboard";
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
  const [lastSync, setLastSync] = useState<number>(0);
  const { toast } = useToast();

  const fetchAllLeaderboardData = useCallback(async (forceRefresh = false) => {
    try {
      // Prevent excessive fetching with debounce mechanism
      const now = Date.now();
      if (!forceRefresh && now - lastSync < 2000) {
        console.log('🔄 [LEADERBOARD] Skipping fetch due to debounce');
        return;
      }

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

      // ENHANCED: Also fetch archived attendance data for event leaderboard
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

      // Update all leaderboard states atomically
      setTopGradeClimbers(climbingResults.topGradeClimbers);
      setTopTradClimbers(climbingResults.topTradClimbers);
      setTopSportClimbers(climbingResults.topSportClimbers);
      setTopTopRopeClimbers(climbingResults.topTopRopeClimbers);
      setTopGearOwners(gearOwners);
      setTopEventAttendees(eventAttendees);
      setLastSync(now);

      // Broadcast state sync event for cross-client synchronization
      const syncChannel = supabase.channel('leaderboard-sync');
      syncChannel.send({
        type: 'broadcast',
        event: 'state_sync',
        payload: {
          timestamp: now,
          event_attendees_count: eventAttendees.length,
          sync_source: 'data_fetch'
        }
      });

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
  }, [toast, lastSync]);

  // ENHANCED: Set up comprehensive real-time subscriptions
  useEffect(() => {
    console.log('🔄 [LEADERBOARD] Setting up real-time subscriptions');

    // Multi-table subscription channel
    const mainChannel = supabase
      .channel('leaderboards-comprehensive')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        (payload) => {
          console.log('🔄 [LEADERBOARD] Event attendance updated:', payload);
          fetchAllLeaderboardData(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_equipment'
        },
        (payload) => {
          console.log('🔄 [LEADERBOARD] Gear updated:', payload);
          fetchAllLeaderboardData(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'climb_completions'
        },
        (payload) => {
          console.log('🔄 [LEADERBOARD] Climbing completion updated:', payload);
          fetchAllLeaderboardData(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('🔄 [LEADERBOARD] Profile updated:', payload);
          fetchAllLeaderboardData(true);
        }
      )
      .subscribe();

    // Cross-client state synchronization channel
    const syncChannel = supabase
      .channel('leaderboard-sync')
      .on(
        'broadcast',
        { event: 'state_sync' },
        (payload) => {
          console.log('🔄 [LEADERBOARD] Received sync broadcast:', payload);
          // If another client has newer data, refresh our state
          if (payload.payload.timestamp > lastSync) {
            console.log('🔄 [LEADERBOARD] Syncing with newer client state');
            fetchAllLeaderboardData(true);
          }
        }
      )
      .on(
        'broadcast',
        { event: 'force_refresh' },
        (payload) => {
          console.log('🔄 [LEADERBOARD] Force refresh requested:', payload);
          fetchAllLeaderboardData(true);
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 [LEADERBOARD] Cleaning up real-time subscriptions');
      supabase.removeChannel(mainChannel);
      supabase.removeChannel(syncChannel);
    };
  }, [fetchAllLeaderboardData, lastSync]);

  useEffect(() => {
    fetchAllLeaderboardData(true);
  }, []);

  // Enhanced refresh function that notifies other clients
  const refreshLeaderboards = useCallback(async () => {
    console.log('🔄 [LEADERBOARD] Manual refresh requested');
    await fetchAllLeaderboardData(true);
    
    // Notify other clients to refresh
    const syncChannel = supabase.channel('leaderboard-sync');
    syncChannel.send({
      type: 'broadcast',
      event: 'force_refresh',
      payload: {
        timestamp: Date.now(),
        source: 'manual_refresh'
      }
    });
  }, [fetchAllLeaderboardData]);

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topGearOwners,
    topEventAttendees,
    loading,
    refreshLeaderboards
  };
}
