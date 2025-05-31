
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ActiveSessionData } from '@/types/training';

export function useStartSession(setLocalSession: (session: ActiveSessionData) => void) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startSessionMutation = useMutation({
    mutationFn: async (initialData: Partial<ActiveSessionData>) => {
      const { data: session, error } = await supabase
        .from('training_sessions')
        .insert({
          session_date: new Date().toISOString().split('T')[0],
          start_time: new Date().toISOString(),
          end_time: null,
          session_goal: initialData.sessionGoal,
          custom_goal: initialData.customGoal,
          warm_up_done: false,
          felt_after_session: null,
          felt_tired_at_end: false,
          would_change_next_time: null,
          partner_count: 0,
          total_climbs: 0,
          max_grade_climbed: null,
          new_techniques_tried: false,
          gear_used: false,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      const newSession: ActiveSessionData = {
        sessionDate: new Date().toISOString().split('T')[0],
        sessionGoal: initialData.sessionGoal,
        customGoal: initialData.customGoal,
        warmUpDone: false,
        feltTiredAtEnd: false,
        newTechniquesTried: false,
        gearUsed: false,
        climbs: [],
        techniques: [],
        gear: []
      };

      setLocalSession(newSession);
      return { session, localSession: newSession };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
      toast({
        title: "Session Started",
        description: "Your training session has begun. Happy climbing!",
      });
    },
    onError: (error) => {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start training session. Please try again.",
        variant: "destructive",
      });
    }
  });

  return startSessionMutation;
}
