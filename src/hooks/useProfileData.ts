
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { forceLogoutAndRedirect } from "@/utils/auth";
import { UserProfile } from "@/types";
import { handleSupabaseError, logError } from "@/utils/error";

export function useProfileData() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const mountedRef = useRef(true);
  const [hasShownProfileToast, setHasShownProfileToast] = useState(false);

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

  // Show privacy settings toast when user first visits profile
  useEffect(() => {
    if (profile && !hasShownProfileToast && mountedRef.current) {
      setHasShownProfileToast(true);
      toast({
        title: "Set Your Privacy Settings",
        description: "Don't forget to configure your privacy settings to control what other members can see about you.",
        duration: 8000,
      });
    }
  }, [profile, hasShownProfileToast, toast]);

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

        // Check if this is a new user (profile created recently and basic info not filled)
        const isNewUser = !data.phone && 
                          !data.climbing_description && 
                          !data.bio &&
                          (!data.climbing_experience || data.climbing_experience.length === 0);

        if (isNewUser) {
          toast({
            title: "Welcome to the Community!",
            description: "Please fill out your profile information so other members can get to know you better.",
            duration: 10000,
          });
        }
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

  return {
    profile,
    setProfile,
    loading,
    fetchProfile,
  };
}
