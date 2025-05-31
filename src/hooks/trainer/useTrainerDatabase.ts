
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { SimplifiedSession, WorkoutMetrics } from '@/types/training';

export function useTrainerDatabase() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const saveSessionToDatabase = async (session: SimplifiedSession) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Save main session
      const { data: sessionData, error: sessionError } = await supabase
        .from('trainer_sessions')
        .insert({
          id: session.id,
          user_id: user.id,
          start_time: session.startTime,
          end_time: session.endTime,
          sii: session.sii,
          recovery_feeling: session.recoveryFeeling,
          rest_days_before_session: session.restDaysBeforeSession,
          max_hang_time: session.workoutMetrics?.maxHangTime || 0,
          max_pull_ups: session.workoutMetrics?.maxPullUps || 0,
          max_lockoff: session.workoutMetrics?.maxLockoff || 0
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error saving session:', sessionError);
        return;
      }

      // Save climbs
      if (session.climbs.length > 0) {
        const climbsData = session.climbs.map(climb => ({
          id: climb.id,
          session_id: session.id,
          user_id: user.id,
          grade: climb.grade,
          duration_minutes: climb.durationMinutes,
          number_of_takes: climb.numberOfTakes,
          created_at: climb.createdAt
        }));

        const { error: climbsError } = await supabase
          .from('trainer_climbs')
          .insert(climbsData);

        if (climbsError) {
          console.error('Error saving climbs:', climbsError);
        }
      }

      console.log('Session saved to database successfully');
    } catch (error) {
      console.error('Database save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionsFromDatabase = async (): Promise<SimplifiedSession[]> => {
    if (!user) return [];

    try {
      setIsLoading(true);
      
      const { data: sessions, error: sessionError } = await supabase
        .from('trainer_sessions')
        .select(`
          *,
          trainer_climbs (*)
        `)
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (sessionError) {
        console.error('Error loading sessions:', sessionError);
        return [];
      }

      // Transform database data to SimplifiedSession format
      const transformedSessions: SimplifiedSession[] = sessions.map(session => ({
        id: session.id,
        startTime: session.start_time,
        endTime: session.end_time,
        climbs: session.trainer_climbs.map((climb: any) => ({
          id: climb.id,
          grade: climb.grade,
          durationMinutes: climb.duration_minutes,
          numberOfTakes: climb.number_of_takes,
          createdAt: climb.created_at
        })),
        workoutMetrics: {
          maxHangTime: session.max_hang_time,
          maxPullUps: session.max_pull_ups,
          maxLockoff: session.max_lockoff
        },
        sii: session.sii,
        recoveryFeeling: session.recovery_feeling,
        restDaysBeforeSession: session.rest_days_before_session
      }));

      return transformedSessions;
    } catch (error) {
      console.error('Database load error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSessionFromDatabase = async (sessionId: string) => {
    if (!user) return;

    try {
      // Delete climbs first (foreign key constraint)
      await supabase
        .from('trainer_climbs')
        .delete()
        .eq('session_id', sessionId);

      // Delete session
      const { error } = await supabase
        .from('trainer_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting session:', error);
      }
    } catch (error) {
      console.error('Database delete error:', error);
    }
  };

  return {
    saveSessionToDatabase,
    loadSessionsFromDatabase,
    deleteSessionFromDatabase,
    isLoading
  };
}
