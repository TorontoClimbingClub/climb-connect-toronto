
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommunityMember } from "@/types";
import { handleSupabaseError, logError } from "@/utils/error";

export function useCommunity() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  const fetchCommunityMembers = async () => {
    const abortController = new AbortController();
    
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')
        .abortSignal(abortController.signal);

      if (error) throw error;

      // Get additional stats for each member
      const membersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Check if component is still mounted before proceeding
          if (!mountedRef.current) return null;

          // Get equipment count
          const { count: equipmentCount } = await supabase
            .from('user_equipment')
            .select('*', { count: 'exact' })
            .eq('user_id', profile.id)
            .abortSignal(abortController.signal);

          // Get events count
          const { count: eventsCount } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact' })
            .eq('user_id', profile.id)
            .abortSignal(abortController.signal);

          return {
            ...profile,
            equipment_count: equipmentCount || 0,
            events_count: eventsCount || 0,
          };
        })
      );

      // Filter out null values from unmounted component checks
      const validMembers = membersWithStats.filter(Boolean) as CommunityMember[];

      if (mountedRef.current) {
        setMembers(validMembers);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && mountedRef.current) {
        const apiError = handleSupabaseError(error);
        logError('fetchCommunityMembers', error);
        
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

  useEffect(() => {
    mountedRef.current = true;
    
    const cleanup = fetchCommunityMembers();

    return () => {
      mountedRef.current = false;
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    members,
    loading,
    refreshMembers: fetchCommunityMembers
  };
}
