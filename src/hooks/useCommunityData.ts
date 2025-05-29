
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

      // Get additional stats for each member with error handling
      const membersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Check if component is still mounted before proceeding
          if (!mountedRef.current) return null;

          try {
            // Get equipment count with error handling
            const { count: equipmentCount, error: equipmentError } = await supabase
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
                type: 'general_error',
                details: `Equipment error: ${JSON.stringify(equipmentError)}`,
                source: 'community_data'
              });
            }

            // Get events count with error handling
            const { count: eventsCount, error: eventsError } = await supabase
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
                type: 'general_error',
                details: `Events error: ${JSON.stringify(eventsError)}`,
                source: 'community_data'
              });
            }

            const finalEquipmentCount = equipmentCount || 0;
            const finalEventsCount = eventsCount || 0;

            console.log(`📊 User ${profile.full_name}: equipment=${finalEquipmentCount}, events=${finalEventsCount}`);

            return {
              ...profile,
              equipment_count: finalEquipmentCount,
              events_count: finalEventsCount,
            };
          } catch (error: any) {
            console.error('❌ Error fetching stats for user', profile.id, error);
            errorLogger.log({
              message: `Stats fetch failed for user ${profile.id}: ${error.message}`,
              userId: profile.id,
              route: '/community',
              type: 'general_error',
              details: `Stats error: ${JSON.stringify(error)}`,
              source: 'community_data'
            });

            // Return profile with default counts on error
            return {
              ...profile,
              equipment_count: 0,
              events_count: 0,
            };
          }
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
          type: 'general_error',
          details: `Main fetch error: ${JSON.stringify(error)}`,
          source: 'community_data'
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
