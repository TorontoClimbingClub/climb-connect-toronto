
import { useEffect, useMemo } from "react";
import { useRouteComments } from "./useRouteComments";
import { useGradeSubmissions } from "./useGradeSubmissions";

/**
 * Optimized hook for fetching all route-related data
 * Eliminates redundant fetching and provides memoized loading states
 */
export const useOptimizedRouteData = (routeId: string) => {
  const {
    comments,
    loading: commentsLoading,
    addComment,
    deleteComment,
    fetchComments
  } = useRouteComments(routeId);

  const {
    submissions,
    betaGrade,
    userSubmission,
    loading: gradeLoading,
    fetchSubmissions
  } = useGradeSubmissions(routeId);

  // Memoize combined loading state to prevent unnecessary re-renders
  const loading = useMemo(() => commentsLoading || gradeLoading, [commentsLoading, gradeLoading]);

  // Fetch data only once when routeId changes
  useEffect(() => {
    if (routeId) {
      const fetchData = async () => {
        try {
          await Promise.all([
            fetchComments(),
            fetchSubmissions()
          ]);
        } catch (error) {
          console.warn('Error fetching route data:', error);
        }
      };
      
      fetchData();
    }
  }, [routeId, fetchComments, fetchSubmissions]);

  return {
    comments,
    submissions,
    betaGrade,
    userSubmission,
    loading,
    addComment,
    deleteComment
  };
};
