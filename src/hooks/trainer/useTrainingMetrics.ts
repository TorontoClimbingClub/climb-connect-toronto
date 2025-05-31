
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useTrainingMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['training-metrics'],
    queryFn: async () => {
      // Get all training sessions for current user
      const { data: sessions, error } = await supabase
        .from('training_sessions')
        .select(`
          *,
          session_climbs(*)
        `)
        .order('session_date', { ascending: false });

      if (error) throw error;

      if (!sessions || sessions.length === 0) {
        return {
          totalSessions: 0,
          sessionsThisMonth: 0,
          hardestGrade: null,
          totalClimbs: 0,
          avgClimbsPerSession: 0,
          avgSessionDuration: null
        };
      }

      // Calculate metrics
      const totalSessions = sessions.length;
      
      // Sessions this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const sessionsThisMonth = sessions.filter(session => {
        const sessionDate = new Date(session.session_date);
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
      }).length;

      // Hardest grade (simplified - would need proper grade comparison logic)
      const hardestGrade = sessions.reduce((max, session) => {
        if (!session.max_grade_climbed) return max;
        return session.max_grade_climbed > max ? session.max_grade_climbed : max;
      }, '');

      // Total climbs
      const totalClimbs = sessions.reduce((sum, session) => sum + (session.total_climbs || 0), 0);
      
      // Average climbs per session
      const avgClimbsPerSession = totalSessions > 0 ? totalClimbs / totalSessions : 0;

      // Average session duration
      const sessionsWithDuration = sessions.filter(s => s.start_time && s.end_time);
      let avgDurationMinutes = 0;
      
      if (sessionsWithDuration.length > 0) {
        const totalMinutes = sessionsWithDuration.reduce((sum, session) => {
          const start = new Date(session.start_time);
          const end = new Date(session.end_time);
          const duration = (end.getTime() - start.getTime()) / (1000 * 60); // minutes
          return sum + duration;
        }, 0);
        
        avgDurationMinutes = totalMinutes / sessionsWithDuration.length;
      }

      const avgSessionDuration = avgDurationMinutes > 0 
        ? `${Math.floor(avgDurationMinutes / 60)}:${String(Math.round(avgDurationMinutes % 60)).padStart(2, '0')}`
        : null;

      return {
        totalSessions,
        sessionsThisMonth,
        hardestGrade: hardestGrade || null,
        totalClimbs,
        avgClimbsPerSession,
        avgSessionDuration
      };
    }
  });

  return { metrics, isLoading };
}
