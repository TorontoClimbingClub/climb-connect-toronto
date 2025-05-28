
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PhotoUploadProps {
  onUpload: (file: File, caption?: string) => void;
  loading: boolean;
}

export const PhotoUpload = ({ onUpload, loading }: PhotoUploadProps) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, caption);
      setSelectedFile(null);
      setCaption("");
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setCaption("");
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) {
    return (
      <div className="text-center py-2 text-stone-500">
        <p className="text-sm">Please sign in to upload photos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!selectedFile ? (
        <div>
          <Label htmlFor="photo-upload" className="cursor-pointer">
            <div className="border border-dashed border-stone-300 rounded-lg p-3 text-center hover:border-[#E55A2B] transition-colors bg-stone-50">
              <Upload className="h-4 w-4 mx-auto mb-1 text-stone-400" />
              <p className="text-xs text-stone-600">Add photo</p>
            </div>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              ref={fileInputRef}
            />
          </Label>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-32 object-cover rounded-lg"
              />
            )}
            <button
              onClick={handleCancel}
              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <X className="h-2 w-2" />
            </button>
          </div>
          
          <div>
            <Label htmlFor="caption" className="text-xs">Caption (optional)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption..."
              className="mt-1 text-xs h-8"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={loading}
              size="sm"
              className="flex-1 bg-[#E55A2B] hover:bg-orange-700 h-8 text-xs"
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              disabled={loading}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
