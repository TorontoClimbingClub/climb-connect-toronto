
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, MessageCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PhotoUpload } from "@/components/PhotoUpload";
import { CommentItem } from "@/components/CommentItem";
import { RouteHeader } from "@/components/route-detail/RouteHeader";
import { RouteDetailsCard } from "@/components/route-detail/RouteDetailsCard";
import { useRouteData } from "@/hooks/useRouteData";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useAccessControl } from "@/hooks/useAccessControl";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { useAuth } from "@/contexts/AuthContext";

export default function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const { hasAccess, accessLoading } = useAccessControl('public');

  console.log('🏔️ RouteDetail - Component mounted:', {
    routeId,
    userId: user?.id,
    userEmail: user?.email,
    hasAccess,
    accessLoading
  });

  const route = rattlesnakeRoutes.find(r => r.id === routeId);
  
  const {
    comments,
    photos,
    loading,
    addComment,
    deleteComment,
    uploadPhoto,
    deletePhoto,
    updatePhotoCaption
  } = useRouteData(routeId || "");

  const { toggleCompletion, isCompleted } = useClimbCompletions();
  const completed = isCompleted(routeId || "");

  // Show loading state while checking access
  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading route...</div>
      </div>
    );
  }

  if (!route) {
    console.error('❌ Route not found:', routeId);
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-4">Route Not Found</h1>
          <Button onClick={() => navigate("/routes")}>
            Back to Routes
          </Button>
        </div>
      </div>
    );
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    
    try {
      console.log('💬 Adding comment:', { userId: user?.id, routeId, comment: newComment });
      await addComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error('❌ Error adding comment:', error);
    }
  };

  const handleReply = async (comment: string, parentId: string) => {
    try {
      console.log('💬 Adding reply:', { userId: user?.id, routeId, comment, parentId });
      await addComment(comment, parentId);
    } catch (error) {
      console.error('❌ Error adding reply:', error);
    }
  };

  const handleToggleCompletion = () => {
    if (user && routeId) {
      console.log('🎯 Toggling completion:', { userId: user.id, routeId });
      toggleCompletion(routeId);
    }
  };

  // Group comments by parent
  const parentComments = comments.filter(c => !c.parent_id);
  const commentReplies = comments.filter(c => c.parent_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <RouteHeader
          routeName={route.name}
          area={route.area}
          sector={route.sector}
          onBack={() => navigate("/routes")}
        />

        <RouteDetailsCard
          route={route}
          completed={completed}
          canToggleCompletion={!!user}
          onToggleCompletion={handleToggleCompletion}
        />

        {/* Photos Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photos ({photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PhotoGallery 
              photos={photos}
              onDeletePhoto={deletePhoto}
              onUpdateCaption={updatePhotoCaption}
              loading={loading}
            />
            
            {photos.length > 0 && user && (
              <div className="border-t pt-4">
                <PhotoUpload onUpload={uploadPhoto} loading={loading} />
              </div>
            )}
            
            {photos.length === 0 && user && (
              <PhotoUpload onUpload={uploadPhoto} loading={loading} />
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
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
                    onDelete={deleteComment}
                    loading={loading}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}
