/**
 * Responsive Hooks for Climb Connect Toronto
 * 
 * Custom React hooks for managing responsive behavior consistently across
 * the desktop/mobile dual architecture.
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  isDesktopScreen, 
  isMobileScreen, 
  getScreenSize, 
  createResponsiveListener,
  BREAKPOINTS 
} from '@/utils/responsive';

// ===== BASIC RESPONSIVE HOOKS =====

/**
 * Hook to track if screen is desktop size (>=768px)
 * This is the primary hook used throughout the app
 */
export const useIsDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState(() => isDesktopScreen());

  useEffect(() => {
    return createResponsiveListener(setIsDesktop);
  }, []);

  return isDesktop;
};

/**
 * Hook to track if screen is mobile size (<768px)
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() => isMobileScreen());

  useEffect(() => {
    return createResponsiveListener((isDesktop) => setIsMobile(!isDesktop));
  }, []);

  return isMobile;
};

/**
 * Hook to track current screen size category
 */
export const useScreenSize = (): 'mobile' | 'tablet' | 'desktop' | 'large' => {
  const [screenSize, setScreenSize] = useState(() => getScreenSize());

  useEffect(() => {
    const handleResize = () => setScreenSize(getScreenSize());
    handleResize(); // Set initial state
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// ===== LAYOUT-SPECIFIC HOOKS =====

/**
 * Hook to determine if component should use desktop layout
 * Combines screen size detection with optional override
 */
export const useDesktopLayout = (forceDesktop?: boolean): boolean => {
  const isDesktop = useIsDesktop();
  
  return useMemo(() => {
    if (forceDesktop !== undefined) return forceDesktop;
    return isDesktop;
  }, [isDesktop, forceDesktop]);
};

/**
 * Hook for responsive layout configuration
 * Returns layout settings based on current screen size
 */
export const useResponsiveLayout = () => {
  const isDesktop = useIsDesktop();
  const screenSize = useScreenSize();

  return useMemo(() => ({
    isDesktop,
    isMobile: !isDesktop,
    screenSize,
    shouldShowSidebar: isDesktop,
    shouldShowNavbar: !isDesktop,
    layoutType: isDesktop ? 'desktop' : 'mobile',
    panelCount: screenSize === 'large' ? 3 : screenSize === 'desktop' ? 3 : screenSize === 'tablet' ? 2 : 1,
  }), [isDesktop, screenSize]);
};

// ===== NAVIGATION-SPECIFIC HOOKS =====

/**
 * Hook for responsive navigation behavior
 * Handles sidebar vs navbar visibility logic
 */
export const useResponsiveNavigation = () => {
  const isDesktop = useIsDesktop();
  const screenSize = useScreenSize();

  return useMemo(() => ({
    showSidebar: isDesktop,
    showNavbar: !isDesktop,
    showFullNavText: screenSize === 'large' || screenSize === 'desktop',
    showShortNavText: screenSize === 'tablet',
    useHamburgerMenu: !isDesktop,
  }), [isDesktop, screenSize]);
};

// ===== CONTENT-SPECIFIC HOOKS =====

/**
 * Hook for responsive grid layouts
 * Returns appropriate grid classes based on screen size
 */
export const useResponsiveGrid = (options?: {
  mobileColumns?: number;
  tabletColumns?: number;
  desktopColumns?: number;
  largeColumns?: number;
}) => {
  const screenSize = useScreenSize();
  
  const {
    mobileColumns = 1,
    tabletColumns = 2,
    desktopColumns = 3,
    largeColumns = 4,
  } = options || {};

  return useMemo(() => {
    const getGridClass = (columns: number) => `grid-cols-${columns}`;
    
    switch (screenSize) {
      case 'mobile':
        return getGridClass(mobileColumns);
      case 'tablet':
        return getGridClass(tabletColumns);
      case 'desktop':
        return getGridClass(desktopColumns);
      case 'large':
        return getGridClass(largeColumns);
      default:
        return getGridClass(mobileColumns);
    }
  }, [screenSize, mobileColumns, tabletColumns, desktopColumns, largeColumns]);
};

/**
 * Hook for responsive text sizing
 */
export const useResponsiveText = () => {
  const screenSize = useScreenSize();

  return useMemo(() => ({
    bodyText: screenSize === 'mobile' ? 'text-sm' : 'text-base',
    headingText: screenSize === 'mobile' ? 'text-xl' : screenSize === 'tablet' ? 'text-2xl' : 'text-3xl',
    buttonText: screenSize === 'mobile' ? 'text-xs' : 'text-sm',
  }), [screenSize]);
};

// ===== COMPONENT-SPECIFIC HOOKS =====

/**
 * Hook for chat component responsive behavior
 * Handles fullscreen chat optimization
 */
export const useChatResponsive = () => {
  const isDesktop = useIsDesktop();
  const screenSize = useScreenSize();

  return useMemo(() => ({
    isFullscreen: true, // Chat is always fullscreen in current architecture
    headerCompact: !isDesktop,
    showBackButton: !isDesktop,
    inputPosition: 'bottom',
    messageSpacing: isDesktop ? 'comfortable' : 'compact',
  }), [isDesktop, screenSize]);
};

/**
 * Hook for modal/dialog responsive behavior
 */
export const useModalResponsive = () => {
  const isDesktop = useIsDesktop();
  const screenSize = useScreenSize();

  return useMemo(() => ({
    maxWidth: isDesktop ? 'lg' : 'full',
    position: isDesktop ? 'center' : 'bottom',
    padding: isDesktop ? 'lg' : 'sm',
    closeButton: isDesktop ? 'top-right' : 'header',
  }), [isDesktop, screenSize]);
};

// ===== UTILITY HOOKS =====

/**
 * Hook to get current breakpoint information
 */
export const useBreakpoint = () => {
  const screenSize = useScreenSize();
  const isDesktop = useIsDesktop();

  return useMemo(() => ({
    current: screenSize,
    isDesktop,
    isMobile: !isDesktop,
    breakpoints: BREAKPOINTS,
    above: (breakpoint: keyof typeof BREAKPOINTS) => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth >= BREAKPOINTS[breakpoint];
    },
    below: (breakpoint: keyof typeof BREAKPOINTS) => {
      if (typeof window === 'undefined') return true;
      return window.innerWidth < BREAKPOINTS[breakpoint];
    },
  }), [screenSize, isDesktop]);
};

/**
 * Hook for responsive component visibility
 * Handles showing/hiding components based on screen size
 */
export const useResponsiveVisibility = () => {
  const isDesktop = useIsDesktop();
  const screenSize = useScreenSize();

  return useMemo(() => ({
    desktopOnly: isDesktop,
    mobileOnly: !isDesktop,
    tabletUp: screenSize !== 'mobile',
    desktopUp: isDesktop,
    largeUp: screenSize === 'large',
  }), [isDesktop, screenSize]);
};

// ===== DEBUGGING HOOK =====

/**
 * Hook for debugging responsive behavior in development
 */
export const useResponsiveDebug = (componentName?: string) => {
  const isDesktop = useIsDesktop();
  const screenSize = useScreenSize();
  const breakpoint = useBreakpoint();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && componentName) {
      console.log(`[${componentName}] Responsive Debug:`, {
        isDesktop,
        screenSize,
        windowWidth: window.innerWidth,
        breakpoint: breakpoint.current,
      });
    }
  }, [isDesktop, screenSize, componentName, breakpoint.current]);

  return {
    isDesktop,
    screenSize,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    breakpoint: breakpoint.current,
  };
};