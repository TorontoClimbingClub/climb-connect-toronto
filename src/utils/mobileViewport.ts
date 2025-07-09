/**
 * Mobile Viewport Utility
 * Handles Visual Viewport API for mobile browser navigation and virtual keyboard
 */
import { useState, useEffect } from 'react';

interface ViewportState {
  isKeyboardOpen: boolean;
  browserUIHeight: number;
  visualViewportHeight: number;
  layoutViewportHeight: number;
  isMobile: boolean;
}

type ViewportChangeCallback = (state: ViewportState) => void;

class MobileViewportManager {
  private callbacks: Set<ViewportChangeCallback> = new Set();
  private state: ViewportState = {
    isKeyboardOpen: false,
    browserUIHeight: 0,
    visualViewportHeight: 0,
    layoutViewportHeight: 0,
    isMobile: false
  };

  constructor() {
    this.init();
  }

  private init(): void {
    // Check if we're on mobile
    this.state.isMobile = this.detectMobile();
    
    if (!this.state.isMobile || typeof window === 'undefined') {
      return;
    }

    // Initialize viewport state
    this.updateViewportState();

    // Set up Visual Viewport API listeners
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.handleViewportChange);
      window.visualViewport.addEventListener('scroll', this.handleViewportChange);
    }

    // Fallback for browsers without Visual Viewport API
    window.addEventListener('resize', this.handleViewportChange);
    window.addEventListener('orientationchange', this.handleOrientationChange);
  }

  private detectMobile(): boolean {
    // Check for mobile device and screen size
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isMobileScreen = window.innerWidth <= 768;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobileDevice || (isMobileScreen && hasTouchScreen);
  }

  private handleViewportChange = (): void => {
    this.updateViewportState();
    this.notifyCallbacks();
  };

  private handleOrientationChange = (): void => {
    // Add a small delay to handle orientation change properly
    setTimeout(() => {
      this.updateViewportState();
      this.notifyCallbacks();
    }, 100);
  };

  private updateViewportState(): void {
    const layoutHeight = window.innerHeight;
    const visualHeight = window.visualViewport?.height || layoutHeight;
    
    // Calculate browser UI height (difference between layout and visual viewport)
    const browserUIHeight = layoutHeight - visualHeight;
    
    // Determine if virtual keyboard is open
    // Keyboard is considered open if visual viewport is significantly smaller than layout viewport
    const keyboardThreshold = layoutHeight * 0.25; // 25% of screen height
    const isKeyboardOpen = browserUIHeight > keyboardThreshold;

    this.state = {
      isKeyboardOpen,
      browserUIHeight,
      visualViewportHeight: visualHeight,
      layoutViewportHeight: layoutHeight,
      isMobile: this.state.isMobile
    };
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback(this.state));
  }

  public subscribe(callback: ViewportChangeCallback): () => void {
    this.callbacks.add(callback);
    
    // Immediately call with current state
    callback(this.state);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  public getState(): ViewportState {
    return { ...this.state };
  }

  public destroy(): void {
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', this.handleViewportChange);
      window.visualViewport.removeEventListener('scroll', this.handleViewportChange);
    }
    
    window.removeEventListener('resize', this.handleViewportChange);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    
    this.callbacks.clear();
  }
}

// Singleton instance
export const mobileViewportManager = new MobileViewportManager();

// React hook for using viewport state
export function useMobileViewport(): ViewportState {
  const [state, setState] = useState<ViewportState>(mobileViewportManager.getState());

  useEffect(() => {
    const unsubscribe = mobileViewportManager.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
}

// Utility function to apply chat input positioning
export function applyChatInputPosition(element: HTMLElement, state: ViewportState): void {
  if (!state.isMobile) {
    // Desktop: Use standard sticky positioning
    element.style.position = 'sticky';
    element.style.bottom = '0';
    element.style.transform = 'translateY(0)';
    return;
  }

  if (state.isKeyboardOpen) {
    // Mobile with keyboard: Fix position and move above keyboard
    element.style.position = 'fixed';
    element.style.bottom = '0';
    element.style.transform = `translateY(-${state.browserUIHeight}px)`;
  } else {
    // Mobile without keyboard: Use sticky with safe area padding
    element.style.position = 'sticky';
    element.style.bottom = '0';
    element.style.transform = 'translateY(0)';
  }
}

// CSS custom properties updater
export function updateCSSCustomProperties(state: ViewportState): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  root.style.setProperty('--mobile-keyboard-height', `${state.isKeyboardOpen ? state.browserUIHeight : 0}px`);
  root.style.setProperty('--mobile-browser-ui-height', `${state.browserUIHeight}px`);
  root.style.setProperty('--visual-viewport-height', `${state.visualViewportHeight}px`);
  root.style.setProperty('--layout-viewport-height', `${state.layoutViewportHeight}px`);
  root.style.setProperty('--is-mobile', state.isMobile ? '1' : '0');
  root.style.setProperty('--is-keyboard-open', state.isKeyboardOpen ? '1' : '0');
}

// Initialize CSS custom properties on module load
if (typeof window !== 'undefined') {
  mobileViewportManager.subscribe(updateCSSCustomProperties);
}