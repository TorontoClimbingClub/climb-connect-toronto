
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

export const fetchPublicProfiles = async () => {
  console.log('Fetching public profiles...');
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('allow_profile_viewing', true);
  
  if (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
  
  console.log('Profiles fetched:', data?.length);
  return data || [];
};

export const fetchClimbCompletions = async () => {
  console.log('Fetching climb completions...');
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
    console.error('Error fetching completions:', error);
    throw error;
  }
  
  console.log('Completions fetched:', data?.length);
  return data || [];
};

export const fetchGearData = async () => {
  console.log('Fetching gear data...');
  const { data, error } = await supabase
    .from('user_equipment')
    .select('user_id, quantity');
  
  if (error) {
    console.error('Error fetching gear:', error);
    throw error;
  }
  
  console.log('Gear data fetched:', data?.length);
  return data || [];
};

export const fetchEventData = async () => {
  console.log('Fetching event attendance data for Event Enthusiast leaderboard...');
  const { data, error } = await supabase
    .from('event_attendance_approvals')
    .select('user_id, status, event_id, approved_at')
    .eq('status', 'approved');
  
  if (error) {
    console.error('Error fetching event attendance data:', error);
    throw error;
  }
  
  console.log('Event attendance data fetched:', data?.length, 'approved records');
  
  return data || [];
};
