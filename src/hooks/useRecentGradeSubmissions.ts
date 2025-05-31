
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClimbingRoute } from '@/types/routes';

interface RecentGradeSubmission {
  id: string;
  route_id: string;
  submitted_grade: string;
  climbing_style: string;
  created_at: string;
  route: ClimbingRoute;
  user_name: string;
}

export const useRecentGradeSubmissions = (limit: number = 10) => {
  const [submissions, setSubmissions] = useState<RecentGradeSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSubmissions = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('route_grade_submissions')
          .select(`
            id,
            route_id,
            submitted_grade,
            climbing_style,
            created_at,
            user_id,
            routes!inner (
              id,
              name,
              grade,
              style,
              area,
              sector
            )
          `)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Get user profiles separately to avoid join issues
        const userIds = [...new Set(data?.map(item => item.user_id) || [])];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const profilesMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

        const transformedSubmissions: RecentGradeSubmission[] = (data || []).map(item => ({
          id: item.id,
          route_id: item.route_id,
          submitted_grade: item.submitted_grade,
          climbing_style: item.climbing_style,
          created_at: item.created_at,
          route: {
            id: item.routes.id,
            name: item.routes.name,
            grade: item.routes.grade,
            style: item.routes.style as 'Trad' | 'Sport' | 'Top Rope',
            area: item.routes.area,
            sector: item.routes.sector
          },
          user_name: profilesMap.get(item.user_id) || 'Anonymous'
        }));

        setSubmissions(transformedSubmissions);
      } catch (error) {
        console.error('Error fetching recent grade submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSubmissions();
  }, [limit]);

  return { submissions, loading };
};
