
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommunityMember } from "@/types";
import { handleSupabaseError, logError } from "@/utils/error";
import { errorLogger } from "@/utils/errorLogger";

export function useCommunityData() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  const fetchCommunityMembers = async () => {
    const abortController = new AbortController();
    
    try {
      console.log('🔄 fetchCommunityMembers: Starting fetch');
      
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')
        .abortSignal(abortController.signal);

      if (error) throw error;

      console.log('✅ fetchCommunityMembers: Profiles fetched', profiles?.length);

      // Get additional stats for each member with better error handling and stable counts
      const membersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Check if component is still mounted before proceeding
          if (!mountedRef.current) return null;

          let equipmentCount = 0;
          let eventsCount = 0;

          try {
            // Get equipment count with better error handling
            const { count: fetchedEquipmentCount, error: equipmentError } = await supabase
              .from('user_equipment')
              .select('*', { count: 'exact' })
              .eq('user_id', profile.id)
              .abortSignal(abortController.signal);

            if (equipmentError) {
              console.error('❌ Equipment count error for user', profile.id, equipmentError);
              errorLogger.log({
                message: `Equipment count fetch failed for user ${profile.id}: ${equipmentError.message}`,
                userId: profile.id,
                route: '/community',
                type: 'network_error',
                details: `Equipment fetch error - count flickering issue: ${JSON.stringify(equipmentError)}`,
                source: 'community_data_equipment'
              });
              equipmentCount = 0; // Set stable fallback
            } else {
              equipmentCount = fetchedEquipmentCount || 0;
            }
          } catch (error: any) {
            console.error('❌ Equipment fetch exception for user', profile.id, error);
            errorLogger.log({
              message: `Equipment fetch exception for user ${profile.id}: ${error.message}`,
              userId: profile.id,
              route: '/community',
              type: 'network_error',
              details: `Equipment fetch exception - flickering issue: ${JSON.stringify(error)}`,
              source: 'community_data_equipment'
            });
            equipmentCount = 0; // Set stable fallback
          }

          try {
            // Get events count with better error handling
            const { count: fetchedEventsCount, error: eventsError } = await supabase
              .from('event_participants')
              .select('*', { count: 'exact' })
              .eq('user_id', profile.id)
              .abortSignal(abortController.signal);

            if (eventsError) {
              console.error('❌ Events count error for user', profile.id, eventsError);
              errorLogger.log({
                message: `Events count fetch failed for user ${profile.id}: ${eventsError.message}`,
                userId: profile.id,
                route: '/community',
                type: 'network_error',
                details: `Events fetch error - count flickering issue: ${JSON.stringify(eventsError)}`,
                source: 'community_data_events'
              });
              eventsCount = 0; // Set stable fallback
            } else {
              eventsCount = fetchedEventsCount || 0;
            }
          } catch (error: any) {
            console.error('❌ Events fetch exception for user', profile.id, error);
            errorLogger.log({
              message: `Events fetch exception for user ${profile.id}: ${error.message}`,
              userId: profile.id,
              route: '/community',
              type: 'network_error',
              details: `Events fetch exception - flickering issue: ${JSON.stringify(error)}`,
              source: 'community_data_events'
            });
            eventsCount = 0; // Set stable fallback
          }

          console.log(`📊 User ${profile.full_name}: equipment=${equipmentCount}, events=${eventsCount}`);

          return {
            ...profile,
            equipment_count: equipmentCount,
            events_count: eventsCount,
          };
        })
      );

      // Filter out null values from unmounted component checks
      const validMembers = membersWithStats.filter(Boolean) as CommunityMember[];

      console.log('✅ fetchCommunityMembers: Final members with stats', validMembers.length);

      if (mountedRef.current) {
        setMembers(validMembers);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && mountedRef.current) {
        console.error('❌ fetchCommunityMembers: Main error', error);
        
        const apiError = handleSupabaseError(error);
        logError('fetchCommunityMembers', error);
        
        errorLogger.log({
          message: `Community members fetch failed: ${error.message}`,
          route: '/community',
          type: 'network_error',
          details: `Main fetch error - flickering counts issue: ${JSON.stringify(error)}`,
          source: 'community_data_main'
        });
        
        toast({
          title: "Error",
          description: apiError.message || "Failed to load community members",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }

    return () => {
      abortController.abort();
    };
  };

  return {
    members,
    setMembers,
    loading,
    setLoading,
    fetchCommunityMembers,
    mountedRef,
  };
}
