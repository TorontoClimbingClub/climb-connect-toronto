
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommunityMember } from "@/types/community";
import { handleSupabaseError, logError } from "@/utils/error";

export function useCommunity() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const mountedRef = useRef(true);

  const fetchCommunityMembers = async () => {
    console.log('🔄 Fetching community members...');
    const abortController = new AbortController();
    
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name')
        .abortSignal(abortController.signal);

      if (error) throw error;

      console.log('📊 Fetched profiles count:', profiles?.length || 0);
      console.log('📋 Sample profile data:', profiles?.[0]);

      if (!profiles || profiles.length === 0) {
        console.log('⚠️ No profiles found in database');
        if (mountedRef.current) {
          setMembers([]);
        }
        return;
      }

      // Get additional stats for each member
      const membersWithStats = await Promise.all(
        profiles.map(async (profile) => {
          // Check if component is still mounted before proceeding
          if (!mountedRef.current) return null;

          try {
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
          } catch (error) {
            console.log('⚠️ Error fetching stats for user:', profile.id, error);
            // Return profile without stats if stats fetch fails
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

      console.log('✅ Members with stats processed:', validMembers.length);
      console.log('👥 Sample member with stats:', validMembers[0]);

      if (mountedRef.current) {
        setMembers(validMembers);
        console.log('🎯 Members state updated successfully');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && mountedRef.current) {
        const apiError = handleSupabaseError(error);
        logError('fetchCommunityMembers', error);
        console.error('❌ Community fetch error:', error);
        
        toast({
          title: "Error",
          description: apiError.message || "Failed to load community members",
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    }

    return () => {
      abortController.abort();
    };
  };

  useEffect(() => {
    mountedRef.current = true;
    console.log('🚀 Community hook initialized');
    
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
