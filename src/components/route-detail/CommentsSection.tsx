
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { CommentItem } from "@/components/CommentItem";
import { RouteComment } from "@/types/routes";
import { useAuth } from "@/contexts/AuthContext";

interface CommentsSectionProps {
  comments: RouteComment[];
  loading: boolean;
  onAddComment: (comment: string, parentId?: string) => Promise<void>;
  onDeleteComment: (commentId: string) => void;
}

export function CommentsSection({
  comments,
  loading,
  onAddComment,
  onDeleteComment
}: CommentsSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  // Group comments by parent
  const parentComments = comments.filter(c => !c.parent_id);
  const commentReplies = comments.filter(c => c.parent_id);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    
    try {
      await onAddComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error('❌ Error adding comment:', error);
    }
  };

  const handleReply = async (comment: string, parentId: string) => {
    try {
      await onAddComment(comment, parentId);
    } catch (error) {
      console.error('❌ Error adding reply:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({parentComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add Comment */}
        {user ? (
          <div className="space-y-3 mb-6">
            <Textarea
              placeholder="Share your experience on this route..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20"
            />
            <Button 
              onClick={handleCommentSubmit}
              disabled={loading || !newComment.trim()}
              className="w-full bg-[#E55A2B] hover:bg-orange-700"
            >
              Add Comment
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-stone-500 mb-6">
            <p>Please sign in to add comments</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {parentComments.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-stone-400" />
              <p>No comments yet. Share your experience!</p>
            </div>
          ) : (
            parentComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={commentReplies.filter(c => c.parent_id === comment.id)}
                onReply={handleReply}
                onDelete={onDeleteComment}
                loading={loading}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
