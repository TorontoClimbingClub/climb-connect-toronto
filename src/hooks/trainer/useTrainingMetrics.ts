
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
          completionRate: null
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

      // Completion rate
      const allClimbs = sessions.flatMap(session => session.session_climbs || []);
      const completedClimbs = allClimbs.filter(climb => climb.completed);
      const completionRate = allClimbs.length > 0 
        ? `${Math.round((completedClimbs.length / allClimbs.length) * 100)}%`
        : null;

      return {
        totalSessions,
        sessionsThisMonth,
        hardestGrade: hardestGrade || null,
        totalClimbs,
        avgClimbsPerSession,
        completionRate
      };
    }
  });

  return { metrics, isLoading };
}
