
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useEventParticipantsRealtime = (refreshApprovals: () => void) => {
  const fetchingRef = useRef(false);

  useEffect(() => {
    const participantsChannel = supabase
      .channel('admin-participants-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants'
        },
        (payload) => {
          console.log('🔄 Event participants updated:', payload);
          // Debounce to prevent rapid updates
          setTimeout(() => {
            if (!fetchingRef.current) {
              refreshApprovals();
            }
          }, 500);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        (payload) => {
          console.log('🔄 Attendance approvals updated:', payload);
          refreshApprovals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(participantsChannel);
    };
  }, [refreshApprovals]);
};
