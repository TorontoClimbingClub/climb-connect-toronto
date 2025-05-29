
import { useEffect } from "react";
import { useRouteComments } from "./useRouteComments";

export const useRouteData = (routeId: string) => {
  const {
    comments,
    loading: commentsLoading,
    addComment,
    deleteComment,
    fetchComments
  } = useRouteComments(routeId);

  useEffect(() => {
    if (routeId) {
      try {
        fetchComments();
      } catch (error) {
        console.warn('Error fetching route data:', error);
      }
    }
  }, [fetchComments, routeId]);

  return {
    comments,
    loading: commentsLoading,
    addComment,
    deleteComment
  };
};
