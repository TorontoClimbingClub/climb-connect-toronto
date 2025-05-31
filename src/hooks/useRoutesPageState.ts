
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ClimbingRoute } from '@/types/routes';

/**
 * Hook to manage Routes page state including navigation and filter state
 */
export const useRoutesPageState = (routes: ClimbingRoute[]) => {
  const location = useLocation();
  const [selectedCrag, setSelectedCrag] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [filteredRoutes, setFilteredRoutes] = useState<ClimbingRoute[]>(routes);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Update filtered routes when routes change
  useEffect(() => {
    setFilteredRoutes(routes);
  }, [routes]);

  const toggleArea = (area: string) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(area)) {
      newExpanded.delete(area);
    } else {
      newExpanded.add(area);
    }
    setExpandedAreas(newExpanded);
  };

  const handleBack = (navigate: (path: string) => void) => {
    if (selectedSector) {
      setSelectedSector(null);
      setExpandedAreas(new Set());
    } else if (selectedCrag) {
      setSelectedCrag(null);
    } else {
      navigate('/');
    }
  };

  return {
    selectedCrag,
    setSelectedCrag,
    selectedSector,
    setSelectedSector,
    expandedAreas,
    setExpandedAreas,
    filteredRoutes,
    setFilteredRoutes,
    isFiltersExpanded,
    setIsFiltersExpanded,
    toggleArea,
    handleBack,
  };
};
