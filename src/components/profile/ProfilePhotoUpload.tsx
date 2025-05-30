
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Upload, X } from "lucide-react";
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
  const [centerPoint, setCenterPoint] = useState({ x: 0.5, y: 0.5 });
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
      setCenterPoint({ x: 0.5, y: 0.5 }); // Reset to center
    }
  };

  const handleImageLoad = useCallback(() => {
    // Image loaded, ready for cropping
  }, []);

  const getCroppedImage = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const image = imageRef.current!;

      // Set canvas size to desired output size (square)
      const outputSize = 300;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Calculate the crop size (square) based on the smaller dimension
      const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
      
      // Calculate the source coordinates based on center point
      const sourceX = (centerPoint.x * image.naturalWidth) - (cropSize / 2);
      const sourceY = (centerPoint.y * image.naturalHeight) - (cropSize / 2);
      
      // Clamp source coordinates to stay within image bounds
      const clampedSourceX = Math.max(0, Math.min(sourceX, image.naturalWidth - cropSize));
      const clampedSourceY = Math.max(0, Math.min(sourceY, image.naturalHeight - cropSize));

      // Clear canvas and draw the cropped square image
      ctx.clearRect(0, 0, outputSize, outputSize);
      ctx.drawImage(
        image,
        clampedSourceX,
        clampedSourceY,
        cropSize,
        cropSize,
        0,
        0,
        outputSize,
        outputSize
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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || !showCropper) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setCenterPoint({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
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
          <h4 className="text-sm font-medium">Click to center your photo:</h4>
          <div className="relative inline-block border rounded-lg overflow-hidden bg-white">
            <img
              ref={imageRef}
              src={preview}
              alt="Preview"
              className="max-w-md max-h-64 object-contain cursor-crosshair"
              onLoad={handleImageLoad}
              onClick={handleImageClick}
            />
            {/* Center point indicator */}
            <div
              className="absolute w-4 h-4 bg-[#E55A2B] border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${centerPoint.x * 100}%`,
                top: `${centerPoint.y * 100}%`,
              }}
            />
            {/* Preview square outline */}
            <div
              className="absolute border-2 border-[#E55A2B] pointer-events-none"
              style={{
                left: `${Math.max(0, Math.min(100, centerPoint.x * 100 - 25))}%`,
                top: `${Math.max(0, Math.min(100, centerPoint.y * 100 - 25))}%`,
                width: '50%',
                height: '50%',
                opacity: 0.7
              }}
            />
          </div>
          <p className="text-xs text-stone-600">Click anywhere on the image to set the center point for cropping</p>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
