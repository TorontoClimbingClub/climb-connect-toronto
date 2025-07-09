import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30000, // 30 seconds
        gcTime: 300000, // 5 minutes
        retry: (failureCount, error: any) => {
          // Don't retry on auth errors
          if (error?.message?.includes('auth') || error?.code === 'PGRST301') {
            return false;
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}