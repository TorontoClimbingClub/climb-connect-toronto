
import React from 'react';
import { CragCard } from './CragCard';
import { SectorCard } from './SectorCard';
import { AreaCard } from './AreaCard';
import { MapWidget } from './MapWidget';
import { RecentGradeSubmissions } from './RecentGradeSubmissions';
import { EnhancedRouteFilters } from '../filters/EnhancedRouteFilters';
import { ClimbingRoute } from '@/types/routes';

interface RoutesMainContentProps {
  selectedCrag: string | null;
  selectedSector: string | null;
  filteredRoutes: ClimbingRoute[];
  allRoutes: ClimbingRoute[];
  expandedAreas: Set<string>;
  isFiltersExpanded: boolean;
  setSelectedCrag: (crag: string) => void;
  setSelectedSector: (sector: string) => void;
  toggleArea: (area: string) => void;
  setIsFiltersExpanded: (expanded: boolean) => void;
  onFiltersChange: (routes: ClimbingRoute[]) => void;
  onRouteClick: (routeId: string) => void;
}

/**
 * Main content component for Routes page
 */
export const RoutesMainContent = ({
  selectedCrag,
  selectedSector,
  filteredRoutes,
  allRoutes,
  expandedAreas,
  isFiltersExpanded,
  setSelectedCrag,
  setSelectedSector,
  toggleArea,
  setIsFiltersExpanded,
  onFiltersChange,
  onRouteClick
}: RoutesMainContentProps) => {
  // Get unique sectors and areas from filtered routes (sorted alphabetically)
  const sectors = [...new Set(filteredRoutes.map(route => route.sector))].sort();
  const areas = selectedSector 
    ? [...new Set(filteredRoutes.filter(route => route.sector === selectedSector).map(route => route.area))].sort()
    : [];

  // Group routes by area within selected sector (sort routes alphabetically within each area)
  const routesByArea = selectedSector ? filteredRoutes
    .filter(route => route.sector === selectedSector)
    .reduce((acc, route) => {
      if (!acc[route.area]) {
        acc[route.area] = [];
      }
      acc[route.area].push(route);
      return acc;
    }, {} as Record<string, typeof filteredRoutes>) : {};

  // Sort routes within each area alphabetically
  Object.keys(routesByArea).forEach(area => {
    routesByArea[area].sort((a, b) => a.name.localeCompare(b.name));
  });

  return (
    <div className="space-y-4">
      {!selectedCrag && (
        <>
          <CragCard
            name="Rattlesnake Point"
            location="Milton, Ontario"
            onClick={() => setSelectedCrag('Rattlesnake Point')}
          />
          <RecentGradeSubmissions onRouteClick={onRouteClick} />
        </>
      )}

      {selectedCrag && (
        <>
          <MapWidget />
          <EnhancedRouteFilters 
            routes={allRoutes} 
            onFiltersChange={onFiltersChange}
            isExpanded={isFiltersExpanded}
            onExpandedChange={setIsFiltersExpanded}
          />
        </>
      )}

      {selectedCrag && !selectedSector && (
        sectors.map((sector) => (
          <SectorCard
            key={sector}
            name={sector}
            routeCount={filteredRoutes.filter(route => route.sector === sector).length}
            onClick={() => setSelectedSector(sector)}
          />
        ))
      )}

      {selectedSector && (
        areas.map((area) => (
          <AreaCard
            key={area}
            area={area}
            routes={routesByArea[area] || []}
            isExpanded={expandedAreas.has(area)}
            onToggle={() => toggleArea(area)}
            onRouteClick={onRouteClick}
          />
        ))
      )}
    </div>
  );
};
