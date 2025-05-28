
import { useEffect } from "react";
import { useRouteComments } from "./useRouteComments";
import { useRoutePhotos } from "./useRoutePhotos";

export const useRouteData = (routeId: string) => {
  const {
    comments,
    loading: commentsLoading,
    addComment,
    deleteComment,
    fetchComments
  } = useRouteComments(routeId);

  const {
    photos,
    loading: photosLoading,
    uploadPhoto,
    deletePhoto,
    updatePhotoCaption,
    fetchPhotos
  } = useRoutePhotos(routeId);

  useEffect(() => {
    fetchComments();
    fetchPhotos();
  }, [fetchComments, fetchPhotos]);

  return {
    comments,
    photos,
    loading: commentsLoading || photosLoading,
    addComment,
    deleteComment,
    uploadPhoto,
    deletePhoto,
    updatePhotoCaption
  };
};
