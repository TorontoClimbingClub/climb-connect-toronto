
import { SupabaseError, ApiError } from '@/types';

export const createApiError = (message: string, code?: string, details?: string): ApiError => ({
  message,
  code,
  details,
});

export const handleSupabaseError = (error: SupabaseError): ApiError => {
  console.error('Supabase error:', error);
  
  return {
    message: error.message || 'An unexpected error occurred',
    code: error.code,
    details: error.details || error.hint,
  };
};

export const handleGenericError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      details: error.stack,
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }
  
  return {
    message: 'An unknown error occurred',
    details: JSON.stringify(error),
  };
};

export const logError = (context: string, error: unknown) => {
  console.error(`[${context}]`, error);
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error, { tags: { context } });
  }
};
