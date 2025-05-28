
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RouteComment, RoutePhoto } from "@/types/routes";

export const useRouteData = (routeId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<RouteComment[]>([]);
  const [photos, setPhotos] = useState<RoutePhoto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('route_comments')
        .select('*')
        .eq('route_id', routeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('route_photos')
        .select('*')
        .eq('route_id', routeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const addComment = async (comment: string) => {
    if (!user || !comment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('route_comments')
        .insert({
          route_id: routeId,
          user_id: user.id,
          comment: comment.trim(),
          user_name: user.email || "Anonymous"
        });

      if (error) throw error;

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });

      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const uploadPhoto = async (file: File, caption?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${routeId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('tccapp')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tccapp')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('route_photos')
        .insert({
          route_id: routeId,
          user_id: user.id,
          photo_url: publicUrl,
          caption: caption || null,
          user_name: user.email || "Anonymous"
        });

      if (dbError) throw dbError;

      toast({
        title: "Photo uploaded",
        description: "Your photo has been uploaded successfully",
      });

      fetchPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
    fetchPhotos();
  }, [routeId]);

  return {
    comments,
    photos,
    loading,
    addComment,
    uploadPhoto
  };
};
