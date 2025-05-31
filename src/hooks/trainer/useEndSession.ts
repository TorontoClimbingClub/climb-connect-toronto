
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ActiveSessionData } from '@/types/training';

export function useEndSession(
  activeDbSession: any,
  localSession: ActiveSessionData | null,
  setLocalSession: (session: ActiveSessionData | null) => void
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const endSessionMutation = useMutation({
    mutationFn: async () => {
      if (!activeDbSession || !localSession) {
        throw new Error('No active session to end');
      }

      const totalClimbs = localSession.climbs.length;
      const maxGrade = localSession.climbs.reduce((max, climb) => {
        return climb.routeGrade > max ? climb.routeGrade : max;
      }, '');

      // Update the session in the database
      const { error: sessionError } = await supabase
        .from('training_sessions')
        .update({
          end_time: new Date().toISOString(),
          session_goal: localSession.sessionGoal,
          custom_goal: localSession.customGoal,
          warm_up_done: localSession.warmUpDone,
          felt_after_session: localSession.feltAfterSession,
          felt_tired_at_end: localSession.feltTiredAtEnd,
          would_change_next_time: localSession.wouldChangeNextTime,
          total_climbs: totalClimbs,
          max_grade_climbed: maxGrade || null,
          new_techniques_tried: localSession.newTechniquesTried,
          gear_used: localSession.gearUsed
        })
        .eq('id', activeDbSession.id);

      if (sessionError) throw sessionError;

      // Insert climbs
      if (localSession.climbs.length > 0) {
        const climbsData = localSession.climbs.map(climb => ({
          session_id: activeDbSession.id,
          route_grade: climb.routeGrade,
          climbing_style: climb.climbingStyle,
          attempts_made: climb.attemptsMade,
          completed: climb.completed,
          falls_count: climb.fallsCount,
          rest_time_minutes: climb.restTimeMinutes || null,
          is_hardest_climb: climb.isHardestClimb,
          notes: climb.notes || null
        }));

        const { error: climbsError } = await supabase
          .from('session_climbs')
          .insert(climbsData);

        if (climbsError) throw climbsError;
      }

      // Insert techniques
      if (localSession.techniques.length > 0) {
        const techniquesData = localSession.techniques.map(technique => ({
          session_id: activeDbSession.id,
          technique_name: technique,
          success_level: 'Attempted'
        }));

        const { error: techniquesError } = await supabase
          .from('session_techniques')
          .insert(techniquesData);

        if (techniquesError) throw techniquesError;
      }

      // Insert gear
      if (localSession.gear.length > 0) {
        const gearData = localSession.gear.map(item => ({
          session_id: activeDbSession.id,
          gear_name: item,
          gear_type: 'Equipment'
        }));

        const { error: gearError } = await supabase
          .from('session_gear')
          .insert(gearData);

        if (gearError) throw gearError;
      }

      setLocalSession(null);
      return activeDbSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-session'] });
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
      toast({
        title: "Session Completed",
        description: "Your training session has been saved successfully!",
      });
    },
    onError: (error) => {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end training session. Please try again.",
        variant: "destructive",
      });
    }
  });

  return endSessionMutation;
}
