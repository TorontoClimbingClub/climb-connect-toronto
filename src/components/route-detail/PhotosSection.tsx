
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PhotoUpload } from "@/components/PhotoUpload";
import { RoutePhoto } from "@/types/routes";
import { useAuth } from "@/contexts/AuthContext";

interface PhotosSectionProps {
  photos: RoutePhoto[];
  loading: boolean;
  onUploadPhoto: (file: File, caption?: string) => void;
  onDeletePhoto: (photoId: string, photoUrl: string) => void;
  onUpdateCaption: (photoId: string, newCaption: string) => void;
}

export function PhotosSection({
  photos,
  loading,
  onUploadPhoto,
  onDeletePhoto,
  onUpdateCaption
}: PhotosSectionProps) {
  const { user } = useAuth();

  return (
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
          onDeletePhoto={onDeletePhoto}
          onUpdateCaption={onUpdateCaption}
          loading={loading}
        />
        
        {photos.length > 0 && user && (
          <div className="border-t pt-4">
            <PhotoUpload onUpload={onUploadPhoto} loading={loading} />
          </div>
        )}
        
        {photos.length === 0 && user && (
          <PhotoUpload onUpload={onUploadPhoto} loading={loading} />
        )}
      </CardContent>
    </Card>
  );
}
