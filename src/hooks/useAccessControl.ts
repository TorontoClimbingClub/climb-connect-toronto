
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export const useAccessControl = (requiredAccess: 'authenticated' | 'public' = 'public') => {
  const { user, loading } = useAuth();
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
  }, [user, loading, requiredAccess]);

  return { hasAccess, accessLoading };
};
