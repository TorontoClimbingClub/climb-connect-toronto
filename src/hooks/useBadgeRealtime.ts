
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseBadgeRealtimeProps {
  onAttendanceChange: (userId: string) => Promise<void>;
}

export function useBadgeRealtime({ onAttendanceChange }: UseBadgeRealtimeProps) {
  // Simplified real-time subscription - just trigger recalculation on any attendance change
  useEffect(() => {
    const channel = supabase
      .channel('badges-realtime-simplified')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to ALL events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        async (payload) => {
          console.log('🔄 [BADGES] Attendance changed, triggering badge recalculation:', payload);
          
          try {
            // Handle both new and old records to cover all event types
            const userIds = new Set<string>();
            
            if (payload.new && typeof payload.new === 'object' && 'user_id' in payload.new && payload.new.user_id) {
              userIds.add(payload.new.user_id as string);
            }
            
            if (payload.old && typeof payload.old === 'object' && 'user_id' in payload.old && payload.old.user_id) {
              userIds.add(payload.old.user_id as string);
            }
            
            // Recalculate badges for affected users
            for (const userId of userIds) {
              console.log('🔄 [BADGES] Recalculating badges for affected user:', userId);
              await onAttendanceChange(userId);
            }
            
          } catch (error) {
            console.error('❌ [BADGES] Error in real-time badge recalculation:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('🔄 [BADGES] Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ [BADGES] Successfully subscribed to real-time badge updates');
        }
      });

    return () => {
      console.log('🔄 [BADGES] Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [onAttendanceChange]);
}
