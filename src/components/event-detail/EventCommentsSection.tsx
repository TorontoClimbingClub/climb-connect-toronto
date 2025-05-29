
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Reply, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sanitizeHtml, validateInput, RateLimiter, getGenericErrorMessage } from "@/utils/security";

interface EventComment {
  id: string;
  event_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  parent_id: string | null;
  user_name: string;
}

interface EventCommentsSectionProps {
  eventId: string;
}

const commentRateLimiter = new RateLimiter();

export function EventCommentsSection({ eventId }: EventCommentsSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<EventComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const fetchComments = async () => {
    try {
      const { data: commentsData, error: commentsError } = await supabase
        .from('event_comments')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const commentsWithNames = commentsData.map(comment => ({
          ...comment,
          user_name: profilesData?.find(profile => profile.id === comment.user_id)?.full_name || comment.user_name || "Anonymous",
          // Sanitize comment content when displaying
          comment: sanitizeHtml(comment.comment)
        }));
        
        setComments(commentsWithNames);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: getGenericErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const validateComment = (comment: string): boolean => {
    const errors: Record<string, string> = {};
    
    if (!validateInput.comment(comment)) {
      errors.comment = "Comment must be between 3 and 1000 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addComment = async (comment: string, parentId?: string) => {
    if (!user || !comment.trim()) return;

    // Validate input
    if (!validateComment(comment)) {
      return;
    }

    // Rate limiting
    const rateLimitKey = `comment_${user.id}`;
    if (!commentRateLimiter.isAllowed(rateLimitKey, 10, 60000)) { // 10 comments per minute
      const remainingTime = Math.ceil(commentRateLimiter.getRemainingTime(rateLimitKey, 60000) / 1000);
      toast({
        title: "Too many comments",
        description: `Please wait ${remainingTime} seconds before commenting again`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Sanitize the comment before storing
      const sanitizedComment = sanitizeHtml(comment.trim());
      
      const { error } = await supabase
        .from('event_comments')
        .insert({
          event_id: eventId,
          user_id: user.id,
          comment: sanitizedComment,
          user_name: user.email || "Anonymous",
          parent_id: parentId || null
        });

      if (error) throw error;

      toast({
        title: parentId ? "Reply added" : "Comment added",
        description: parentId ? "Your reply has been added successfully" : "Your comment has been added successfully",
      });

      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
      setValidationErrors({});

      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: getGenericErrorMessage(error),
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
        .from('event_comments')
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
        description: getGenericErrorMessage(error),
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const parentComments = comments.filter(comment => !comment.parent_id);
  const getReplies = (parentId: string) => comments.filter(comment => comment.parent_id === parentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Event Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new comment */}
        {user && (
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment to coordinate with other participants..."
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                if (validationErrors.comment) {
                  setValidationErrors(prev => ({ ...prev, comment: "" }));
                }
              }}
              className={`min-h-[80px] ${validationErrors.comment ? 'border-red-500' : ''}`}
              maxLength={1000}
            />
            {validationErrors.comment && (
              <p className="text-sm text-red-600">{validationErrors.comment}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {newComment.length}/1000 characters
              </span>
              <Button 
                onClick={() => addComment(newComment)}
                disabled={!newComment.trim() || loading || !validateInput.comment(newComment)}
                className="bg-[#E55A2B] hover:bg-[#D14B20]"
              >
                <Send className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {parentComments.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-stone-400" />
              <p>No comments yet. Be the first to start the conversation!</p>
            </div>
          ) : (
            parentComments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 bg-stone-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-900">{sanitizeHtml(comment.user_name)}</span>
                    <span className="text-xs text-stone-500">
                      {new Date(comment.created_at).toLocaleDateString()} at{' '}
                      {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {user && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-stone-500 hover:text-stone-700"
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                    )}
                    {user?.id === comment.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteComment(comment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div 
                  className="text-stone-700 mb-3 whitespace-pre-wrap" 
                  dangerouslySetInnerHTML={{ __html: comment.comment }}
                />

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="mt-3 space-y-2 border-t pt-3">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[60px]"
                      maxLength={1000}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => addComment(replyText, comment.id)}
                        disabled={!replyText.trim() || loading || !validateInput.comment(replyText)}
                        size="sm"
                        className="bg-[#E55A2B] hover:bg-[#D14B20]"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      <Button 
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {getReplies(comment.id).map((reply) => (
                  <div key={reply.id} className="ml-6 mt-3 border-l-2 border-stone-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-900">{sanitizeHtml(reply.user_name)}</span>
                        <span className="text-xs text-stone-500">
                          {new Date(reply.created_at).toLocaleDateString()} at{' '}
                          {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {user?.id === reply.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteComment(reply.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div 
                      className="text-stone-700 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: reply.comment }}
                    />
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
