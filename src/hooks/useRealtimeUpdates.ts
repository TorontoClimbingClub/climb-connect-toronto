
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = (
  table: string,
  onUpdate: (payload: any) => void,
  filter?: { column: string; value: string }
) => {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` })
        },
        (payload) => {
          console.log(`Real-time update for ${table}:`, payload);
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onUpdate, filter]);
};
