
import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RouteGradeSubmission, RouteBetaGrade } from "@/types/routes";

/**
 * Hook for managing route grade submissions and beta grades
 * Optimized for performance with memoized calculations and efficient data fetching
 */
export const useGradeSubmissions = (routeId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<RouteGradeSubmission[]>([]);
  const [betaGrade, setBetaGrade] = useState<RouteBetaGrade | null>(null);
  const [loading, setLoading] = useState(false);

  // Memoize user's submission to prevent unnecessary re-renders
  const userSubmission = useMemo(() => {
    if (!user || !submissions.length) return null;
    return submissions.find(s => s.user_id === user.id) || null;
  }, [submissions, user]);

  const fetchSubmissions = useCallback(async () => {
    if (!routeId) return;

    try {
      // Fetch both submissions and beta grade in parallel for better performance
      const [submissionsResult, betaGradeResult] = await Promise.all([
        supabase
          .from('route_grade_submissions')
          .select('*')
          .eq('route_id', routeId)
          .order('created_at', { ascending: false }),
        supabase
          .from('route_beta_grades')
          .select('*')
          .eq('route_id', routeId)
          .single()
      ]);

      if (submissionsResult.error) throw submissionsResult.error;
      setSubmissions(submissionsResult.data || []);

      // Handle beta grade (no error if not found)
      if (betaGradeResult.error && betaGradeResult.error.code !== 'PGRST116') {
        console.error('Error fetching beta grade:', betaGradeResult.error);
        setBetaGrade(null);
      } else if (betaGradeResult.data) {
        const gradeDistribution = betaGradeResult.data.grade_distribution as Record<string, number>;
        setBetaGrade({
          route_id: betaGradeResult.data.route_id,
          beta_grade: betaGradeResult.data.beta_grade,
          submission_count: betaGradeResult.data.submission_count,
          grade_distribution: gradeDistribution,
          last_updated: betaGradeResult.data.last_updated
        });
      } else {
        setBetaGrade(null);
      }
    } catch (error) {
      console.error('Error fetching grade submissions:', error);
      setSubmissions([]);
      setBetaGrade(null);
    }
  }, [routeId]);

  const submitGrade = useCallback(async (grade: string, notes: string, climbingStyle: string) => {
    if (!user || !routeId) return false;

    setLoading(true);
    try {
      const submissionData = {
        route_id: routeId,
        user_id: user.id,
        submitted_grade: grade,
        notes: notes.trim() || null,
        climbing_style: climbingStyle
      };

      let error;
      if (userSubmission) {
        // Update existing submission
        const result = await supabase
          .from('route_grade_submissions')
          .update(submissionData)
          .eq('id', userSubmission.id);
        error = result.error;
      } else {
        // Insert new submission
        const result = await supabase
          .from('route_grade_submissions')
          .insert(submissionData);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: userSubmission ? "Grade updated" : "Grade submitted",
        description: `Your grade assessment has been ${userSubmission ? 'updated' : 'submitted'} successfully`,
      });

      await fetchSubmissions();
      return true;
    } catch (error) {
      console.error('Error submitting grade:', error);
      toast({
        title: "Error",
        description: "Failed to submit grade assessment",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, routeId, userSubmission, fetchSubmissions, toast]);

  const deleteSubmission = useCallback(async () => {
    if (!user || !userSubmission) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('route_grade_submissions')
        .delete()
        .eq('id', userSubmission.id);

      if (error) throw error;

      toast({
        title: "Grade submission deleted",
        description: "Your grade assessment has been removed",
      });

      await fetchSubmissions();
      return true;
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete grade submission",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, userSubmission, fetchSubmissions, toast]);

  return {
    submissions,
    betaGrade,
    userSubmission,
    loading,
    submitGrade,
    deleteSubmission,
    fetchSubmissions
  };
};
