/**
 * Centralized Responsive Utilities for Climb Connect Toronto
 * 
 * This file contains all breakpoint constants and responsive utilities used throughout
 * the application to ensure consistent behavior across desktop and mobile experiences.
 */

// ===== BREAKPOINT CONSTANTS =====
export const BREAKPOINTS = {
  // Primary breakpoint for desktop/mobile switching
  DESKTOP: 768, // md breakpoint - tablet and up get desktop experience
  
  // Tailwind breakpoints for reference
  SM: 640,
  MD: 768,   // Primary desktop threshold
  LG: 1024,  // Large desktop
  XL: 1280,  // Extra large desktop
  '2XL': 1536, // 2x extra large desktop
} as const;

// ===== RESPONSIVE DETECTION UTILITIES =====

/**
 * Check if current screen width is desktop (>=768px)
 * This is the primary function used throughout the app for responsive logic
 */
export const isDesktopScreen = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS.DESKTOP;
};

/**
 * Check if current screen width is mobile (<768px)
 */
export const isMobileScreen = (): boolean => {
  if (typeof window === 'undefined') return true; // SSR fallback to mobile
  return window.innerWidth < BREAKPOINTS.DESKTOP;
};

/**
 * Get current screen size category
 */
export const getScreenSize = (): 'mobile' | 'tablet' | 'desktop' | 'large' => {
  if (typeof window === 'undefined') return 'mobile';
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.MD) return 'mobile';
  if (width < BREAKPOINTS.LG) return 'tablet';
  if (width < BREAKPOINTS.XL) return 'desktop';
  return 'large';
};

// ===== RESPONSIVE HOOK UTILITIES =====

/**
 * Create responsive event listener for screen size changes
 * Used by components that need to track responsive state
 */
export const createResponsiveListener = (callback: (isDesktop: boolean) => void) => {
  const handleResize = () => {
    callback(isDesktopScreen());
  };
  
  // Set initial state
  handleResize();
  
  // Add listener
  window.addEventListener('resize', handleResize);
  
  // Return cleanup function
  return () => window.removeEventListener('resize', handleResize);
};

// ===== CSS CLASS UTILITIES =====

/**
 * Standard responsive CSS classes used throughout the app
 */
export const RESPONSIVE_CLASSES = {
  // Layout visibility
  DESKTOP_ONLY: 'hidden md:block',
  MOBILE_ONLY: 'block md:hidden',
  
  // Navigation responsive text
  NAV_TEXT_RESPONSIVE: 'hidden lg:block', // Full text on large screens
  NAV_TEXT_SHORT: 'hidden md:block lg:hidden', // Short text on medium screens
  
  // Grid layouts
  MOBILE_GRID: 'grid-cols-1',
  TABLET_GRID: 'md:grid-cols-2',
  DESKTOP_GRID: 'lg:grid-cols-3',
  LARGE_GRID: 'xl:grid-cols-4',
  
  // Common responsive patterns
  RESPONSIVE_GRID: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  RESPONSIVE_PADDING: 'px-4 sm:px-6 lg:px-8',
  RESPONSIVE_TEXT: 'text-sm md:text-base lg:text-lg',
  
  // Container sizes
  CONTAINER_MOBILE: 'max-w-full',
  CONTAINER_DESKTOP: 'max-w-7xl mx-auto',
} as const;

// ===== COMPONENT BEHAVIOR CONSTANTS =====

/**
 * Component categorization for architecture documentation
 */
export const COMPONENT_CATEGORIES = {
  DESKTOP_ONLY: 'desktop-only',      // Never renders on mobile
  MOBILE_ONLY: 'mobile-only',        // Never renders on desktop  
  RESPONSIVE: 'responsive',          // Adapts behavior based on screen size
  SHARED: 'shared',                  // Same behavior on both platforms
  LAYOUT_CONTROLLED: 'layout-controlled', // Behavior determined by parent layout
  FULLSCREEN_CHAT: 'fullscreen-chat', // Chat components with fullscreen behavior
} as const;

/**
 * Layout types used in the application
 */
