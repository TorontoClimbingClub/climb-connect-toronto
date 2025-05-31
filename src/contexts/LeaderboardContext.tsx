
import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
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

interface LeaderboardContextType {
  topGradeClimbers: LeaderboardUser[];
  topTradClimbers: LeaderboardUser[];
  topSportClimbers: LeaderboardUser[];
  topTopRopeClimbers: LeaderboardUser[];
  topGearOwners: LeaderboardUser[];
  topEventAttendees: LeaderboardUser[];
  loading: boolean;
  lastSync: number;
  refreshLeaderboards: () => Promise<void>;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export function LeaderboardProvider({ children }: { children: React.ReactNode }) {
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
      const now = Date.now();
      if (!forceRefresh && now - lastSync < 3000) {
        console.log('🔄 [LEADERBOARD CONTEXT] Skipping fetch due to throttle');
        return;
      }

      setLoading(true);
      console.log('🔍 [LEADERBOARD CONTEXT] Fetching comprehensive leaderboard data...');

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

      // Fetch routes data separately
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

      // Fetch archived attendance data
      let archivedEventData: any[] = [];
      try {
        const { data: archived } = await supabase
          .from('archived_event_attendance')
          .select('user_id, event_id, attended_at');
        archivedEventData = archived || [];
      } catch (error) {
        console.log('📊 [LEADERBOARD CONTEXT] No archived attendance data available');
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

      console.log('✅ [LEADERBOARD CONTEXT] All data fetched successfully');
      console.log('📊 [LEADERBOARD CONTEXT] Data counts:', {
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

      // Broadcast update to all clients
      const syncChannel = supabase.channel('leaderboard-central-sync');
      syncChannel.send({
        type: 'broadcast',
        event: 'data_updated',
        payload: {
          timestamp: now,
          source: 'central_context',
          checksum: generateDataChecksum(eventAttendees, gearOwners, climbingResults)
        }
      });

    } catch (error: any) {
      console.error('❌ [LEADERBOARD CONTEXT] Error fetching leaderboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, lastSync]);

  // Generate checksum for data consistency validation
  const generateDataChecksum = (eventData: any[], gearData: any[], climbingData: any) => {
    const combined = JSON.stringify({
      events: eventData.length,
      gear: gearData.length,
      climbing: Object.keys(climbingData).length
    });
    return btoa(combined).slice(0, 10);
  };

  // Single centralized real-time subscription
  useEffect(() => {
    console.log('🔄 [LEADERBOARD CONTEXT] Setting up centralized real-time subscriptions');

    // Main data subscription
    const dataChannel = supabase
      .channel('leaderboard-data-central')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        (payload) => {
          console.log('🔄 [LEADERBOARD CONTEXT] Event attendance updated:', payload);
          setTimeout(() => fetchAllLeaderboardData(true), 1000);
        }
      )
      .subscribe();

    // Cross-client sync subscription
    const syncChannel = supabase
      .channel('leaderboard-central-sync')
      .on(
        'broadcast',
        { event: 'data_updated' },
        (payload) => {
          console.log('🔄 [LEADERBOARD CONTEXT] Received central sync:', payload);
          const now = Date.now();
          if (now - lastSync > 2000) {
            fetchAllLeaderboardData(true);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 [LEADERBOARD CONTEXT] Cleaning up centralized subscriptions');
      supabase.removeChannel(dataChannel);
      supabase.removeChannel(syncChannel);
    };
  }, [fetchAllLeaderboardData, lastSync]);

  // Initial data fetch
  useEffect(() => {
    fetchAllLeaderboardData(true);
  }, []);

  const value: LeaderboardContextType = {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topGearOwners,
    topEventAttendees,
    loading,
    lastSync,
    refreshLeaderboards: () => fetchAllLeaderboardData(true)
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboardContext() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboardContext must be used within a LeaderboardProvider');
  }
  return context;
}
