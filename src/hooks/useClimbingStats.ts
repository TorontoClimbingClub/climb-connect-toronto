
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClimbingStats {
  total_completions: number;
  trad_completions: number;
  sport_completions: number;
  top_rope_completions: number;
  hardest_grade: string | null;
  recent_completions: number;
}

export const useClimbingStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<ClimbingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Get all completions for the user with route information
        const { data: completions, error } = await supabase
          .from('climb_completions')
          .select(`
            *,
            routes!inner(*)
          `)
          .eq('user_id', userId);

        if (error) throw error;

        if (completions && completions.length > 0) {
          // Calculate stats from the completions data
          const now = new Date();
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

          const totalCompletions = completions.length;
          const tradCompletions = completions.filter(c => c.routes.style === 'Trad').length;
          const sportCompletions = completions.filter(c => c.routes.style === 'Sport').length;
          const topRopeCompletions = completions.filter(c => c.routes.style === 'Top Rope').length;
          const recentCompletions = completions.filter(c => 
            new Date(c.completed_at) >= thirtyDaysAgo
          ).length;

          // Find hardest grade (simplified - just get the highest grade string)
          const grades = completions.map(c => c.routes.grade).sort();
          const hardestGrade = grades.length > 0 ? grades[grades.length - 1] : null;

          setStats({
            total_completions: totalCompletions,
            trad_completions: tradCompletions,
            sport_completions: sportCompletions,
            top_rope_completions: topRopeCompletions,
            hardest_grade: hardestGrade,
            recent_completions: recentCompletions
          });
        } else {
          setStats({
            total_completions: 0,
            trad_completions: 0,
            sport_completions: 0,
            top_rope_completions: 0,
            hardest_grade: null,
            recent_completions: 0
          });
        }
      } catch (error: any) {
        console.error('Error fetching climbing stats:', error);
        toast({
          title: "Error",
          description: "Failed to load climbing statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, toast]);

  return { stats, loading };
};
