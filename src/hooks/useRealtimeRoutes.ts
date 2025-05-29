
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRouteManagement } from './useRouteManagement';

export const useRealtimeRoutes = () => {
  const { refreshRoutes } = useRouteManagement();

  useEffect(() => {
    const channel = supabase
      .channel('routes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'routes'
        },
        (payload) => {
          console.log('🔄 Route updated:', payload);
          refreshRoutes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshRoutes]);
};