export const LAYOUT_TYPES = {
  MOBILE: 'mobile',           // Traditional mobile-first layout with navbar
  DESKTOP: 'desktop',         // Desktop multi-panel layout with sidebar
  FULLSCREEN: 'fullscreen',   // Fullscreen chat interface
  TWO_PANEL: 'two-panel',     // Sidebar + main content
  THREE_PANEL: 'three-panel', // Sidebar + main + context panel
  FOUR_PANEL: 'four-panel',   // All panels visible
} as const;

// ===== ARCHITECTURE HELPER FUNCTIONS =====

/**
 * Determine if a component should use desktop layout
 */
export const shouldUseDesktopLayout = (forceDesktop?: boolean): boolean => {
  if (forceDesktop !== undefined) return forceDesktop;
  return isDesktopScreen();
};

/**
 * Get appropriate layout type based on screen size and preferences
 */
export const getRecommendedLayoutType = (
  preferredType?: keyof typeof LAYOUT_TYPES,
  screenSize?: ReturnType<typeof getScreenSize>
): string => {
  const size = screenSize || getScreenSize();
  
  if (preferredType === 'FULLSCREEN') return LAYOUT_TYPES.FULLSCREEN;
  
  switch (size) {
    case 'mobile':
      return LAYOUT_TYPES.MOBILE;
    case 'tablet':
      return preferredType === 'THREE_PANEL' ? LAYOUT_TYPES.TWO_PANEL : LAYOUT_TYPES.TWO_PANEL;
    case 'desktop':
      return preferredType || LAYOUT_TYPES.THREE_PANEL;
    case 'large':
      return preferredType || LAYOUT_TYPES.THREE_PANEL;
    default:
      return LAYOUT_TYPES.MOBILE;
  }
};

// ===== COMPONENT CATEGORIZATION MAP =====

/**
 * Complete categorization of all components in the application
 * Used for architecture documentation and development guidance
 */
export const COMPONENT_ARCHITECTURE_MAP = {
  // Desktop-only components
  [COMPONENT_CATEGORIES.DESKTOP_ONLY]: [
    'DesktopSidebar.tsx',
    'GlobalSearch.tsx',
  ],
  
  // Mobile-only components
  [COMPONENT_CATEGORIES.MOBILE_ONLY]: [
    'NavBar.tsx (mobile menu)',
  ],
  
  // Responsive components  
  [COMPONENT_CATEGORIES.RESPONSIVE]: [
    'Layout.tsx',
    'Home.tsx',
    'NavBar.tsx',
    'MultiPanelLayout.tsx',
  ],
  
  // Layout-controlled components
  [COMPONENT_CATEGORIES.LAYOUT_CONTROLLED]: [
    'Dashboard.tsx',
    'Events.tsx', 
    'Groups.tsx',
  ],
  
  // Shared components
  [COMPONENT_CATEGORIES.SHARED]: [
    'Auth.tsx',
    'Profile.tsx',
    'Administrator.tsx',
    'Community.tsx',
    'CreateEventModal.tsx',
  ],
  
  // Fullscreen chat components
  [COMPONENT_CATEGORIES.FULLSCREEN_CHAT]: [
    'ClubTalk.tsx',
    'EventChat.tsx',
    'GroupChat.tsx',
    'group-chat.tsx',
  ],
} as const;

// ===== DEVELOPMENT HELPERS =====

/**
 * Debug function to log current responsive state
 * Useful during development to understand screen size detection
 */
export const debugResponsiveState = () => {
  if (typeof window === 'undefined') {
    console.log('Responsive Debug: Running in SSR environment');
    return;
  }
  
  console.log('Responsive Debug:', {
    windowWidth: window.innerWidth,
    isDesktop: isDesktopScreen(),
    isMobile: isMobileScreen(),
    screenSize: getScreenSize(),
    breakpoints: BREAKPOINTS,
  });
};

/**
 * Validate that a component is properly categorized
 */
export const validateComponentCategory = (
  componentName: string,
  expectedCategory: keyof typeof COMPONENT_CATEGORIES
): boolean => {
  const categoryComponents = COMPONENT_ARCHITECTURE_MAP[expectedCategory];
  return categoryComponents.some(comp => 
    comp.toLowerCase().includes(componentName.toLowerCase())
  );
};