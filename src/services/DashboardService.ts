import { supabase } from '@/integrations/supabase/client';

export class DashboardService {
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