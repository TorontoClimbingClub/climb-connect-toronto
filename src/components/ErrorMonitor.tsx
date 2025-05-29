
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ErrorInfo {
  error: Error;
  errorInfo: React.ErrorInfo;
  userId?: string;
  route?: string;
  timestamp: string;
}

export const ErrorMonitor = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        error: new Error(event.message),
        errorInfo: { componentStack: event.filename || 'Unknown' } as React.ErrorInfo,
        userId: user?.id,
        route: window.location.pathname,
        timestamp: new Date().toISOString()
      };

      console.error('🚨 Error Monitor - Caught error:', errorInfo);
      
      // Log to console for debugging
      console.group('🔍 Error Details');
      console.log('User ID:', user?.id);
      console.log('User Email:', user?.email);
      console.log('Route:', window.location.pathname);
      console.log('Error:', event.message);
      console.log('Timestamp:', errorInfo.timestamp);
      console.groupEnd();

      // Show user-friendly toast for access errors
      if (event.message?.includes('Access Denied') || event.message?.includes('permission')) {
        toast({
          title: "Access Error",
          description: "You don't have permission to access this page. Please check your account status.",
          variant: "destructive",
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled Promise Rejection:', {
        reason: event.reason,
        userId: user?.id,
        route: window.location.pathname,
        timestamp: new Date().toISOString()
      });

      if (event.reason?.message?.includes('JWT') || event.reason?.message?.includes('session')) {
        toast({
          title: "Session Error",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [user, toast]);

  return null;
};
