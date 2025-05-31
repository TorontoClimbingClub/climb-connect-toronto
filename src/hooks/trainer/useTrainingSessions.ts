
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateSessionData {
  sessionDate: string;
  startTime: string;
  endTime?: string;
  sessionGoal?: string;
  customGoal?: string;
  warmUpDone: boolean;
  feltAfterSession?: string;
  feltTiredAtEnd: boolean;
  wouldChangeNextTime?: string;
  newTechniquesTried: boolean;
  gearUsed: boolean;
  totalClimbs: number;
  maxGradeClimbed?: string;
  climbs: any[];
  techniques: string[];
  gear: string[];
}

export function useTrainingSessions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['training-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_sessions')
        .select(`
          *,
          session_climbs(*),
          session_techniques(*),
          session_gear(*)
        `)
        .order('session_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: CreateSessionData) => {
      const { data: session, error: sessionError } = await supabase
        .from('training_sessions')
        .insert({
          session_date: sessionData.sessionDate,
          start_time: `${sessionData.sessionDate}T${sessionData.startTime}:00`,
          end_time: sessionData.endTime ? `${sessionData.sessionDate}T${sessionData.endTime}:00` : null,
          session_goal: sessionData.sessionGoal,
          custom_goal: sessionData.customGoal,
          warm_up_done: sessionData.warmUpDone,
          felt_after_session: sessionData.feltAfterSession,
          felt_tired_at_end: sessionData.feltTiredAtEnd,
          would_change_next_time: sessionData.wouldChangeNextTime,
          partner_count: 0, // Always set to 0 since we removed the field
          total_climbs: sessionData.totalClimbs,
          max_grade_climbed: sessionData.maxGradeClimbed,
          new_techniques_tried: sessionData.newTechniquesTried,
          gear_used: sessionData.gearUsed,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Insert climbs
      if (sessionData.climbs.length > 0) {
        const climbsData = sessionData.climbs.map(climb => ({
          session_id: session.id,
          route_grade: climb.routeGrade,
          climbing_style: climb.climbingStyle,
          climbing_type: climb.climbingType || null,
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
      if (sessionData.techniques.length > 0) {
        const techniquesData = sessionData.techniques.map(technique => ({
          session_id: session.id,
          technique_name: technique,
          success_level: 'Attempted'
        }));

        const { error: techniquesError } = await supabase
          .from('session_techniques')
          .insert(techniquesData);

        if (techniquesError) throw techniquesError;
      }

      // Insert gear
      if (sessionData.gear.length > 0) {
        const gearData = sessionData.gear.map(item => ({
          session_id: session.id,
          gear_name: item,
          gear_type: 'Equipment'
        }));

        const { error: gearError } = await supabase
          .from('session_gear')
          .insert(gearData);

        if (gearError) throw gearError;
      }

      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
      toast({
        title: "Success",
        description: "Training session saved successfully!",
      });
    },
    onError: (error) => {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to save training session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('training_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
      toast({
        title: "Success",
        description: "Training session deleted successfully!",
      });
    },
    onError: (error) => {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete training session. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    sessions,
    isLoading,
    createSession: createSessionMutation.mutate,
    isCreating: createSessionMutation.isPending,
    deleteSession: deleteSessionMutation.mutate,
    isDeleting: deleteSessionMutation.isPending
  };
}
