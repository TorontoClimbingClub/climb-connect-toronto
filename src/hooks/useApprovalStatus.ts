import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useApprovalStatus() {
  const { user } = useAuth();

  const {
    data: isApproved,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-approval', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data?.is_approved || false;
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });

  return {
    isApproved: isApproved || false,
    isLoading: isLoading && !!user,
    error
  };
}