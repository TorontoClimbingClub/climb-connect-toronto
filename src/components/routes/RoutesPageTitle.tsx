
import React from 'react';

interface RoutesPageTitleProps {
  selectedCrag: string | null;
  selectedSector: string | null;
  filteredRoutes: any[];
  totalRoutes: any[];
}

/**
 * Component to handle page title and subtitle logic for Routes page
 */
export const RoutesPageTitle = ({ 
  selectedCrag, 
  selectedSector, 
  filteredRoutes, 
  totalRoutes 
}: RoutesPageTitleProps) => {
  const getPageTitle = () => {
    if (selectedSector) {
      return `${selectedCrag} - ${selectedSector}`;
    }
    if (selectedCrag) {
      // Show filtered route count when filters are active
      const hasActiveFilters = filteredRoutes.length !== totalRoutes.length;
      if (hasActiveFilters) {
        return `${selectedCrag} (${filteredRoutes.length} routes)`;
      }
      return selectedCrag;
    }
    return 'BetaBoards';
  };

  const getPageSubtitle = () => {
    if (selectedSector) {
      return 'Select an area to view routes';
    }
    if (selectedCrag) {
      const hasActiveFilters = filteredRoutes.length !== totalRoutes.length;
      if (hasActiveFilters) {
        return `Showing filtered results - ${filteredRoutes.length} of ${totalRoutes.length} routes`;
      }
      return 'Select a sector';
    }
    return 'Select a climbing area';
  };

  return {
    title: getPageTitle(),
    subtitle: getPageSubtitle()
  };
};
