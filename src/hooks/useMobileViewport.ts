import { useState, useEffect, useCallback } from 'react';

interface MobileViewportState {
  height: number;
  width: number;
  isKeyboardOpen: boolean;
  keyboardHeight: number;
  isPortrait: boolean;
  isMobile: boolean;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  visualViewport: {
    height: number;
    width: number;
    offsetTop: number;
    offsetLeft: number;
  } | null;
}

interface UseMobileViewportOptions {
  debounceMs?: number;
  keyboardThreshold?: number;
  updateCSSVariables?: boolean;
}

export function useMobileViewport({
  debounceMs = 100,
  keyboardThreshold = 150,
  updateCSSVariables = true
}: UseMobileViewportOptions = {}) {
  const [viewportState, setViewportState] = useState<MobileViewportState>(() => {
    const initialHeight = window.innerHeight;
    const initialWidth = window.innerWidth;
    
    return {
      height: initialHeight,
      width: initialWidth,
      isKeyboardOpen: false,
      keyboardHeight: 0,
      isPortrait: initialHeight > initialWidth,
      isMobile: isMobileDevice(),
      safeAreaInsets: getSafeAreaInsets(),
      visualViewport: getVisualViewportData()
    };
  });

  // Detect if device is mobile
  function isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
           window.innerWidth <= 768;
  }

  // Get safe area insets for iOS devices
  function getSafeAreaInsets() {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0', 10),
      bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
      left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0', 10),
      right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0', 10)
    };
  }

  // Get visual viewport data if available
  function getVisualViewportData() {
    if (!window.visualViewport) return null;
    
    return {
      height: window.visualViewport.height,
      width: window.visualViewport.width,
      offsetTop: window.visualViewport.offsetTop,
      offsetLeft: window.visualViewport.offsetLeft
    };
  }

  // Calculate viewport heights and keyboard state
  const calculateViewportState = useCallback((): MobileViewportState => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const visualViewport = getVisualViewportData();
    
    // Use visual viewport for more accurate keyboard detection
    const viewportHeight = visualViewport ? visualViewport.height : windowHeight;
    const viewportOffsetTop = visualViewport ? visualViewport.offsetTop : 0;
    
    // Calculate keyboard state
    const heightDifference = windowHeight - viewportHeight;
    const isKeyboardOpen = heightDifference > keyboardThreshold;
    const keyboardHeight = isKeyboardOpen ? heightDifference : 0;
    
    return {
      height: viewportHeight,
      width: windowWidth,
      isKeyboardOpen,
      keyboardHeight,
      isPortrait: windowHeight > windowWidth,
      isMobile: isMobileDevice(),
      safeAreaInsets: getSafeAreaInsets(),
      visualViewport
    };
  }, [keyboardThreshold]);

  // Update CSS custom properties
  const updateCSSProperties = useCallback((state: MobileViewportState) => {
    if (!updateCSSVariables) return;

    const root = document.documentElement;
    
    // Update viewport height variables
    const vh = state.height * 0.01;
    root.style.setProperty('--vh', `${vh}px`);
    root.style.setProperty('--mobile-vh', `${vh}px`);
    
    // Update keyboard height
    root.style.setProperty('--keyboard-height', `${state.keyboardHeight}px`);
    
    // Update safe area insets (for iOS)
    root.style.setProperty('--safe-area-inset-top', `${state.safeAreaInsets.top}px`);
    root.style.setProperty('--safe-area-inset-bottom', `${state.safeAreaInsets.bottom}px`);
    root.style.setProperty('--safe-area-inset-left', `${state.safeAreaInsets.left}px`);
    root.style.setProperty('--safe-area-inset-right', `${state.safeAreaInsets.right}px`);
    
    // Update viewport dimensions
    root.style.setProperty('--viewport-width', `${state.width}px`);
    root.style.setProperty('--viewport-height', `${state.height}px`);
    
    // Debug log for mobile testing
    if (state.isMobile && process.env.NODE_ENV === 'development') {
      console.log('Mobile viewport update:', {
        height: state.height,
        keyboardOpen: state.isKeyboardOpen,
        keyboardHeight: state.keyboardHeight,
        safeAreaBottom: state.safeAreaInsets.bottom
      });
    }
  }, [updateCSSVariables]);

  // Debounced update function
  const debouncedUpdate = useCallback(() => {
    const newState = calculateViewportState();
    setViewportState(newState);
    updateCSSProperties(newState);
  }, [calculateViewportState, updateCSSProperties]);

  // Setup event listeners
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleViewportChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(debouncedUpdate, debounceMs);
    };

    // Initial update
    debouncedUpdate();

    // Window resize event
    window.addEventListener('resize', handleViewportChange, { passive: true });
    
    // Orientation change event
    window.addEventListener('orientationchange', () => {
      // Delay to ensure the viewport has updated
      setTimeout(handleViewportChange, 100);
    }, { passive: true });

    // Visual viewport events (modern browsers)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange, { passive: true });
      window.visualViewport.addEventListener('scroll', handleViewportChange, { passive: true });
    }

    // Focus/blur events for input detection
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        // Delay to ensure keyboard is shown
        setTimeout(handleViewportChange, 300);
      }
    };

    const handleFocusOut = () => {
      // Delay to ensure keyboard is hidden
      setTimeout(handleViewportChange, 300);
    };

    document.addEventListener('focusin', handleFocusIn, { passive: true });
    document.addEventListener('focusout', handleFocusOut, { passive: true });

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
      
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [debouncedUpdate, debounceMs]);

  // Utility functions
  const getViewportHeight = useCallback((includeKeyboard = false) => {
    return includeKeyboard ? viewportState.height + viewportState.keyboardHeight : viewportState.height;
  }, [viewportState.height, viewportState.keyboardHeight]);

  const getChatContainerHeight = useCallback(() => {
    const inputHeight = 80; // Approximate input height
    const safeArea = viewportState.safeAreaInsets.bottom;
    return viewportState.height - inputHeight - safeArea;
  }, [viewportState.height, viewportState.safeAreaInsets.bottom]);

  const isLandscapePhone = useCallback(() => {
    return viewportState.isMobile && !viewportState.isPortrait && viewportState.width < 900;
  }, [viewportState.isMobile, viewportState.isPortrait, viewportState.width]);

  return {
    ...viewportState,
    getViewportHeight,
    getChatContainerHeight,
    isLandscapePhone,
    updateViewport: debouncedUpdate
  };
}

