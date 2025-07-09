/**
 * Optimized Layout State Hook
 * 
 * Provides SSR-safe layout state management with minimal re-renders
 * and smooth transitions between mobile and desktop layouts.
 */

import { useState, useEffect, useMemo } from 'react';
import { BREAKPOINTS } from '@/utils/responsive';

interface LayoutState {
  isDesktop: boolean;
  isMobile: boolean;
  isHydrated: boolean;
  screenWidth: number;
}

/**
 * Main hook for layout state management
 * Handles SSR hydration and provides stable layout detection
 */
export const useLayoutState = (): LayoutState => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    // Single effect for hydration and initial state
    setScreenWidth(window.innerWidth);
    setIsHydrated(true);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return useMemo(() => ({
    isDesktop: screenWidth >= BREAKPOINTS.DESKTOP,
    isMobile: screenWidth < BREAKPOINTS.DESKTOP,
    isHydrated,
    screenWidth,
  }), [screenWidth, isHydrated]);
};

/**
 * Hook for determining if desktop layout should be used
 * Combines screen size with explicit desktop layout preference
 */
export const useShouldUseDesktopLayout = (useDesktopLayout: boolean = false): boolean => {
  const { isDesktop, isHydrated } = useLayoutState();
  
  return useMemo(() => {
    if (!isHydrated) return false;
    return useDesktopLayout && isDesktop;
  }, [useDesktopLayout, isDesktop, isHydrated]);
};