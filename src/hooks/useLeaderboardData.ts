
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { processEventData } from "./useEventLeaderboard";
import { processClimbingData } from "./useClimbingLeaderboards";
import { processGearData } from "./useGearLeaderboard";

export interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number;
}

export function useLeaderboardData() {
  const [eventLeaderboard, setEventLeaderboard] = useState<LeaderboardUser[]>([]);
  const [topGradeLeaderboard, setTopGradeLeaderboard] = useState<LeaderboardUser[]>([]);
  const [tradLeaderboard, setTradLeaderboard] = useState<LeaderboardUser[]>([]);
  const [sportLeaderboard, setSportLeaderboard] = useState<LeaderboardUser[]>([]);
  const [topRopeLeaderboard, setTopRopeLeaderboard] = useState<LeaderboardUser[]>([]);
  const [gearLeaderboard, setGearLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      console.log('🏆 [LEADERBOARDS] Starting comprehensive data fetch...');

      // Fetch all required data in parallel for better performance
      const [
        { data: profilesData, error: profilesError },
        { data: currentAttendanceData, error: currentAttendanceError },
        { data: completionsData, error: completionsError },
        { data: gearData, error: gearError }
      ] = await Promise.all([
        supabase.from('profiles').select('id, full_name'),
        supabase.from('event_attendance_approvals').select('user_id, status, event_id').eq('status', 'approved'),
        supabase.from('climb_completions').select('user_id, route_id'),
        supabase.from('user_equipment').select('user_id, quantity')
      ]);

      // Handle errors
      if (profilesError) throw profilesError;
      if (currentAttendanceError) throw currentAttendanceError;
      if (completionsError) throw completionsError;
      if (gearError) throw gearError;

      // Try to fetch archived attendance data
      let archivedAttendanceData: any[] = [];
      try {
        const { data: archived } = await (supabase as any)
          .from('archived_event_attendance')
          .select('user_id, event_id');
        archivedAttendanceData = archived || [];
      } catch (error) {
        console.log('📊 [LEADERBOARDS] No archived attendance data available');
      }

      // Combine current and archived attendance for event leaderboard
      const combinedAttendanceData = [
        ...(currentAttendanceData || []),
        ...archivedAttendanceData.map(item => ({ ...item, status: 'approved' }))
      ];

      console.log('📊 [LEADERBOARDS] Data fetched:', {
        profiles: profilesData?.length || 0,
        currentAttendance: currentAttendanceData?.length || 0,
        archivedAttendance: archivedAttendanceData.length,
        totalAttendance: combinedAttendanceData.length,
        completions: completionsData?.length || 0,
        gear: gearData?.length || 0
      });

      // Process all leaderboards
      const eventResults = processEventData(profilesData || [], combinedAttendanceData);
      const climbingResults = processClimbingData(profilesData || [], completionsData || []);
      const gearResults = processGearData(profilesData || [], gearData || []);

      // Update all leaderboards
      setEventLeaderboard(eventResults);
      setTopGradeLeaderboard(climbingResults.topGrade);
      setTradLeaderboard(climbingResults.trad);
      setSportLeaderboard(climbingResults.sport);
      setTopRopeLeaderboard(climbingResults.topRope);
      setGearLeaderboard(gearResults);

      console.log('🏆 [LEADERBOARDS] All leaderboards updated successfully');

    } catch (error: any) {
      console.error('❌ [LEADERBOARDS] Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions for automatic updates
  useEffect(() => {
    const channel = supabase
      .channel('leaderboards-realtime-enhanced')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        (payload) => {
          console.log('🔄 [LEADERBOARDS] Attendance data changed, refreshing leaderboards:', payload);
          fetchLeaderboardData();
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
          console.log('🔄 [LEADERBOARDS] Climb completions changed, refreshing leaderboards:', payload);
          fetchLeaderboardData();
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
          console.log('🔄 [LEADERBOARDS] Equipment data changed, refreshing leaderboards:', payload);
          fetchLeaderboardData();
        }
      )
      .subscribe((status) => {
        console.log('🔄 [LEADERBOARDS] Real-time subscription status:', status);
      });

    return () => {
      console.log('🔄 [LEADERBOARDS] Cleaning up real-time subscriptions');
      supabase.removeChannel(channel);
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return {
    eventLeaderboard,
    topGradeLeaderboard,
    tradLeaderboard,
    sportLeaderboard,
    topRopeLeaderboard,
    gearLeaderboard,
    loading,
    refreshData: fetchLeaderboardData
  };
}
