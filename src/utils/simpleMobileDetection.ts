/**
 * Simple Mobile Detection Utility
 * Provides reliable mobile browser detection and basic viewport handling
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Multiple detection methods for reliability
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isSmallScreen = window.innerWidth <= 768;
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return isMobileUserAgent || (isSmallScreen && hasTouchScreen);
}

export function isChromeOnMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isChrome = /chrome/.test(userAgent) && !/edge|edg/.test(userAgent);
  const isMobile = isMobileDevice();
  
  return isChrome && isMobile;
}

export function addMobileChatInputSpacing(): void {
  if (typeof document === 'undefined') return;
  
  // Wait for DOM to be ready
  const applySpacing = () => {
    const chatInputs = document.querySelectorAll('.chat-input-mobile');
    
    chatInputs.forEach((element) => {
      const htmlElement = element as HTMLElement;
      
      if (isMobileDevice()) {
        // Apply mobile-specific styling
        htmlElement.style.paddingBottom = '100px';
        htmlElement.style.marginBottom = '20px';
        
        if (isChromeOnMobile()) {
          // Extra padding for Chrome mobile
          htmlElement.style.paddingBottom = '120px';
        }
        
        // Ensure sticky positioning works
        htmlElement.style.position = 'sticky';
        htmlElement.style.bottom = '0';
        htmlElement.style.zIndex = '1000';
        htmlElement.style.backgroundColor = 'white';
        
        // Add data attribute for CSS targeting
        htmlElement.setAttribute('data-mobile-enhanced', 'true');
      } else {
        // Desktop - remove mobile-specific styles
        htmlElement.style.paddingBottom = '';
        htmlElement.style.marginBottom = '';
        htmlElement.removeAttribute('data-mobile-enhanced');
      }
    });
  };
  
  // Apply immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySpacing);
  } else {
    applySpacing();
  }
  
  // Reapply on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(applySpacing, 100);
  });
  
  // Reapply on resize (for good measure)
  window.addEventListener('resize', applySpacing);
}

// React hook for simple mobile detection
import { useState, useEffect } from 'react';

export function useSimpleMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isChrome, setIsChrome] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
      setIsChrome(isChromeOnMobile());
    };
    
    checkMobile();
    
    // Check on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100);
    });
    
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('orientationchange', checkMobile);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return { isMobile, isChrome };
}