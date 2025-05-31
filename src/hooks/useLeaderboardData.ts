
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

export const fetchPublicProfiles = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Starting fetchPublicProfiles...');
  
  try {
    // Fetch ALL profiles for leaderboards - leaderboards should show everyone
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .order('full_name'); // Add ordering for consistency
    
    if (error) {
      console.error('❌ [LEADERBOARD ERROR] Error fetching profiles:', error);
      throw error;
    }
    
    console.log('✅ [LEADERBOARD SUCCESS] Profiles fetched:', data?.length);
    console.log('📊 [LEADERBOARD DATA] All profiles:', data?.map(p => `${p.id}: ${p.full_name}`));
    return data || [];
    
  } catch (error) {
    console.error('❌ [LEADERBOARD CRITICAL] Critical error in fetchPublicProfiles:', error);
    throw error;
  }
};

export const fetchClimbCompletions = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Starting fetchClimbCompletions...');
  
  try {
    // IMPROVED APPROACH: Use a more robust manual join strategy
    console.log('🔍 [LEADERBOARD DEBUG] Fetching climb completions and routes separately...');
    
    const [completionsResult, routesResult] = await Promise.all([
      supabase
        .from('climb_completions')
        .select('user_id, route_id'),
      supabase
        .from('routes')
        .select('id, grade, style')
    ]);
    
    if (completionsResult.error) {
      console.error('❌ [LEADERBOARD ERROR] Error fetching completions:', completionsResult.error);
      throw completionsResult.error;
    }
    
    if (routesResult.error) {
      console.error('❌ [LEADERBOARD ERROR] Error fetching routes:', routesResult.error);
      throw routesResult.error;
    }
    
    const completions = completionsResult.data || [];
    const routes = routesResult.data || [];
    
    console.log('📊 [LEADERBOARD DATA] Raw data counts:', { 
      completions: completions.length, 
      routes: routes.length 
    });
    
    // Create route lookup map for efficient joining
    const routeMap = new Map();
    routes.forEach(route => {
      routeMap.set(route.id, { grade: route.grade, style: route.style });
    });
    
    console.log('📊 [LEADERBOARD DATA] Route map created with', routeMap.size, 'routes');
    
    // Manual join with error handling
    const joinedData = completions
      .map(completion => {
        const route = routeMap.get(completion.route_id);
        if (!route) {
          console.warn(`⚠️ [LEADERBOARD WARNING] Route not found for completion:`, completion);
          return null;
        }
        
        return {
          user_id: completion.user_id,
          route_id: completion.route_id,
          routes: route
        };
      })
      .filter(Boolean); // Remove null entries
    
    console.log('✅ [LEADERBOARD SUCCESS] Manual join completed:', joinedData.length, 'valid records');
    console.log('📊 [LEADERBOARD DATA] Sample joined data:', joinedData.slice(0, 3));
    
    return joinedData;
    
  } catch (error) {
    console.error('❌ [LEADERBOARD CRITICAL] Critical error in fetchClimbCompletions:', error);
    throw error;
  }
};

export const fetchGearData = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Fetching gear data...');
  try {
    const { data, error } = await supabase
      .from('user_equipment')
      .select('user_id, quantity');
    
    if (error) {
      console.error('❌ [LEADERBOARD ERROR] Error fetching gear:', error);
      throw error;
    }
    
    console.log('✅ [LEADERBOARD SUCCESS] Gear data fetched:', data?.length);
    console.log('📊 [LEADERBOARD DATA] Gear sample:', data?.slice(0, 3));
    return data || [];
  } catch (error) {
    console.error('❌ [LEADERBOARD CRITICAL] Critical error in fetchGearData:', error);
    throw error;
  }
};

export const fetchEventData = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Fetching comprehensive event attendance data for Event Enthusiast leaderboard...');
  
  try {
    // Fetch both current and archived attendance data with better error handling
    const [currentResult, archivedResult] = await Promise.allSettled([
      supabase
        .from('event_attendance_approvals')
        .select('user_id, status, event_id, approved_at')
        .eq('status', 'approved'),
      supabase
        .from('archived_event_attendance')
        .select('user_id, event_id, attended_at')
    ]);

    // Handle current attendance data
    let currentData: any[] = [];
    if (currentResult.status === 'fulfilled' && !currentResult.value.error) {
      currentData = currentResult.value.data || [];
    } else if (currentResult.status === 'rejected' || currentResult.value.error) {
      console.error('❌ [LEADERBOARD ERROR] Error fetching current event attendance:', 
        currentResult.status === 'rejected' ? currentResult.reason : currentResult.value.error);
      throw new Error('Failed to fetch current attendance data');
    }

    // Handle archived attendance data (more lenient - it's OK if this fails)
    let archivedData: any[] = [];
    if (archivedResult.status === 'fulfilled' && !archivedResult.value.error) {
      archivedData = archivedResult.value.data || [];
    } else {
      console.warn('⚠️ [LEADERBOARD WARNING] Could not fetch archived attendance data:', 
        archivedResult.status === 'rejected' ? archivedResult.reason : archivedResult.value.error);
    }

    // Combine current and archived data, ensuring we don't double-count
    const currentDataMap = new Map();
    const combinedData = [];

    // Add current attendance data
    for (const record of currentData) {
      const key = `${record.user_id}-${record.event_id}`;
      currentDataMap.set(key, true);
      combinedData.push({
        user_id: record.user_id,
        status: 'approved' as const,
        event_id: record.event_id,
        approved_at: record.approved_at
      });
    }

    // Add archived data only if not already present in current data
    for (const record of archivedData) {
      const key = `${record.user_id}-${record.event_id}`;
      if (!currentDataMap.has(key)) {
        combinedData.push({
          user_id: record.user_id,
          status: 'approved' as const,
          event_id: record.event_id,
          approved_at: record.attended_at
        });
      }
    }
    
    console.log('✅ [LEADERBOARD SUCCESS] Combined event attendance data fetched:', combinedData.length, 'approved records');
    console.log('📊 [LEADERBOARD DATA] Current records:', currentData.length);
    console.log('📊 [LEADERBOARD DATA] Archived records:', archivedData.length);
    console.log('📊 [LEADERBOARD DATA] Total unique records:', combinedData.length);
    
    // Log user breakdown for debugging - show user IDs and counts
    const userCounts = combinedData.reduce((acc: any, record) => {
      acc[record.user_id] = (acc[record.user_id] || 0) + 1;
      return acc;
    }, {});
    console.log('📊 [LEADERBOARD DATA] User event counts by ID:', userCounts);
    console.log('📊 [LEADERBOARD DATA] Users with events:', Object.keys(userCounts));
    
    return combinedData;
    
  } catch (error) {
    console.error('❌ [LEADERBOARD CRITICAL] Critical error in fetchEventData:', error);
    throw error;
  }
};
