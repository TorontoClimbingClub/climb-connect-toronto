
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { RouteHeader } from "@/components/route-detail/RouteHeader";
import { RouteDetailsCard } from "@/components/route-detail/RouteDetailsCard";
import { PhotosSection } from "@/components/route-detail/PhotosSection";
import { CommentsSection } from "@/components/route-detail/CommentsSection";
import { useRouteData } from "@/hooks/useRouteData";
import { useClimbCompletions } from "@/hooks/useClimbCompletions";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouteManagement } from "@/hooks/useRouteManagement";
import { Loader2 } from "lucide-react";

export default function RouteDetail() {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { routes, loading } = useRouteManagement();
  
  // Use try-catch to handle auth context issues gracefully
  let user = null;
  let authError = false;
  
  try {
    const authData = useAuth();
    user = authData.user;
  } catch (error) {
    console.warn('Auth context not available:', error);
    authError = true;
  }

  console.log('🏔️ RouteDetail - Component mounted:', {
    routeId,
    userId: user?.id,
    userEmail: user?.email,
    route: location.pathname,
    authError,
    routesLoaded: routes.length,
    loading
  });

  const route = routes.find(r => r.id === routeId);
  
  const {
    comments,
    photos,
    loading: dataLoading,
    addComment,
    deleteComment,
    uploadPhoto,
    deletePhoto,
    updatePhotoCaption
  } = useRouteData(routeId || "");

  // Only use climb completions if user is available
  const { toggleCompletion, isCompleted } = user ? useClimbCompletions() : { 
    toggleCompletion: () => {}, 
    isCompleted: () => false 
  };
  const completed = user ? isCompleted(routeId || "") : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#E55A2B]">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading route...</span>
        </div>
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

  const handleToggleCompletion = () => {
    if (user && routeId) {
      console.log('🎯 Toggling completion:', { userId: user.id, routeId });
      toggleCompletion(routeId);
    }
  };

  const handleAddComment = async (comment: string, parentId?: string) => {
    if (!user) {
      console.warn('User not authenticated, cannot add comment');
      return;
    }
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
          loading={dataLoading}
          onUploadPhoto={user ? uploadPhoto : undefined}
          onDeletePhoto={user ? deletePhoto : undefined}
          onUpdateCaption={user ? updatePhotoCaption : undefined}
        />

        <CommentsSection
          comments={comments}
          loading={dataLoading}
          onAddComment={handleAddComment}
          onDeleteComment={user ? deleteComment : undefined}
        />
      </div>
      <Navigation />
    </div>
  );
}
