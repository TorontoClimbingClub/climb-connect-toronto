
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RouteNavigationProps {
  selectedSector: string | null;
  selectedCrag: string | null;
  userId?: string;
}

/**
 * Component to handle route navigation with state preservation
 */
export const RouteNavigation = ({ selectedSector, selectedCrag, userId }: RouteNavigationProps) => {
  const navigate = useNavigate();

  const handleRouteClick = (routeId: string) => {
    console.log('🎯 Navigating to route:', { routeId, userId });
    
    // Pass current navigation state to route detail page
    const currentParams = new URLSearchParams();
    if (selectedSector) currentParams.set('sector', selectedSector);
    if (selectedCrag) currentParams.set('area', selectedCrag);
    
    const routeUrl = `/routes/${routeId}${currentParams.toString() ? `?${currentParams.toString()}` : ''}`;
    navigate(routeUrl);
  };

  return { handleRouteClick };
};