// Hook for chat-specific viewport management
export function useChatViewport(options: UseMobileViewportOptions = {}) {
  const viewport = useMobileViewport({
    keyboardThreshold: 150,
    updateCSSVariables: true,
    ...options
  });

  // Layout dimensions
  const navbarHeight = 64; // Navigation header height (h-16)
  const chatHeaderHeight = 72; // Chat component header height
  const chatInputHeight = 80; // Chat input area height
  
  // Calculate available height accounting for navbar
  const totalHeaderHeight = navbarHeight + chatHeaderHeight;
  const availableHeight = viewport.height - totalHeaderHeight - chatInputHeight - viewport.safeAreaInsets.bottom;
  const messagesHeight = Math.max(availableHeight, 200); // Minimum height

  // For fullscreen chats, account for navbar
  const containerHeight = viewport.height - navbarHeight;
  const messagesHeightWithNav = containerHeight - chatHeaderHeight - chatInputHeight - viewport.safeAreaInsets.bottom;

  const shouldUseFixedInput = viewport.isMobile || viewport.isKeyboardOpen;
  const inputPosition = shouldUseFixedInput ? 'fixed' : 'sticky';

  return {
    ...viewport,
    navbarHeight,
    chatHeaderHeight,
    chatInputHeight,
    messagesHeight,
    messagesHeightWithNav: Math.max(messagesHeightWithNav, 200),
    availableHeight,
    containerHeight,
    shouldUseFixedInput,
    inputPosition
  };
}