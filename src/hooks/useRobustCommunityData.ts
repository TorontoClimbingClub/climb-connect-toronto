
import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommunityMember } from "@/types";
import { handleSupabaseError, logError } from "@/utils/error";
import { errorLogger } from "@/utils/errorLogger";

interface CommunityDataState {
  members: CommunityMember[];
  loading: boolean;
  error: string | null;
  lastSuccessfulFetch: Date | null;
  retryCount: number;
}

export function useRobustCommunityData() {
  const [state, setState] = useState<CommunityDataState>({
    members: [],
    loading: true,
    error: null,
    lastSuccessfulFetch: null,
    retryCount: 0
  });
  
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const logCommunityError = useCallback((message: string, error: any, context: string) => {
    console.error(`❌ Community Error [${context}]:`, message, error);
    errorLogger.log({
      message: `Community ${context}: ${message}`,
      route: '/community',
      type: 'network_error',
      details: `Error: ${JSON.stringify(error)}, Context: ${context}`,
      source: 'community_data_robust'
    });
  }, []);

  const fetchProfiles = async (signal: AbortSignal): Promise<CommunityMember[]> => {
    console.log('🔄 fetchProfiles: Starting fetch');
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name')
      .abortSignal(signal);

    if (error) throw error;
    if (!profiles) return [];

    console.log('✅ fetchProfiles: Success', profiles.length);
    return profiles.map(profile => ({
      ...profile,
      equipment_count: 0,
      events_count: 0,
      climbing_experience: profile.climbing_experience || []
    }));
  };

  const fetchEquipmentCounts = async (userIds: string[], signal: AbortSignal): Promise<Map<string, number>> => {
    console.log('🔄 fetchEquipmentCounts: Starting fetch for', userIds.length, 'users');
    
    try {
      const { data: equipmentData, error } = await supabase
        .from('user_equipment')
        .select('user_id, quantity')
        .in('user_id', userIds)
        .abortSignal(signal);

      if (error) throw error;

      const equipmentCounts = new Map<string, number>();
      equipmentData?.forEach(item => {
        const currentCount = equipmentCounts.get(item.user_id) || 0;
        equipmentCounts.set(item.user_id, currentCount + (item.quantity || 0));
      });

      console.log('✅ fetchEquipmentCounts: Success', equipmentCounts.size);
      return equipmentCounts;
    } catch (error) {
      logCommunityError('Equipment counts fetch failed', error, 'equipment_fetch');
      return new Map(); // Return empty map to allow graceful degradation
    }
  };

  const fetchEventCounts = async (userIds: string[], signal: AbortSignal): Promise<Map<string, number>> => {
    console.log('🔄 fetchEventCounts: Starting fetch for', userIds.length, 'users');
    
    try {
      const { data: eventsData, error } = await supabase
        .from('event_participants')
        .select('user_id')
        .in('user_id', userIds)
        .abortSignal(signal);

      if (error) throw error;

      const eventCounts = new Map<string, number>();
      eventsData?.forEach(participation => {
        const currentCount = eventCounts.get(participation.user_id) || 0;
        eventCounts.set(participation.user_id, currentCount + 1);
      });

      console.log('✅ fetchEventCounts: Success', eventCounts.size);
      return eventCounts;
    } catch (error) {
      logCommunityError('Event counts fetch failed', error, 'events_fetch');
      return new Map(); // Return empty map to allow graceful degradation
    }
  };

  const fetchCommunityMembers = useCallback(async (isRetry = false) => {
    if (!mountedRef.current) return;

    const abortController = new AbortController();
    
    // Set timeout for the entire operation
    timeoutRef.current = setTimeout(() => {
      abortController.abort();
      logCommunityError('Request timeout', new Error('Timeout'), 'timeout');
    }, 30000); // 30 second timeout

    try {
      if (!isRetry) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      console.log('🔄 fetchCommunityMembers: Starting comprehensive fetch');
      
      // Step 1: Fetch profiles (critical - must succeed)
      let profiles: CommunityMember[];
      try {
        profiles = await fetchProfiles(abortController.signal);
      } catch (error: any) {
        if (abortController.signal.aborted) return;
        throw new Error(`Profile fetch failed: ${error.message}`);
      }

      if (profiles.length === 0) {
        console.log('📝 No profiles found');
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            members: [],
            loading: false,
            error: null,
            lastSuccessfulFetch: new Date(),
            retryCount: 0
          }));
        }
        return;
      }

      const userIds = profiles.map(p => p.id);

      // Step 2: Fetch equipment and event counts (non-critical - can fail gracefully)
      const [equipmentCounts, eventCounts] = await Promise.all([
        fetchEquipmentCounts(userIds, abortController.signal),
        fetchEventCounts(userIds, abortController.signal)
      ]);

      // Step 3: Combine data
      const membersWithStats = profiles.map(profile => ({
        ...profile,
        equipment_count: equipmentCounts.get(profile.id) || 0,
        events_count: eventCounts.get(profile.id) || 0,
      }));

      console.log('✅ fetchCommunityMembers: Complete success', membersWithStats.length);

      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          members: membersWithStats,
          loading: false,
          error: null,
          lastSuccessfulFetch: new Date(),
          retryCount: 0
        }));
      }

    } catch (error: any) {
      if (error.name === 'AbortError' || !mountedRef.current) return;

      const errorMessage = error.message || 'Failed to load community members';
      console.error('❌ fetchCommunityMembers: Fatal error', error);
      
      logCommunityError(errorMessage, error, 'main_fetch');
      
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          retryCount: prev.retryCount + 1
        }));

        // Show user-friendly error message only for critical failures
        if (!error.message?.includes('Failed to fetch')) {
          toast({
            title: "Community Loading Error",
            description: "Unable to load community members. Please try refreshing.",
            variant: "destructive",
          });
        }
      }
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      abortController.abort();
    };
  }, [toast, logCommunityError]);

  const retryFetch = useCallback(() => {
    console.log('🔄 Retrying community data fetch');
    fetchCommunityMembers(true);
  }, [fetchCommunityMembers]);

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchCommunityMembers,
    retryFetch,
    resetError,
    mountedRef,
    // Health metrics for monitoring
    isHealthy: state.error === null && state.lastSuccessfulFetch !== null,
    needsRetry: state.retryCount > 0 && state.retryCount < 3
  };
}
