
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

export const fetchPublicProfiles = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Starting fetchPublicProfiles...');
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name')
      .order('full_name');
    
    if (error) {
      console.error('❌ [LEADERBOARD ERROR] Error fetching profiles:', error);
      throw error;
    }
    
    console.log('✅ [LEADERBOARD SUCCESS] Profiles fetched:', data?.length);
    return data || [];
    
  } catch (error) {
    console.error('❌ [LEADERBOARD CRITICAL] Critical error in fetchPublicProfiles:', error);
    throw error;
  }
};

export const fetchClimbCompletions = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Starting fetchClimbCompletions...');
  
  try {
    // Fetch completions and routes separately for better error handling
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

    // Manual join with better error handling
    const joinedData = completionsResult.data?.map(completion => {
      const route = routesResult.data?.find(r => r.id === completion.route_id);
      return {
        user_id: completion.user_id,
        route_id: completion.route_id,
        routes: route ? { grade: route.grade, style: route.style } : null
      };
    }).filter(item => item.routes !== null) || [];
    
    console.log('✅ [LEADERBOARD SUCCESS] Completions fetched and joined:', joinedData.length);
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
    return data || [];
    
  } catch (error) {
    console.error('❌ [LEADERBOARD CRITICAL] Critical error in fetchGearData:', error);
    throw error;
  }
};

export const fetchEventData = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Fetching event attendance data...');
  
  try {
    const { data, error } = await supabase
      .from('event_attendance_approvals')
      .select('user_id, status, event_id, approved_at')
      .eq('status', 'approved');

    if (error) {
      console.error('❌ [LEADERBOARD ERROR] Error fetching event attendance:', error);
      throw error;
    }
    
    console.log('✅ [LEADERBOARD SUCCESS] Event attendance data fetched:', data?.length);
    return data || [];
    
  } catch (error) {
    console.error('❌ [LEADERBOARD CRITICAL] Critical error in fetchEventData:', error);
    throw error;
  }
};
