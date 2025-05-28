
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { forceLogoutAndRedirect } from "@/utils/auth";
import { UserProfile } from "@/types";
import { handleSupabaseError, logError } from "@/utils/error";

export function useProfileManagement() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    id: '',
    full_name: '',
    phone: '',
    is_carpool_driver: false,
    passenger_capacity: 0,
    climbing_description: '',
    climbing_level: '',
    climbing_experience: [],
    show_climbing_progress: true,
    show_completion_stats: true,
    show_climbing_level: true,
    show_trad_progress: true,
    show_sport_progress: true,
    show_top_rope_progress: true,
    created_at: '',
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.log('User found, fetching profile for user ID:', user.id);
      fetchProfile();
    } else {
      console.log('No user found');
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user || !mountedRef.current) {
      console.log('No user available for profile fetch or component unmounted');
      return;
    }

    console.log('Starting profile fetch for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile fetch response:', { data, error });

      if (error) {
        console.error('Profile fetch error:', error);
        
        // If profile doesn't exist, session issue, or auth error - force logout
        if (error.code === 'PGRST116' || 
            error.message?.includes('JWT') || 
            error.message?.includes('session') ||
            error.message?.includes('auth')) {
          console.log('Session broken or profile access denied, forcing logout...');
          
          if (mountedRef.current) {
            toast({
              title: "Session Error",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            });
          }
          
          // Force logout and redirect to login
          await forceLogoutAndRedirect();
          return;
        }
        
        throw error;
      }
      
      if (data && mountedRef.current) {
        console.log('Profile data loaded successfully:', data);
        setProfile(data);
        setFormData(data);
      }
    } catch (error: any) {
      if (mountedRef.current) {
        const apiError = handleSupabaseError(error);
        logError('fetchProfile', error);
        
        toast({
          title: "Error",
          description: apiError.message || "Failed to load profile. Redirecting to login...",
          variant: "destructive",
        });
        
        // Force logout on any error
        await forceLogoutAndRedirect();
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
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
        setProfile(formData);
        setEditing(false);
        
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

  const handleCancel = () => {
    if (profile && mountedRef.current) {
      setFormData(profile);
    }
    setEditing(false);
  };

  return {
    profile,
    loading,
    editing,
    formData,
    setEditing,
    setFormData,
    handleSave,
    handleCancel,
  };
}
