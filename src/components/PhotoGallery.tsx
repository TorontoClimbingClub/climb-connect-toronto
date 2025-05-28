
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { RoutePhoto } from "@/types/routes";
import { Edit2, Trash2, Save, X, Camera } from "lucide-react";

interface PhotoGalleryProps {
  photos: RoutePhoto[];
  onDeletePhoto: (photoId: string, photoUrl: string) => void;
  onUpdateCaption: (photoId: string, newCaption: string) => void;
  loading: boolean;
}

export const PhotoGallery = ({ 
  photos, 
  onDeletePhoto, 
  onUpdateCaption, 
  loading 
}: PhotoGalleryProps) => {
  const { user } = useAuth();
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");

  const handleEditStart = (photo: RoutePhoto) => {
    setEditingPhoto(photo.id);
    setEditCaption(photo.caption || "");
  };

  const handleEditSave = (photoId: string) => {
    onUpdateCaption(photoId, editCaption);
    setEditingPhoto(null);
    setEditCaption("");
  };

  const handleEditCancel = () => {
    setEditingPhoto(null);
    setEditCaption("");
  };

  const canManagePhoto = (photo: RoutePhoto) => {
    if (!user) return false;
    // User can manage their own photos, or if they're an admin
    return photo.user_id === user.id;
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-6 text-stone-500">
        <Camera className="h-8 w-8 mx-auto mb-3 text-stone-400" />
        <p className="text-sm">No photos yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {photos.map((photo) => (
        <div key={photo.id} className="bg-white rounded-lg overflow-hidden shadow-sm border">
          <div className="relative">
            <img 
              src={photo.photo_url} 
              alt={photo.caption || "Route photo"}
              className="w-full h-64 object-cover"
              onError={(e) => {
                console.error('Image load error for:', photo.photo_url);
                // Try to construct a different URL format
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('?')) {
                  const newUrl = photo.photo_url + '?t=' + Date.now();
                  target.src = newUrl;
                } else {
                  target.style.display = 'none';
                  // Show error placeholder
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-64 bg-stone-100 flex items-center justify-center">
                        <div class="text-center text-stone-500">
                          <Camera class="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p class="text-sm">Image failed to load</p>
                        </div>
                      </div>
                    `;
                  }
                }
              }}
            />
            
            {canManagePhoto(photo) && (
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  onClick={() => handleEditStart(photo)}
                  variant="ghost"
                  size="sm"
                  disabled={loading}
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => onDeletePhoto(photo.id, photo.photo_url)}
                  variant="ghost"
                  size="sm"
                  disabled={loading}
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-red-50 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="p-3 space-y-2">
            {editingPhoto === photo.id ? (
              <div className="space-y-2">
                <Input
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Enter caption..."
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditSave(photo.id)}
                    size="sm"
                    disabled={loading}
                    className="bg-[#E55A2B] hover:bg-orange-700 h-8 text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleEditCancel}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className="h-8 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {photo.caption && (
                  <p className="text-sm text-stone-700 font-medium">{photo.caption}</p>
                )}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>by {photo.user_name}</span>
                  <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
