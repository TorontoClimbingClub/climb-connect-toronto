
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
      <div className="text-center py-4 text-stone-500">
        <p>Please sign in to upload photos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div>
          <Label htmlFor="photo-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:border-[#E55A2B] transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-stone-400" />
              <p className="text-stone-600">Click to select a photo</p>
              <p className="text-sm text-stone-500">JPG, PNG up to 10MB</p>
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
        <div className="space-y-4">
          <div className="relative">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            )}
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div>
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption for your photo..."
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="flex-1 bg-[#E55A2B] hover:bg-orange-700"
            >
              {loading ? "Uploading..." : "Upload Photo"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
