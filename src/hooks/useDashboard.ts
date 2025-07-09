import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalEvents: number;
  totalGroups: number;
  totalMessages: number;
  activeUsers: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  location: string;
  event_date: string;
  participant_count: number;
  max_participants?: number;
  is_participant: boolean;
}

export interface ActiveChat {
  id: string;
  name: string;
  type: 'event' | 'group' | 'club';
  messageCount: number;
  lastActivity: string;
  href: string;
}

export function useDashboard() {
  const { user } = useAuth();

  const {
    data: stats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => ApiService.getDashboardStats(),
    enabled: !!user,
    staleTime: 60000, // 1 minute
  });

  const {
    data: upcomingEvents = [],
    isLoading: eventsLoading
  } = useQuery({
    queryKey: ['dashboard-upcoming-events', user?.id],
    queryFn: async () => {
      const { data: events } = await supabase
        .from('events')
        .select(`
          id,
          title,
          location,
          event_date,
          max_participants,
          event_participants(count)
        `)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(10);

      if (!events) return [];

      // Check participation status for each event
      const eventsWithParticipation = await Promise.all(
        events.map(async (event) => {
          const { data: participation } = await supabase
            .from('event_participants')
            .select('user_id')
            .eq('event_id', event.id)
            .eq('user_id', user?.id)
            .single();

          return {
            id: event.id,
            title: event.title,
            location: event.location,
            event_date: event.event_date,
            participant_count: Array.isArray(event.event_participants) ? event.event_participants.length : 0,
            max_participants: event.max_participants,
            is_participant: !!participation
          };
        })
      );

      return eventsWithParticipation;
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });

  const {
    data: activeChats = [],
    isLoading: chatsLoading
  } = useQuery({
    queryKey: ['dashboard-active-chats'],
    queryFn: async () => {
      const chats: ActiveChat[] = [];

      // Get event chats with message counts
      const { data: eventChats } = await supabase
        .from('events')
        .select(`
          id,
          title,
          event_messages(count),
          event_messages!inner(created_at)
        `)
        .order('event_messages(created_at)', { ascending: false })
        .limit(10);

      if (eventChats) {
        eventChats.forEach(event => {
          const messageCount = Array.isArray(event.event_messages) ? event.event_messages.length : 0;
          if (messageCount > 0) {
            chats.push({
              id: event.id,
              name: event.title,
              type: 'event',
              messageCount,
              lastActivity: event.event_messages[0]?.created_at || '',
              href: `/events/${event.id}/chat`
            });
          }
        });
      }

      // Get group chats with message counts
      const { data: groupChats } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          group_messages(count),
          group_messages!inner(created_at)
        `)
        .order('group_messages(created_at)', { ascending: false })
        .limit(10);

      if (groupChats) {
        groupChats.forEach(group => {
          const messageCount = Array.isArray(group.group_messages) ? group.group_messages.length : 0;
          if (messageCount > 0) {
            chats.push({
              id: group.id,
              name: group.name,
              type: 'group',
              messageCount,
              lastActivity: group.group_messages[0]?.created_at || '',
              href: `/groups/${group.id}/chat`
            });
          }
        });
      }

      // Get club chat message count
      const { count: clubMessageCount } = await supabase
        .from('club_messages')
        .select('id', { count: 'exact', head: true });

      if (clubMessageCount && clubMessageCount > 0) {
        const { data: latestClubMessage } = await supabase
          .from('club_messages')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        chats.push({
          id: 'club-talk',
          name: 'Club Talk',
          type: 'club',
          messageCount: clubMessageCount,
          lastActivity: latestClubMessage?.created_at || '',
          href: '/club-talk'
        });
      }

      // Sort by message count and take top 5
      chats.sort((a, b) => b.messageCount - a.messageCount);
      return chats.slice(0, 5);
    },
    enabled: !!user,
    staleTime: 60000, // 1 minute
  });

  return {
    stats,
    upcomingEvents,
    activeChats,
    isLoading: statsLoading || eventsLoading || chatsLoading,
  };
}