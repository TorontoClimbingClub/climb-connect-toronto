import { supabase } from '@/integrations/supabase/client';

export class MessageService {
  static async getEventMessages(eventId: string) {
    const { data, error } = await supabase
      .from('event_messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles(display_name, avatar_url)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getGroupMessages(groupId: string) {
    const { data, error } = await supabase
      .from('group_messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles(display_name, avatar_url)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getClubMessages() {
    const { data, error } = await supabase
      .from('club_messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles(display_name, avatar_url)
      `)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getBelayGroupMessages(belayGroupId: string) {
    const { data, error } = await supabase
      .from('belay_group_messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles(display_name, avatar_url)
      `)
      .eq('belay_group_id', belayGroupId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
}