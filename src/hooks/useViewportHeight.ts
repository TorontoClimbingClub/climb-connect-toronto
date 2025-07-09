import { useEffect, useState } from 'react';

/**
 * Simple, robust viewport height hook that works reliably across browsers
 * This captures the actual visible height, accounting for mobile keyboards and navigation bars
 */
export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(() => {
    // Safe initialization for SSR
    if (typeof window === 'undefined') return 0;
    return window.innerHeight;
  });

  useEffect(() => {
    // Skip if we're in SSR
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      // This captures the actual visible height
      setViewportHeight(window.innerHeight);
    };

    // Initial set
    handleResize();

    // Listen for any resize (includes keyboard open/close)
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Some browsers need a small delay after orientation change
    const handleOrientationChange = () => {
      setTimeout(handleResize, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return viewportHeight;
}