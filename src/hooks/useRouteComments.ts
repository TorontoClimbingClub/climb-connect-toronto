
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RouteComment } from "@/types/routes";

export const useRouteComments = (routeId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<RouteComment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('route_comments')
        .select(`
          *,
          profiles!route_comments_user_id_fkey(full_name)
        `)
        .eq('route_id', routeId)
        .order('created_at', { ascending: true }); // Changed to ascending for first to last

      if (error) throw error;
      
      const commentsWithNames = data?.map(comment => ({
        ...comment,
        user_name: comment.profiles?.full_name || comment.user_name || "Anonymous"
      })) || [];
      
      setComments(commentsWithNames);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [routeId]);

  const addComment = async (comment: string, parentId?: string) => {
    if (!user || !comment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('route_comments')
        .insert({
          route_id: routeId,
          user_id: user.id,
          comment: comment.trim(),
          user_name: user.email || "Anonymous",
          parent_id: parentId || null
        });

      if (error) throw error;

      toast({
        title: parentId ? "Reply added" : "Comment added",
        description: parentId ? "Your reply has been added successfully" : "Your comment has been added successfully",
      });

      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: parentId ? "Failed to add reply" : "Failed to add comment",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('route_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully",
      });

      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    fetchComments
  };
};
