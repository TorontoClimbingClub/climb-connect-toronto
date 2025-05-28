
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { RouteFilters } from "@/components/RouteFilters";
import { PageHeader } from "@/components/routes/PageHeader";
import { CragCard } from "@/components/routes/CragCard";
import { SectorCard } from "@/components/routes/SectorCard";
import { AreaCard } from "@/components/routes/AreaCard";
import { MapWidget } from "@/components/routes/MapWidget";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { ClimbingRoute } from "@/types/routes";

export default function Routes() {
  const navigate = useNavigate();
  const [selectedCrag, setSelectedCrag] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [filteredRoutes, setFilteredRoutes] = useState<ClimbingRoute[]>(rattlesnakeRoutes);

  // Get unique sectors and areas from filtered routes
  const sectors = [...new Set(filteredRoutes.map(route => route.sector))];
  const areas = selectedSector 
    ? [...new Set(filteredRoutes.filter(route => route.sector === selectedSector).map(route => route.area))]
    : [];

  // Group routes by area within selected sector
  const routesByArea = selectedSector ? filteredRoutes
    .filter(route => route.sector === selectedSector)
    .reduce((acc, route) => {
      if (!acc[route.area]) {
        acc[route.area] = [];
      }
      acc[route.area].push(route);
      return acc;
    }, {} as Record<string, typeof filteredRoutes>) : {};

  const toggleArea = (area: string) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(area)) {
      newExpanded.delete(area);
    } else {
      newExpanded.add(area);
    }
    setExpandedAreas(newExpanded);
  };

  const handleBack = () => {
    if (selectedSector) {
      setSelectedSector(null);
      setSelectedCrag(null);
      setExpandedAreas(new Set());
    } else if (selectedCrag) {
      setSelectedCrag(null);
    } else {
      navigate('/');
    }
  };

  const getPageTitle = () => {
    if (selectedSector) {
      return `${selectedCrag} - ${selectedSector}`;
    }
    if (selectedCrag) {
      // Show filtered route count when filters are active
      const hasActiveFilters = filteredRoutes.length !== rattlesnakeRoutes.length;
      if (hasActiveFilters) {
        return `${selectedCrag} (${filteredRoutes.length} routes)`;
      }
      return selectedCrag;
    }
    return 'Beta Boards';
  };

  const getPageSubtitle = () => {
    if (selectedSector) {
      return 'Select an area to view routes';
    }
    if (selectedCrag) {
      const hasActiveFilters = filteredRoutes.length !== rattlesnakeRoutes.length;
      if (hasActiveFilters) {
        return `Showing filtered results - ${filteredRoutes.length} of ${rattlesnakeRoutes.length} routes`;
      }
      return 'Select a sector';
    }
    return 'Select a climbing area';
  };

  const handleFiltersChange = (newFilteredRoutes: ClimbingRoute[]) => {
    setFilteredRoutes(newFilteredRoutes);
    // Reset selections when filters change
    setSelectedSector(null);
    setSelectedCrag(null);
    setExpandedAreas(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <PageHeader
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          onBack={handleBack}
        />

        {/* Show map widget when no crag is selected */}
        {!selectedCrag && <MapWidget />}

        {/* Show filters when a crag is selected */}
        {selectedCrag && (
          <RouteFilters 
            routes={rattlesnakeRoutes} 
            onFiltersChange={handleFiltersChange}
          />
        )}

        <div className="space-y-4">
          {!selectedCrag && (
            <CragCard
              name="Rattlesnake Point"
              location="Milton, Ontario"
              onClick={() => setSelectedCrag('Rattlesnake Point')}
            />
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
            Object.entries(routesByArea).map(([area, routes]) => (
              <AreaCard
                key={area}
                area={area}
                routes={routes}
                isExpanded={expandedAreas.has(area)}
                onToggle={() => toggleArea(area)}
                onRouteClick={(routeId) => navigate(`/routes/${routeId}`)}
              />
            ))
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
