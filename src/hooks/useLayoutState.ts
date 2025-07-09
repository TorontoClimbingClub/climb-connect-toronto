/**
 * SSR-Safe Layout State Hook
 * 
 * Prevents layout shift by using CSS-first responsive design
 * and stable hydration patterns.
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
 * Uses CSS-first approach to prevent hydration mismatches
 */
export const useLayoutState = (): LayoutState => {
  // Start with mobile-first assumption (SSR-safe)
  const [isHydrated, setIsHydrated] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    // Only run on client side
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial state and mark as hydrated
    setScreenWidth(window.innerWidth);
    setIsHydrated(true);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return useMemo(() => ({
    isDesktop: isHydrated && screenWidth >= BREAKPOINTS.DESKTOP,
    isMobile: !isHydrated || screenWidth < BREAKPOINTS.DESKTOP,
    isHydrated,
    screenWidth,
  }), [screenWidth, isHydrated]);
};

/**
 * Hook for determining if desktop layout should be used
 * Always returns false during SSR to prevent hydration mismatches
 */
export const useShouldUseDesktopLayout = (useDesktopLayout: boolean = false): boolean => {
  const { isDesktop, isHydrated } = useLayoutState();
  
  return useMemo(() => {
    // Always return false during SSR/before hydration
    if (!isHydrated) return false;
    return useDesktopLayout && isDesktop;
  }, [useDesktopLayout, isDesktop, isHydrated]);
};