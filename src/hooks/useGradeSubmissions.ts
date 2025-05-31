
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RouteGradeSubmission, RouteBetaGrade } from "@/types/routes";

export const useGradeSubmissions = (routeId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<RouteGradeSubmission[]>([]);
  const [betaGrade, setBetaGrade] = useState<RouteBetaGrade | null>(null);
  const [userSubmission, setUserSubmission] = useState<RouteGradeSubmission | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    if (!routeId) return;

    try {
      // Fetch all submissions for this route
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('route_grade_submissions')
        .select('*')
        .eq('route_id', routeId)
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      setSubmissions(submissionsData || []);

      // Find current user's submission
      if (user && submissionsData) {
        const currentUserSubmission = submissionsData.find(s => s.user_id === user.id);
        setUserSubmission(currentUserSubmission || null);
      }

      // Fetch beta grade
      const { data: betaGradeData, error: betaGradeError } = await supabase
        .from('route_beta_grades')
        .select('*')
        .eq('route_id', routeId)
        .single();

      if (betaGradeError && betaGradeError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching beta grade:', betaGradeError);
      } else {
        setBetaGrade(betaGradeData || null);
      }
    } catch (error) {
      console.error('Error fetching grade submissions:', error);
    }
  }, [routeId, user]);

  const submitGrade = async (grade: string, notes: string, climbingStyle: string) => {
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

      await fetchSubmissions(); // Refresh data
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
  };

  const deleteSubmission = async () => {
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

      await fetchSubmissions(); // Refresh data
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
  };

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
