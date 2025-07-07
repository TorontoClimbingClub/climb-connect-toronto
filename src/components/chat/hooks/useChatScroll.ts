import { useRef, useCallback, useEffect } from 'react';

interface UseChatScrollOptions {
  autoScroll?: boolean;
  scrollThreshold?: number; // pixels from bottom to trigger auto-scroll
  debounceMs?: number;
}

export function useChatScroll({
  autoScroll = true,
  scrollThreshold = 100,
  debounceMs = 100
}: UseChatScrollOptions = {}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  // Function to scroll to bottom
  const scrollToBottom = useCallback((force = false) => {
    if (!viewportRef.current) return;
    
    const scrollContainer = viewportRef.current;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;
    
    // Only auto-scroll if user is near bottom or force is true
    if (force || (autoScroll && (isNearBottom || !isUserScrollingRef.current))) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [autoScroll, scrollThreshold]);

  // Check if user is at bottom
  const isAtBottom = useCallback((): boolean => {
    if (!viewportRef.current) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    return scrollTop + clientHeight >= scrollHeight - scrollThreshold;
  }, [scrollThreshold]);

  // Get scroll position percentage
  const getScrollPercentage = useCallback((): number => {
    if (!viewportRef.current) return 0;
    
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const maxScroll = scrollHeight - clientHeight;
    return maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  }, []);

  // Handle scroll events with debouncing
  const handleScroll = useCallback((callback?: (isAtBottom: boolean) => void) => {
    if (!viewportRef.current) return;
    
    const { scrollTop } = viewportRef.current;
    
    // Detect if user is manually scrolling
    isUserScrollingRef.current = Math.abs(scrollTop - lastScrollTopRef.current) > 1;
    lastScrollTopRef.current = scrollTop;
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Debounce the callback
    if (callback) {
      scrollTimeoutRef.current = setTimeout(() => {
        const atBottom = isAtBottom();
        callback(atBottom);
        
        // Reset user scrolling flag after callback
        setTimeout(() => {
          isUserScrollingRef.current = false;
        }, 100);
        
        scrollTimeoutRef.current = null;
      }, debounceMs);
    }
  }, [isAtBottom, debounceMs]);

  // Scroll to specific message
  const scrollToMessage = useCallback((messageId: string) => {
    if (!viewportRef.current) return;
    
    const messageElement = viewportRef.current.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      messageElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, []);

  // Scroll by specific amount
  const scrollBy = useCallback((pixels: number) => {
    if (!viewportRef.current) return;
    
    viewportRef.current.scrollBy({
      top: pixels,
      behavior: 'smooth'
    });
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (!viewportRef.current) return;
    
    viewportRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Save scroll position
  const saveScrollPosition = useCallback((): number => {
    if (!viewportRef.current) return 0;
    return viewportRef.current.scrollTop;
  }, []);

  // Restore scroll position
  const restoreScrollPosition = useCallback((position: number) => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = position;
  }, []);

  // Auto-scroll on new messages (when user is at bottom)
  const handleNewMessage = useCallback(() => {
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  }, [scrollToBottom]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    viewportRef,
    scrollToBottom,
    isAtBottom,
    getScrollPercentage,
    handleScroll,
    scrollToMessage,
    scrollBy,
    scrollToTop,
    saveScrollPosition,
    restoreScrollPosition,
    handleNewMessage,
    scrollTimeoutRef
  };
}