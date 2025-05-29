
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

export const fetchPublicProfiles = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Starting fetchPublicProfiles...');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('allow_profile_viewing', true);
  
  if (error) {
    console.error('❌ [LEADERBOARD ERROR] Error fetching profiles:', error);
    throw error;
  }
  
  console.log('✅ [LEADERBOARD SUCCESS] Profiles fetched:', data?.length);
  console.log('📊 [LEADERBOARD DATA] Profile sample:', data?.slice(0, 2));
  return data || [];
};

export const fetchClimbCompletions = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Starting fetchClimbCompletions...');
  
  // First, let's check if the tables exist and what relationships are available
  console.log('🔍 [LEADERBOARD DEBUG] Checking climb_completions table structure...');
  
  try {
    // Try a simple query first to see what data exists
    const { data: completionsSimple, error: simpleError } = await supabase
      .from('climb_completions')
      .select('*')
      .limit(5);
    
    console.log('📊 [LEADERBOARD DATA] climb_completions sample:', completionsSimple);
    
    if (simpleError) {
      console.error('❌ [LEADERBOARD ERROR] Simple climb_completions query failed:', simpleError);
    }

    // Check routes table
    const { data: routesSimple, error: routesError } = await supabase
      .from('routes')
      .select('*')
      .limit(5);
    
    console.log('📊 [LEADERBOARD DATA] routes sample:', routesSimple);
    
    if (routesError) {
      console.error('❌ [LEADERBOARD ERROR] Routes query failed:', routesError);
    }

    // Now try the join - this is where the error occurs
    console.log('🔍 [LEADERBOARD DEBUG] Attempting climb_completions with routes join...');
    const { data, error } = await supabase
      .from('climb_completions')
      .select(`
        user_id,
        route_id,
        routes!inner(
          grade,
          style
        )
      `);
    
    if (error) {
      console.error('❌ [LEADERBOARD ERROR] Error fetching completions with routes join:', error);
      console.error('❌ [LEADERBOARD ERROR] Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Try alternative approach - fetch separately and join in code
      console.log('🔄 [LEADERBOARD FALLBACK] Trying manual join approach...');
      
      const { data: completions, error: completionsError } = await supabase
        .from('climb_completions')
        .select('user_id, route_id');
      
      const { data: routes, error: routesError } = await supabase
        .from('routes')
        .select('id, grade, style');
      
      if (completionsError || routesError) {
        console.error('❌ [LEADERBOARD ERROR] Fallback queries failed:', { completionsError, routesError });
        throw error; // Throw original error
      }
      
      // Manual join
      const joinedData = completions?.map(completion => {
        const route = routes?.find(r => r.id === completion.route_id);
        return {
          user_id: completion.user_id,
          route_id: completion.route_id,
          routes: route ? { grade: route.grade, style: route.style } : null
        };
      }).filter(item => item.routes !== null);
      
      console.log('✅ [LEADERBOARD SUCCESS] Manual join completed:', joinedData?.length, 'records');
      return joinedData || [];
    }
    
    console.log('✅ [LEADERBOARD SUCCESS] Completions fetched with join:', data?.length);
    return data || [];
    
  } catch (err) {
    console.error('❌ [LEADERBOARD CRITICAL] Unexpected error in fetchClimbCompletions:', err);
    throw err;
  }
};

export const fetchGearData = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Fetching gear data...');
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
};

export const fetchEventData = async () => {
  console.log('🔍 [LEADERBOARD DEBUG] Fetching event attendance data for Event Enthusiast leaderboard...');
  
  // Fetch both current and archived attendance data
  const [currentAttendance, archivedAttendance] = await Promise.all([
    supabase
      .from('event_attendance_approvals')
      .select('user_id, status, event_id, approved_at')
      .eq('status', 'approved'),
    // Use type assertion for the new table since it's not in generated types yet
    (supabase as any)
      .from('archived_event_attendance')
      .select('user_id, event_id, attended_at')
  ]);

  if (currentAttendance.error) {
    console.error('❌ [LEADERBOARD ERROR] Error fetching current event attendance data:', currentAttendance.error);
    throw currentAttendance.error;
  }

  // Handle archived attendance gracefully (might be empty if no events have been archived yet)
  const archivedData = archivedAttendance.error ? [] : (archivedAttendance.data || []);
  
  if (archivedAttendance.error) {
    console.warn('⚠️ [LEADERBOARD WARNING] Could not fetch archived attendance data:', archivedAttendance.error);
  }

  // Combine current and archived data
  const combinedData = [
    ...(currentAttendance.data || []).map((record: any) => ({
      user_id: record.user_id,
      status: 'approved' as const,
      event_id: record.event_id,
      approved_at: record.approved_at
    })),
    ...archivedData.map((record: any) => ({
      user_id: record.user_id,
      status: 'approved' as const,
      event_id: record.event_id,
      approved_at: record.attended_at
    }))
  ];
  
  console.log('✅ [LEADERBOARD SUCCESS] Combined event attendance data fetched:', combinedData.length, 'approved records');
  console.log('📊 [LEADERBOARD DATA] Current records:', currentAttendance.data?.length);
  console.log('📊 [LEADERBOARD DATA] Archived records:', archivedData.length);
  
  return combinedData;
};
