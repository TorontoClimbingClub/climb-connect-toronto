
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Eye } from "lucide-react";
import { PhotoUpload } from "@/components/PhotoUpload";
import { PhotoViewer } from "@/components/PhotoViewer";
import { useRoutePhotos } from "@/hooks/useRoutePhotos";

interface PhotosSectionProps {
  routeId: string;
}

export function PhotosSection({ routeId }: PhotosSectionProps) {
  const { photos, loading, uploadPhoto } = useRoutePhotos(routeId);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setCurrentPhotoIndex(index);
    setViewerOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Photos ({photos.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PhotoUpload onUpload={uploadPhoto} loading={loading} />
        
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer rounded-lg overflow-hidden aspect-square"
                onClick={() => handlePhotoClick(index)}
              >
                <img
                  src={photo.photo_url}
                  alt={photo.caption || 'Route photo'}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <p className="text-white text-xs truncate">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {photos.length === 0 && !loading && (
          <div className="text-center py-8 text-stone-500">
            <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No photos yet. Be the first to share a photo of this route!</p>
          </div>
        )}

        <PhotoViewer
          photos={photos}
          currentPhotoIndex={currentPhotoIndex}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          onPhotoChange={setCurrentPhotoIndex}
        />
      </CardContent>
    </Card>
  );
}
