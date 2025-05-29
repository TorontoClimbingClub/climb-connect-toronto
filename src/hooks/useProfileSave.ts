
import { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/types";
import { handleSupabaseError, logError } from "@/utils/error";

export function useProfileSave() {
  const { user } = useAuth();
  const { toast } = useToast();
  const mountedRef = useRef(true);

  const handleSave = async (
    formData: UserProfile,
    onSuccess: (updatedProfile: UserProfile) => void,
    onEditingChange: (editing: boolean) => void
  ) => {
    if (!user || !mountedRef.current) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          climbing_description: formData.climbing_description,
          climbing_level: formData.climbing_level,
          climbing_experience: formData.climbing_experience,
          bio: formData.bio,
          allow_profile_viewing: formData.allow_profile_viewing,
          show_climbing_progress: formData.show_climbing_progress,
          show_completion_stats: formData.show_completion_stats,
          show_climbing_level: formData.show_climbing_level,
          show_trad_progress: formData.show_trad_progress,
          show_sport_progress: formData.show_sport_progress,
          show_top_rope_progress: formData.show_top_rope_progress,
        })
        .eq('id', user.id);

      if (error) throw error;

      if (mountedRef.current) {
        onSuccess(formData);
        onEditingChange(false);
        
        toast({
          title: "Success!",
          description: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      if (mountedRef.current) {
        const apiError = handleSupabaseError(error);
        logError('handleSave', error);
        
        toast({
          title: "Error",
          description: apiError.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    }
  };

  return { handleSave };
}
