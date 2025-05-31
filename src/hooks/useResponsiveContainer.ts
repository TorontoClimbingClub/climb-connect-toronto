
import { useMemo } from 'react';

type ContainerVariant = 'narrow' | 'medium' | 'wide' | 'full';

interface ResponsiveContainerConfig {
  containerClass: string;
  paddingClass: string;
}

export const useResponsiveContainer = (variant: ContainerVariant = 'medium'): ResponsiveContainerConfig => {
  return useMemo(() => {
    const configs: Record<ContainerVariant, ResponsiveContainerConfig> = {
      narrow: {
        containerClass: 'max-w-md mx-auto',
        paddingClass: 'p-4'
      },
      medium: {
        containerClass: 'max-w-2xl mx-auto',
        paddingClass: 'p-4 sm:p-6'
      },
      wide: {
        containerClass: 'max-w-4xl mx-auto',
        paddingClass: 'p-4 sm:p-6 lg:p-8'
      },
      full: {
        containerClass: 'max-w-6xl mx-auto',
        paddingClass: 'p-2 sm:p-4'
      }
    };

    return configs[variant];
  }, [variant]);
};
