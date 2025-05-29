
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const ErrorMonitor = () => {
  const { user } = useAuth();

  const logError = useCallback((type: string, message: string, details?: any) => {
    console.error(`[${type.toUpperCase()}]`, message, details || '');
  }, []);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || 'Unknown error';
      
      logError('window_error', errorMessage, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        userId: user?.id,
        userEmail: user?.email,
        route: window.location.pathname
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || 'Promise rejection';
      
      logError('promise_rejection', errorMessage, {
        reason: event.reason,
        userId: user?.id,
        userEmail: user?.email,
        route: window.location.pathname
      });
    };

    // Enhanced fetch wrapper with better error logging
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          logError('fetch_error', `HTTP ${response.status}: ${response.statusText}`, {
            url: args[0],
            status: response.status,
            statusText: response.statusText,
            userId: user?.id,
            userEmail: user?.email,
            route: window.location.pathname
          });
        }
        return response;
      } catch (error: any) {
        logError('fetch_exception', `Fetch failed: ${error.message}`, {
          url: args[0],
          error: error.message,
          stack: error.stack,
          userId: user?.id,
          userEmail: user?.email,
          route: window.location.pathname
        });
        throw error;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.fetch = originalFetch;
    };
  }, [user, logError]);

  return null;
};
