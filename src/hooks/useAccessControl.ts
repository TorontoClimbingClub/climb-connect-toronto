
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { errorLogger } from '@/utils/errorLogger';

export const useAccessControl = (requiredAccess: 'authenticated' | 'admin' | 'organizer' | 'public' = 'public') => {
  const { user, loading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [accessLoading, setAccessLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
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

      // Public access - always allow
      if (requiredAccess === 'public') {
        console.log('✅ Access Granted: Public route');
        setHasAccess(true);
        setAccessLoading(false);
        return;
      }

      // All other access levels require authentication
      if (!user) {
        const route = window.location.pathname;
        console.warn('❌ Access Denied: User not authenticated for route:', route);
        
        errorLogger.logAccessDenied(
          route,
          undefined,
          undefined,
          `Unauthenticated user attempted to access ${route}`
        );
        
        setHasAccess(false);
        setAccessLoading(false);
        return;
      }

      // For authenticated access, just being logged in is enough
      if (requiredAccess === 'authenticated') {
        console.log('✅ Access Granted: User authenticated');
        setHasAccess(true);
        setAccessLoading(false);
        return;
      }

      // For admin or organizer access, check user role
      try {
        console.log('🔍 Checking user role for:', user.id);
        const { data: role, error } = await supabase.rpc('get_user_role', { 
          _user_id: user.id 
        });

        if (error) {
          console.error('❌ Error checking user role:', error);
          setHasAccess(false);
          setAccessLoading(false);
          return;
        }

        setUserRole(role);
        console.log('👤 User role:', role, 'Required:', requiredAccess);

        let hasRequiredRole = false;
        
        if (requiredAccess === 'admin') {
          hasRequiredRole = role === 'admin';
        } else if (requiredAccess === 'organizer') {
          hasRequiredRole = role === 'admin' || role === 'organizer';
        }

        if (hasRequiredRole) {
          console.log('✅ Access Granted: User has required role');
          setHasAccess(true);
        } else {
          console.warn('❌ Access Denied: Insufficient permissions', {
            userRole: role,
            requiredAccess,
            route: window.location.pathname
          });
          
          errorLogger.logAccessDenied(
            window.location.pathname,
            user.id,
            role,
            `User with role '${role}' attempted to access ${requiredAccess} route`
          );
          
          setHasAccess(false);
        }
      } catch (error) {
        console.error('❌ Error during role check:', error);
        setHasAccess(false);
      }

      setAccessLoading(false);
    };

    checkAccess();
  }, [user, loading, requiredAccess]);

  return { hasAccess, accessLoading, userRole };
};
