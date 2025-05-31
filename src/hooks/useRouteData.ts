
import { useEffect } from "react";
import { useRouteComments } from "./useRouteComments";
import { useGradeSubmissions } from "./useGradeSubmissions";

export const useRouteData = (routeId: string) => {
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

  useEffect(() => {
    if (routeId) {
      try {
        fetchComments();
        fetchSubmissions();
      } catch (error) {
        console.warn('Error fetching route data:', error);
      }
    }
  }, [fetchComments, fetchSubmissions, routeId]);

  return {
    comments,
    submissions,
    betaGrade,
    userSubmission,
    loading: commentsLoading || gradeLoading,
    addComment,
    deleteComment
  };
};
