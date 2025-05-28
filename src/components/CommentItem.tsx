
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { RouteComment } from "@/types/routes";
import { Trash2, Reply } from "lucide-react";

interface CommentItemProps {
  comment: RouteComment;
  replies: RouteComment[];
  onReply: (comment: string, parentId: string) => void;
  onDelete: (commentId: string) => void;
  loading: boolean;
}

export const CommentItem = ({ comment, replies, onReply, onDelete, loading }: CommentItemProps) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const canDelete = user && comment.user_id === user.id;
  const canReply = user && comment.user_id !== user.id; // Don't allow replies to own comments

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await onReply(replyText, comment.id);
    setReplyText("");
    setShowReplyForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="bg-stone-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm text-[#E55A2B]">
            {comment.user_name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
            {canDelete && (
              <Button
                onClick={() => onDelete(comment.id)}
                variant="ghost"
                size="sm"
                disabled={loading}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-stone-700 mb-2">{comment.comment}</p>
        
        {canReply && (
          <Button
            onClick={() => setShowReplyForm(!showReplyForm)}
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-stone-600 hover:text-[#E55A2B]"
          >
            <Reply className="h-3 w-3 mr-1" />
            Reply
          </Button>
        )}

        {showReplyForm && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-16 text-sm"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleReply}
                disabled={loading || !replyText.trim()}
                size="sm"
                className="bg-[#E55A2B] hover:bg-orange-700 text-xs"
              >
                Reply
              </Button>
              <Button 
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText("");
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-6 space-y-2">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-stone-100 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-[#E55A2B]">
                  {reply.user_name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500">
                    {new Date(reply.created_at).toLocaleDateString()}
                  </span>
                  {user && reply.user_id === user.id && (
                    <Button
                      onClick={() => onDelete(reply.id)}
                      variant="ghost"
                      size="sm"
                      disabled={loading}
                      className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-stone-600 text-sm">{reply.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
