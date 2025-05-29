
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export const useAccessControl = (requiredAccess: 'authenticated' | 'public' = 'public') => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      console.log('🔐 Access Control Check:', {
        userId: user?.id,
        userEmail: user?.email,
        requiredAccess,
        authLoading: loading,
        route: window.location.pathname
      });

      if (loading) {
        setAccessLoading(true);
        return;
      }

      if (requiredAccess === 'authenticated') {
        if (!user) {
          console.warn('❌ Access Denied: User not authenticated for route:', window.location.pathname);
          setHasAccess(false);
          toast({
            title: "Access Denied",
            description: "You need to be signed in to access this page.",
            variant: "destructive",
          });
        } else {
          console.log('✅ Access Granted: User authenticated');
          setHasAccess(true);
        }
      } else {
        // Public access - always allow
        console.log('✅ Access Granted: Public route');
        setHasAccess(true);
      }

      setAccessLoading(false);
    };

    checkAccess();
  }, [user, loading, requiredAccess, toast]);

  return { hasAccess, accessLoading };
};
