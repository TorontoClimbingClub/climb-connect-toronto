
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

      if (!profiles || profiles.length === 0) {
        if (mountedRef.current) {
          // Only set empty if we don't have existing data
          setMembers(prevMembers => prevMembers.length === 0 ? [] : prevMembers);
        }
        return;
      }

      // Fetch all equipment counts in a single query
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('user_equipment')
        .select('user_id, quantity')
        .abortSignal(abortController.signal);

      // Fetch all event participations in a single query
      const { data: eventsData, error: eventsError } = await supabase
        .from('event_participants')
        .select('user_id')
        .abortSignal(abortController.signal);

      // Create lookup maps for better performance
      const equipmentCounts = new Map<string, number>();
      const eventCounts = new Map<string, number>();

      // Process equipment data with error handling - don't fail the whole request
      if (equipmentError) {
        console.error('❌ Equipment fetch error:', equipmentError);
        errorLogger.log({
          message: `Equipment fetch failed: ${equipmentError.message}`,
          route: '/community',
          type: 'network_error',
          details: `Equipment bulk fetch error: ${JSON.stringify(equipmentError)}`,
          source: 'community_data_equipment_bulk'
        });
        // Use existing data for equipment counts if available
        setMembers(prevMembers => {
          return prevMembers.map(member => ({
            ...member,
            // Preserve existing equipment_count if it exists
            equipment_count: member.equipment_count || 0
          }));
        });
      } else if (equipmentData) {
        equipmentData.forEach(item => {
          const currentCount = equipmentCounts.get(item.user_id) || 0;
          equipmentCounts.set(item.user_id, currentCount + (item.quantity || 0));
        });
      }

      // Process events data with error handling - don't fail the whole request
      if (eventsError) {
        console.error('❌ Events fetch error:', eventsError);
        errorLogger.log({
          message: `Events fetch failed: ${eventsError.message}`,
          route: '/community',
          type: 'network_error',
          details: `Events bulk fetch error: ${JSON.stringify(eventsError)}`,
          source: 'community_data_events_bulk'
        });
        // Use existing data for event counts if available
        setMembers(prevMembers => {
          return prevMembers.map(member => ({
            ...member,
            // Preserve existing events_count if it exists
            events_count: member.events_count || 0
          }));
        });
      } else if (eventsData) {
        eventsData.forEach(participation => {
          const currentCount = eventCounts.get(participation.user_id) || 0;
          eventCounts.set(participation.user_id, currentCount + 1);
        });
      }

      // Only update if we have both equipment and events data, or if it's the first load
      if ((!equipmentError && !eventsError) || members.length === 0) {
        // Combine profile data with stats
        const membersWithStats = profiles.map(profile => {
          const equipmentCount = equipmentCounts.get(profile.id) || 0;
          const eventsCount = eventCounts.get(profile.id) || 0;

          console.log(`📊 User ${profile.full_name}: equipment=${equipmentCount}, events=${eventsCount}`);

          return {
            ...profile,
            equipment_count: equipmentCount,
            events_count: eventsCount,
          };
        });

        console.log('✅ fetchCommunityMembers: Final members with stats', membersWithStats.length);

        if (mountedRef.current) {
          setMembers(membersWithStats);
        }
      } else {
        // If there were errors fetching counts, preserve existing member data
        console.log('🔄 Preserving existing member data due to partial fetch errors');
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
          details: `Main fetch error: ${JSON.stringify(error)}`,
          source: 'community_data_main'
        });
        
        // Only show toast for non-network errors to avoid spam
        if (!error.message?.includes('Failed to fetch')) {
          toast({
            title: "Error",
            description: apiError.message || "Failed to load community members",
            variant: "destructive",
          });
        }
        
        // Don't reset members data on network errors - preserve existing data
        console.log('🔄 Preserving existing member data due to network error');
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
