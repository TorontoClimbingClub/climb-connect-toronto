/**
 * Mobile Detection Hook (Compatibility)
 * 
 * This is a compatibility hook for components that might still reference
 * the old use-mobile hook. It uses the new layout state management.
 */

import { useLayoutState } from './useLayoutState';

export const useMobile = (): boolean => {
  const { isMobile } = useLayoutState();
  return isMobile;
};

export const useIsMobile = useMobile;

export default useMobile;