
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { errorLogger } from '@/utils/errorLogger';

export const ErrorMonitor = () => {
  const { user } = useAuth();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || 'Unknown error';
      
      // Determine error type
      let errorType: 'access_denied' | 'auth_error' | 'general_error' = 'general_error';
      if (errorMessage.includes('Access') || errorMessage.includes('access')) {
        errorType = 'access_denied';
      } else if (errorMessage.includes('JWT') || errorMessage.includes('session') || errorMessage.includes('auth')) {
        errorType = 'auth_error';
      }

      // Log the error instead of showing toast
      errorLogger.log({
        message: errorMessage,
        userId: user?.id,
        userEmail: user?.email,
        route: window.location.pathname,
        type: errorType,
        details: event.filename || 'Unknown source'
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || 'Promise rejection';
      
      let errorType: 'access_denied' | 'auth_error' | 'general_error' = 'general_error';
      if (errorMessage.includes('Access') || errorMessage.includes('access')) {
        errorType = 'access_denied';
      } else if (errorMessage.includes('JWT') || errorMessage.includes('session') || errorMessage.includes('auth')) {
        errorType = 'auth_error';
      }

      // Log the error instead of showing toast
      errorLogger.log({
        message: errorMessage,
        userId: user?.id,
        userEmail: user?.email,
        route: window.location.pathname,
        type: errorType,
        details: JSON.stringify(event.reason)
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [user]);

  return null;
};
