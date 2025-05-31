
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ActiveSessionData {
  sessionDate: string;
  sessionGoal?: string;
  customGoal?: string;
  warmUpDone: boolean;
  feltAfterSession?: string;
  feltTiredAtEnd: boolean;
  wouldChangeNextTime?: string;
  newTechniquesTried: boolean;
  gearUsed: boolean;
  climbs: any[];
  techniques: string[];
  gear: string[];
}

export function useActiveSession() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [localSession, setLocalSession] = useState<ActiveSessionData | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('activeTrainingSession');
    if (stored) {
      try {
        setLocalSession(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem('activeTrainingSession');
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (localSession) {
      localStorage.setItem('activeTrainingSession', JSON.stringify(localSession));
    } else {
      localStorage.removeItem('activeTrainingSession');
    }
  }, [localSession]);

  const { data: activeDbSession, isLoading: isLoadingSession } = useQuery({
    queryKey: ['active-session'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_sessions')
        .select('*')
        .is('end_time', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

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

  const updateLocalSession = (updates: Partial<ActiveSessionData>) => {
    if (localSession) {
      setLocalSession({ ...localSession, ...updates });
    }
  };

  // Determine if there's an active session - both DB session and local session must exist
  const hasActiveSession = !!(activeDbSession && localSession && !isLoadingSession);

  return {
    activeSession: localSession,
    hasActiveSession,
    startSession: startSessionMutation.mutate,
    endSession: endSessionMutation.mutate,
    updateLocalSession,
    isStarting: startSessionMutation.isPending,
    isEnding: endSessionMutation.isPending,
    isLoadingSession
  };
}
