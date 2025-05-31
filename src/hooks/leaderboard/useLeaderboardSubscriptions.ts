
import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseLeaderboardSubscriptionsProps {
  onDataChange: () => void;
  lastSync: number;
}

export function useLeaderboardSubscriptions({ onDataChange, lastSync }: UseLeaderboardSubscriptionsProps) {
  
  const triggerLeaderboardSync = useCallback(async () => {
    try {
      // Throttle sync requests to prevent spam
      const syncChannel = supabase.channel('leaderboard-sync-optimized');
      await syncChannel.send({
        type: 'broadcast',
        event: 'force_refresh',
        payload: {
          timestamp: Date.now(),
          source: 'manual_refresh'
        }
      });
      console.log('🔄 [LEADERBOARD] Triggered optimized leaderboard sync');
    } catch (error) {
      console.error('❌ [LEADERBOARD] Failed to trigger sync:', error);
    }
  }, []);

  useEffect(() => {
    console.log('🔄 [LEADERBOARD] Setting up optimized real-time subscriptions');

    // Single subscription channel for all attendance-related updates
    const attendanceChannel = supabase
      .channel('leaderboards-attendance-only')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        (payload) => {
          console.log('🔄 [LEADERBOARD] Event attendance updated:', payload);
          // Debounced refresh to prevent rapid updates
          setTimeout(() => onDataChange(), 1000);
        }
      )
      .subscribe();

    // Simplified cross-client sync with reduced frequency
    const syncChannel = supabase
      .channel('leaderboard-sync-optimized')
      .on(
        'broadcast',
        { event: 'force_refresh' },
        (payload) => {
          console.log('🔄 [LEADERBOARD] Force refresh requested:', payload);
          // Only refresh if it's been more than 3 seconds since last update
          const now = Date.now();
          if (now - lastSync > 3000) {
            onDataChange();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 [LEADERBOARD] Cleaning up optimized subscriptions');
      supabase.removeChannel(attendanceChannel);
      supabase.removeChannel(syncChannel);
    };
  }, [onDataChange, lastSync]);

  return {
    triggerLeaderboardSync
  };
}
