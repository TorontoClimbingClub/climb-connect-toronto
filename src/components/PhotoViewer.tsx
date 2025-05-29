
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: string;
  photo_url: string;
  caption?: string;
  user_name: string;
}

interface PhotoViewerProps {
  photos: Photo[];
  currentPhotoIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoChange: (index: number) => void;
}

export function PhotoViewer({ 
  photos, 
  currentPhotoIndex, 
  open, 
  onOpenChange, 
  onPhotoChange 
}: PhotoViewerProps) {
  const currentPhoto = photos[currentPhotoIndex];

  const handlePrevious = () => {
    const newIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1;
    onPhotoChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0;
    onPhotoChange(newIndex);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'Escape') {
      onOpenChange(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, currentPhotoIndex]);

  if (!currentPhoto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden">
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4">
            <div className="flex justify-between items-center text-white">
              <div className="space-y-1">
                <p className="text-sm font-medium">Photo by {currentPhoto.user_name}</p>
                {currentPhoto.caption && (
                  <p className="text-sm opacity-90">{currentPhoto.caption}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {currentPhotoIndex + 1} of {photos.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center bg-black">
            <img
              src={currentPhoto.photo_url}
              alt={currentPhoto.caption || 'Route photo'}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation buttons */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
              <div className="flex gap-2 justify-center overflow-x-auto">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => onPhotoChange(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                      index === currentPhotoIndex ? 'border-white' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={photo.photo_url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
