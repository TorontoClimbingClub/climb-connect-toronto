import { supabase } from '@/integrations/supabase/client';
import { BelayGroup } from '@/types/belayGroup';

export class BelayService {
  static async getBelayGroups() {
    const { data: groups, error: groupsError } = await supabase
      .from('belay_groups')
      .select('*')
      .gte('session_date', new Date().toISOString())
      .order('session_date', { ascending: true });

    if (groupsError) throw groupsError;
    return groups || [];
  }

  static async getBelayGroupWithDetails(groupId: string) {
    // Get basic group info
    const { data: group, error: groupError } = await supabase
      .from('belay_groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (groupError) throw groupError;
    if (!group) throw new Error('Belay group not found');

    // Get creator info
    const { data: creator } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', group.creator_id)
      .single();

    // Get gym info
    const { data: gym } = await supabase
      .from('groups')
      .select('name')
      .eq('id', group.gym_id)
      .single();

    // Get participant count
    const { count: participantCount } = await supabase
      .from('belay_group_participants')
      .select('*', { count: 'exact', head: true })
      .eq('belay_group_id', group.id);

    return {
      ...group,
      creator,
      gym,
      participant_count: participantCount || 0
    };
  }

  static async joinBelayGroup(groupId: string, userId: string) {
    const { error } = await supabase
      .from('belay_group_participants')
      .insert([
        {
          belay_group_id: groupId,
          user_id: userId,
        },
      ]);

    if (error) throw error;
  }

  static async leaveBelayGroup(groupId: string, userId: string) {
    const { error } = await supabase
      .from('belay_group_participants')
      .delete()
      .eq('belay_group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  static async deleteBelayGroup(groupId: string, userId: string) {
    // Get group info first
    const group = await this.getBelayGroupWithDetails(groupId);
    
    // Check if user is the creator
    if (group.creator_id !== userId) {
      throw new Error('Only the group creator can delete the group.');
    }
    
    // Check if there's only one participant (the creator)
    if (group.participant_count && group.participant_count > 1) {
      throw new Error('You can only delete a group when you are the only participant.');
    }
    
    // Delete participants first (should just be the creator)
    const { error: participantsError } = await supabase
      .from('belay_group_participants')
      .delete()
      .eq('belay_group_id', groupId);
    
    if (participantsError) throw participantsError;
    
    // Delete any belay group messages
    const { error: messagesError } = await supabase
      .from('belay_group_messages')
      .delete()
      .eq('belay_group_id', groupId);
    
    if (messagesError) throw messagesError;
    
    // Delete the group itself
    const { error: groupError } = await supabase
      .from('belay_groups')
      .delete()
      .eq('id', groupId);
    
    if (groupError) throw groupError;
  }

  static async getBelayGroupParticipants(groupId: string) {
    const { data, error } = await supabase
      .from('belay_group_participants')
      .select('user_id, profiles(display_name, avatar_url)')
      .eq('belay_group_id', groupId);

    if (error) throw error;
    return data;
  }
}