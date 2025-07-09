import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
}

export function useUserProfile() {
  const { user } = useAuth();

  const {
    data: userProfile,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user,
    staleTime: 300000, // 5 minutes - profile changes infrequently
    gcTime: 600000, // 10 minutes
    retry: 1,
  });

  // Create a stable display object that doesn't cause re-renders
  const displayProfile = {
    id: user?.id || '',
    display_name: userProfile?.display_name || user?.user_metadata?.display_name || user?.email || '',
    avatar_url: userProfile?.avatar_url || user?.user_metadata?.avatar_url,
    initials: (userProfile?.display_name || user?.user_metadata?.display_name || user?.email || 'U')[0].toUpperCase()
  };

  return {
    userProfile: displayProfile,
    isLoading: isLoading && !!user,
    error
  };
}