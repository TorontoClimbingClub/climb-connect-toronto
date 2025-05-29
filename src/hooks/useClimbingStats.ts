
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
        const { data, error } = await supabase.rpc('get_user_climbing_stats', {
          user_id_param: userId
        });

        if (error) throw error;

        if (data && data.length > 0) {
          setStats(data[0]);
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
