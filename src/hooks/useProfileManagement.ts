
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { forceLogoutAndRedirect } from "@/utils/authCleanup";

interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  is_carpool_driver: boolean;
  passenger_capacity?: number;
  climbing_description?: string;
}

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
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      console.log('User found, fetching profile for user ID:', user.id);
      fetchProfile();
    } else {
      console.log('No user found');
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) {
      console.log('No user available for profile fetch');
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
          toast({
            title: "Session Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          
          // Force logout and redirect to login
          await forceLogoutAndRedirect();
          return;
        }
        
        throw error;
      }
      
      if (data) {
        console.log('Profile data loaded successfully:', data);
        setProfile(data);
        setFormData(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Redirecting to login...",
        variant: "destructive",
      });
      
      // Force logout on any error
      await forceLogoutAndRedirect();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          is_carpool_driver: formData.is_carpool_driver,
          passenger_capacity: formData.is_carpool_driver ? formData.passenger_capacity : null,
          climbing_description: formData.climbing_description,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(formData);
      setEditing(false);
      
      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    if (profile) {
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
