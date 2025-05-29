
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { RouteHeader } from "@/components/route-detail/RouteHeader";
import { RouteDetailsCard } from "@/components/route-detail/RouteDetailsCard";
import { PhotosSection } from "@/components/route-detail/PhotosSection";
import { CommentsSection } from "@/components/route-detail/CommentsSection";
import { useRouteData } from "@/hooks/useRouteData";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  console.log('🏔️ RouteDetail - Component mounted:', {
    routeId,
    userId: user?.id,
    userEmail: user?.email,
    route: location.pathname
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

  const handleToggleCompletion = () => {
    if (user && routeId) {
      console.log('🎯 Toggling completion:', { userId: user.id, routeId });
      toggleCompletion(routeId);
    }
  };

  const handleAddComment = async (comment: string, parentId?: string) => {
    console.log('💬 Adding comment:', { userId: user?.id, routeId, comment, parentId });
    await addComment(comment, parentId);
  };

  const handleBack = () => {
    // Check if we came from a specific state that has navigation history
    const searchParams = new URLSearchParams(location.search);
    const fromSector = searchParams.get('sector');
    const fromArea = searchParams.get('area');
    
    if (fromSector && fromArea) {
      // Navigate back to the specific area within the sector
      navigate(`/routes?sector=${fromSector}&area=${fromArea}`);
    } else {
      // Default back to routes page
      navigate("/routes");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <RouteHeader
          routeName={route.name}
          area={route.area}
          sector={route.sector}
          onBack={handleBack}
        />

        <RouteDetailsCard
          route={route}
          completed={completed}
          canToggleCompletion={!!user}
          onToggleCompletion={handleToggleCompletion}
        />

        <PhotosSection
          photos={photos}
          loading={loading}
          onUploadPhoto={uploadPhoto}
          onDeletePhoto={deletePhoto}
          onUpdateCaption={updatePhotoCaption}
        />

        <CommentsSection
          comments={comments}
          loading={loading}
          onAddComment={handleAddComment}
          onDeleteComment={deleteComment}
        />
      </div>
      <Navigation />
    </div>
  );
}
