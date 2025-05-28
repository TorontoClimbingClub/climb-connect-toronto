import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Mountain, Camera, MessageCircle, CheckCircle2, Circle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PhotoUpload } from "@/components/PhotoUpload";
import { CommentItem } from "@/components/CommentItem";
import { useRouteData } from "@/hooks/useRouteData";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function RouteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const route = rattlesnakeRoutes.find(r => r.id === id);
  
  const {
    comments,
    photos,
    loading,
    addComment,
    deleteComment,
    uploadPhoto,
    deletePhoto,
    updatePhotoCaption
  } = useRouteData(id || "");

  const { toggleCompletion, isCompleted } = useClimbCompletions();
  const completed = isCompleted(id || "");

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-4">Route Not Found</h1>
          <Button onClick={() => navigate("/routes")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Routes
          </Button>
        </div>
      </div>
    );
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user) return;
    await addComment(newComment);
    setNewComment("");
  };

  const handleReply = async (comment: string, parentId: string) => {
    if (!user) return;
    await addComment(comment, parentId);
  };

  const handleToggleCompletion = () => {
    if (user && id) {
      toggleCompletion(id);
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'Trad':
        return 'bg-orange-100 text-orange-800';
      case 'Sport':
        return 'bg-blue-100 text-blue-800';
      case 'Top Rope':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (grade: string) => {
    if (grade.includes('5.1') && (grade.includes('0') || grade.includes('1') || grade.includes('2'))) {
      return 'text-red-600 font-bold';
    }
    if (grade.includes('5.9') || grade.includes('5.10')) {
      return 'text-orange-600 font-semibold';
    }
    if (grade.includes('5.7') || grade.includes('5.8')) {
      return 'text-yellow-600 font-medium';
    }
    return 'text-green-600';
  };

  // Group comments by parent
  const parentComments = comments.filter(c => !c.parent_id);
  const commentReplies = comments.filter(c => c.parent_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate("/routes")}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#E55A2B]" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#E55A2B]">{route.name}</h1>
            <div className="flex items-center gap-2 text-stone-600">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{route.area}, {route.sector}</span>
            </div>
          </div>
        </div>

        {/* Route Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{route.name}</CardTitle>
              {user && (
                <Button
                  onClick={handleToggleCompletion}
                  variant={completed ? "default" : "outline"}
                  className={cn(
                    "flex items-center gap-2",
                    completed 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "border-green-600 text-green-600 hover:bg-green-50"
                  )}
                >
                  {completed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4" />
                      Mark Complete
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm font-medium text-stone-700">Grade</span>
                <p className={cn("text-lg font-bold", getDifficultyColor(route.grade))}>
                  {route.grade}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-stone-700">Style</span>
                <div className="mt-1">
                  <Badge className={getStyleColor(route.style)} variant="secondary">
                    {route.style}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mountain className="h-4 w-4 text-stone-500" />
                <span className="text-sm"><strong>Sector:</strong> {route.sector}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-stone-500" />
                <span className="text-sm"><strong>Area:</strong> {route.area}</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
            
            {photos.length > 0 && (
              <div className="border-t pt-4">
                <PhotoUpload onUpload={uploadPhoto} loading={loading} />
              </div>
            )}
            
            {photos.length === 0 && (
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
