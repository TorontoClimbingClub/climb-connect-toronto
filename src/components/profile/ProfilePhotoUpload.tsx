
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, X, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string | null;
  onPhotoUpdate: (photoUrl: string | null) => void;
  userInitials: string;
}

export function ProfilePhotoUpload({ currentPhotoUrl, onPhotoUpdate, userInitials }: ProfilePhotoUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setShowCropper(true);
    }
  };

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageSize({ width: naturalWidth, height: naturalHeight });
      
      // Set initial crop area to center square
      const size = Math.min(naturalWidth, naturalHeight);
      setCropArea({
        x: (naturalWidth - size) / 2,
        y: (naturalHeight - size) / 2,
        width: size,
        height: size
      });
    }
  }, []);

  const getCroppedImage = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const image = imageRef.current!;

      // Set canvas size to desired output size (square)
      canvas.width = 300;
      canvas.height = 300;

      // Calculate scale factors
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Draw cropped image
      ctx.drawImage(
        image,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0,
        0,
        300,
        300
      );

      canvas.toBlob(resolve!, 'image/jpeg', 0.9);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !showCropper) return;

    setUploading(true);
    try {
      // Get cropped image
      const croppedBlob = await getCroppedImage();
      
      // Delete existing photo if it exists
      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profile-photos')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      // Upload new photo
      const fileName = `${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, croppedBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onPhotoUpdate(data.publicUrl);
      setSelectedFile(null);
      setPreview(null);
      setShowCropper(false);
      
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!user || !currentPhotoUrl) return;

    setUploading(true);
    try {
      // Delete from storage
      const path = currentPhotoUrl.split('/').pop();
      if (path) {
        await supabase.storage
          .from('profile-photos')
          .remove([`${user.id}/${path}`]);
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ profile_photo_url: null })
        .eq('id', user.id);

      if (error) throw error;

      onPhotoUpdate(null);
      
      toast({
        title: "Success",
        description: "Profile photo removed",
      });
    } catch (error: any) {
      console.error('Error removing photo:', error);
      toast({
        title: "Error",
        description: "Failed to remove profile photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setShowCropper(false);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !showCropper) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * imageSize.width;
    const y = ((e.clientY - rect.top) / rect.height) * imageSize.height;
    
    const size = Math.min(imageSize.width - x, imageSize.height - y, 200);
    setCropArea({ x, y, width: size, height: size });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentPhotoUrl || undefined} />
          <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          {!selectedFile ? (
            <div className="space-y-2">
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <div>
                    <Camera className="h-4 w-4 mr-2" />
                    {currentPhotoUrl ? 'Change Photo' : 'Add Photo'}
                  </div>
                </Button>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  ref={fileInputRef}
                />
              </Label>
              {currentPhotoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleUpload}
                disabled={uploading || !showCropper}
                size="sm"
                className="bg-[#E55A2B] hover:bg-orange-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {showCropper && preview && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Adjust your photo:</h4>
          <div className="relative inline-block border rounded-lg overflow-hidden">
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              className="max-w-md max-h-64 object-contain cursor-crosshair"
              onLoad={handleImageLoad}
              onClick={handleCropChange}
            />
            {imageSize.width > 0 && (
              <div
                className="absolute border-2 border-[#E55A2B] bg-black bg-opacity-30"
                style={{
                  left: `${(cropArea.x / imageSize.width) * 100}%`,
                  top: `${(cropArea.y / imageSize.height) * 100}%`,
                  width: `${(cropArea.width / imageSize.width) * 100}%`,
                  height: `${(cropArea.height / imageSize.height) * 100}%`,
                }}
              />
            )}
          </div>
          <p className="text-xs text-stone-600">Click on the image to position the crop area</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
