
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RoutePhoto } from "@/types/routes";

export const useRoutePhotos = (routeId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<RoutePhoto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('route_photos')
        .select(`
          *,
          profiles!route_photos_user_id_fkey(full_name)
        `)
        .eq('route_id', routeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const photosWithNames = data?.map(photo => ({
        ...photo,
        user_name: photo.profiles?.full_name || photo.user_name || "Anonymous"
      })) || [];
      
      console.log('Fetched photos:', photosWithNames);
      setPhotos(photosWithNames);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  }, [routeId]);

  const uploadPhoto = async (file: File, caption?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${routeId}/${Date.now()}.${fileExt}`;

      console.log('Uploading file to:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('tccapp')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const publicUrl = `https://munpnfjhjgewqqfzzbga.supabase.co/storage/v1/object/public/tccapp/${fileName}`;

      console.log('Generated public URL:', publicUrl);

      const { error: dbError } = await supabase
        .from('route_photos')
        .insert({
          route_id: routeId,
          user_id: user.id,
          photo_url: publicUrl,
          caption: caption || null,
          user_name: user.email || "Anonymous"
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      toast({
        title: "Photo uploaded",
        description: "Your photo has been uploaded successfully",
      });

      fetchPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const deletePhoto = async (photoId: string, photoUrl: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const urlParts = photoUrl.split('/');
      const fileName = urlParts.slice(-3).join('/');

      console.log('Deleting file:', fileName);

      const { error: storageError } = await supabase.storage
        .from('tccapp')
        .remove([fileName]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      const { error: dbError } = await supabase
        .from('route_photos')
        .delete()
        .eq('id', photoId);

      if (dbError) throw dbError;

      toast({
        title: "Photo deleted",
        description: "Your photo has been deleted successfully",
      });

      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const updatePhotoCaption = async (photoId: string, newCaption: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('route_photos')
        .update({ caption: newCaption.trim() || null })
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "Caption updated",
        description: "Photo caption has been updated successfully",
      });

      fetchPhotos();
    } catch (error) {
      console.error('Error updating caption:', error);
      toast({
        title: "Error",
        description: "Failed to update caption",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return {
    photos,
    loading,
    uploadPhoto,
    deletePhoto,
    updatePhotoCaption,
    fetchPhotos
  };
};
