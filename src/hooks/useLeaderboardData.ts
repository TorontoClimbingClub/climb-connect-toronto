
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

export const fetchPublicProfiles = async () => {
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, allow_profile_viewing')
    .eq('allow_profile_viewing', true);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  console.log('Profiles data:', profilesData);
  return profilesData || [];
};

export const fetchClimbCompletions = async () => {
  const { data: completionsData, error: completionsError } = await supabase
    .from('climb_completions')
    .select('user_id, route_id');

  if (completionsError) {
    console.error('Error fetching completions:', completionsError);
    throw completionsError;
  }

  console.log('Completions data:', completionsData);
  return completionsData || [];
};

export const fetchGearData = async () => {
  const { data: gearData, error: gearError } = await supabase
    .from('user_equipment')
    .select('user_id, quantity');

  if (gearError) {
    console.error('Error fetching gear data:', gearError);
    throw gearError;
  }

  console.log('Gear data:', gearData);
  return gearData || [];
};

export const fetchEventData = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: eventData, error: eventError } = await supabase
    .from('event_participants')
    .select(`
      user_id,
      events!inner(date)
    `)
    .lt('events.date', today);

  if (eventError) {
    console.error('Error fetching event data:', eventError);
    throw eventError;
  }

  console.log('Event data:', eventData);
  return eventData || [];
};
