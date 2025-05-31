
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useBadges } from "@/hooks/useBadges";

interface EnhancedMemberStats {
  eventsCount: number;
  isLoading: boolean;
}

export const useEnhancedCommunityMember = (userId: string) => {
  const { getUserBadges, updateUserBadges } = useBadges();
  const [stats, setStats] = useState<EnhancedMemberStats>({
    eventsCount: 0,
    isLoading: true
  });

  const fetchEventsCount = async () => {
    try {
      console.log(`📊 [MEMBER STATS] Fetching events count for user: ${userId}`);
      
      // Get approved attendance count (same logic as badge calculation)
      const [currentAttendance, archivedAttendance] = await Promise.all([
        supabase
          .from('event_attendance_approvals')
          .select('user_id', { count: 'exact' })
          .eq('user_id', userId)
          .eq('status', 'approved'),
        (supabase as any)
          .from('archived_event_attendance')
          .select('user_id', { count: 'exact' })
          .eq('user_id', userId)
      ]);

      const currentCount = currentAttendance.count || 0;
      const archivedCount = archivedAttendance.error ? 0 : (archivedAttendance.count || 0);
      const totalCount = currentCount + archivedCount;
      
      console.log(`📊 [MEMBER STATS] User ${userId} events count:`, { 
        currentCount, 
        archivedCount, 
        totalCount 
      });

      setStats({
        eventsCount: totalCount,
        isLoading: false
      });
      
    } catch (error) {
      console.error(`❌ [MEMBER STATS] Error fetching events count for user ${userId}:`, error);
      setStats({
        eventsCount: 0,
        isLoading: false
      });
    }
  };

  // Set up real-time subscription for this specific user's attendance changes
  useEffect(() => {
    const channel = supabase
      .channel(`member-enhanced-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log(`🔄 [MEMBER REALTIME] Attendance updated for user ${userId}, refreshing stats and badges:`, payload);
          
          // Refresh events count
          await fetchEventsCount();
          
          // Update badges
          await updateUserBadges(userId);
        }
      )
      .subscribe((status) => {
        console.log(`🔄 [MEMBER REALTIME] Subscription status for user ${userId}:`, status);
      });

    return () => {
      console.log(`🔄 [MEMBER REALTIME] Cleaning up subscription for user ${userId}`);
      supabase.removeChannel(channel);
    };
  }, [userId, updateUserBadges]);

  // Initial load
  useEffect(() => {
    fetchEventsCount();
  }, [userId]);

  return {
    ...stats,
    userBadges: getUserBadges(userId),
    refreshStats: fetchEventsCount
  };
};
