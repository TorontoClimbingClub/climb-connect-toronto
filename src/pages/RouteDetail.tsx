
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, MessageCircle, Mountain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { PhotoUpload } from "@/components/PhotoUpload";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { useRouteData } from "@/hooks/useRouteData";
import { cn } from "@/lib/utils";

export default function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comment, setComment] = useState("");

  const route = rattlesnakeRoutes.find(r => r.id === routeId);
  const { comments, photos, loading, addComment, uploadPhoto } = useRouteData(routeId || "");

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await addComment(comment);
    setComment("");
  };

  if (!route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Route not found</p>
          <Button onClick={() => navigate('/routes')}>Back to Routes</Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate('/routes')}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-[#E55A2B]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#E55A2B]">{route.name}</h1>
            <p className="text-stone-600 text-sm">{route.area} - {route.sector}</p>
          </div>
        </div>

        {/* Route Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mountain className="h-6 w-6 text-[#E55A2B]" />
              <div className="flex-1">
                <CardTitle className="text-lg">{route.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("text-xl font-bold", getDifficultyColor(route.grade))}>
                    {route.grade}
                  </span>
                  <Badge className={getStyleColor(route.style)} variant="secondary">
                    {route.style}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600">Area:</span>
                <span className="font-medium">{route.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Sector:</span>
                <span className="font-medium">{route.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Style:</span>
                <span className="font-medium">{route.style}</span>
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
          <CardContent>
            <PhotoUpload onUpload={uploadPhoto} loading={loading} />
            
            {photos.length > 0 && (
              <div className="mt-6 space-y-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="space-y-2">
                    <img 
                      src={photo.photo_url} 
                      alt={photo.caption || route.name}
                      className="w-full rounded-lg object-cover"
                    />
                    {photo.caption && (
                      <p className="text-sm text-stone-600">{photo.caption}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>by {photo.user_name}</span>
                      <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {photos.length === 0 && (
              <div className="text-center py-8 text-stone-500">
                <Camera className="h-12 w-12 mx-auto mb-4 text-stone-400" />
                <p>No photos yet. Be the first to share!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Comment */}
            {user ? (
              <div className="space-y-3 mb-6">
                <Textarea
                  placeholder="Share your experience on this route..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-20"
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={loading || !comment.trim()}
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
              {comments.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-stone-400" />
                  <p>No comments yet. Share your experience!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-stone-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-[#E55A2B]">
                        {comment.user_name}
                      </span>
                      <span className="text-xs text-stone-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-stone-700">{comment.comment}</p>
                  </div>
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
