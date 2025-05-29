
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
        details: event.filename || 'Unknown source',
        stack: event.error?.stack,
        source: 'window.error'
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || 'Promise rejection';
      
      let errorType: 'access_denied' | 'auth_error' | 'general_error' | 'network_error' = 'general_error';
      if (errorMessage.includes('Access') || errorMessage.includes('access')) {
        errorType = 'access_denied';
      } else if (errorMessage.includes('JWT') || errorMessage.includes('session') || errorMessage.includes('auth')) {
        errorType = 'auth_error';
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
        errorType = 'network_error';
      }

      // Log the error instead of showing toast
      errorLogger.log({
        message: errorMessage,
        userId: user?.id,
        userEmail: user?.email,
        route: window.location.pathname,
        type: errorType,
        details: JSON.stringify(event.reason),
        stack: event.reason?.stack,
        source: 'promise.rejection'
      });
    };

    // Also capture fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          errorLogger.log({
            message: `HTTP ${response.status}: ${response.statusText}`,
            userId: user?.id,
            userEmail: user?.email,
            route: window.location.pathname,
            type: 'network_error',
            details: `URL: ${args[0]}`,
            source: 'fetch'
          });
        }
        return response;
      } catch (error: any) {
        errorLogger.log({
          message: `Fetch failed: ${error.message}`,
          userId: user?.id,
          userEmail: user?.email,
          route: window.location.pathname,
          type: 'network_error',
          details: `URL: ${args[0]}`,
          stack: error.stack,
          source: 'fetch'
        });
        throw error;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      // Restore original fetch
      window.fetch = originalFetch;
    };
  }, [user]);

  return null;
};
