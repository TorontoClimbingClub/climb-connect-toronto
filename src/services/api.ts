import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type Event = Tables['events']['Row'];
type Group = Tables['groups']['Row'];
type Profile = Tables['profiles']['Row'];

export class ApiService {
  // Events
  static async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        location,
        event_date,
        max_participants,
        created_by,
        created_at,
        profiles!created_by (display_name)
      `)
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async getEventParticipants(eventId: string) {
    const { data, error } = await supabase
      .from('event_participants')
      .select('user_id, profiles(display_name, avatar_url)')
      .eq('event_id', eventId);

    if (error) throw error;
    return data;
  }

  static async joinEvent(eventId: string, userId: string) {
    const { error } = await supabase
      .from('event_participants')
      .insert({ event_id: eventId, user_id: userId });

    if (error) throw error;
  }

  static async leaveEvent(eventId: string, userId: string) {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Groups
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

  // Messages
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

  // Statistics
  static async getDashboardStats() {
    const [eventsCount, groupsCount, messagesCount, usersCount] = await Promise.all([
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('groups').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true })
    ]);

    return {
      totalEvents: eventsCount.count || 0,
      totalGroups: groupsCount.count || 0,
      totalMessages: messagesCount.count || 0,
      activeUsers: usersCount.count || 0
    };
  }
}