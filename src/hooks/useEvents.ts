import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface EventWithStats {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  max_participants: number;
  created_by: string;
  created_at: string;
  participant_count: number;
  is_participant: boolean;
  profiles: {
    display_name: string;
  };
}

export function useEvents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: async () => {
      const data = await ApiService.getEvents();
      
      // Get participant counts and check if current user is participating
      const eventsWithStats = await Promise.all(
        (data || []).map(async (event) => {
          const { count } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          const { data: participation } = await supabase
            .from('event_participants')
            .select('user_id')
            .eq('event_id', event.id)
            .eq('user_id', user?.id)
            .single();

          return {
            ...event,
            participant_count: count || 0,
            is_participant: !!participation,
          };
        })
      );

      return eventsWithStats;
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });

  const joinEventMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      ApiService.joinEvent(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({ title: "Joined event successfully!" });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to join event.";
      if (error?.code === '23505') {
        errorMessage = "You're already participating in this event.";
      }
      toast({ title: errorMessage, variant: "destructive" });
    },
  });

  const leaveEventMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) =>
      ApiService.leaveEvent(eventId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({ title: "Left event successfully" });
    },
    onError: () => {
      toast({ title: "Failed to leave event", variant: "destructive" });
    },
  });

  const joinEvent = (eventId: string) => {
    if (!user) return;
    joinEventMutation.mutate({ eventId, userId: user.id });
  };

  const leaveEvent = (eventId: string) => {
    if (!user) return;
    leaveEventMutation.mutate({ eventId, userId: user.id });
  };

  const myEvents = events.filter(event => event.is_participant);
  const availableEvents = events.filter(event => !event.is_participant);

  return {
    events,
    myEvents,
    availableEvents,
    isLoading,
    error,
    joinEvent,
    leaveEvent,
    isJoining: joinEventMutation.isPending,
    isLeaving: leaveEventMutation.isPending,
  };
}