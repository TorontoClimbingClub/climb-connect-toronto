import { supabase } from '@/integrations/supabase/client';

export class GroupService {
  static async getGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        id,
        name,
        description,
        avatar_url,
        created_by,
        created_at,
        profiles!created_by (display_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getGroupMembers(groupId: string) {
    const { data, error } = await supabase
      .from('group_members')
      .select('user_id, profiles(display_name, avatar_url)')
      .eq('group_id', groupId);

    if (error) throw error;
    return data;
  }

  static async joinGroup(groupId: string, userId: string) {
    const { error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: userId });

    if (error) throw error;
  }

  static async leaveGroup(groupId: string, userId: string) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}