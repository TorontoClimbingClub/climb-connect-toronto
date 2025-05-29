
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { EnhancedRouteFilters } from "@/components/filters/EnhancedRouteFilters";
import { PageHeader } from "@/components/routes/PageHeader";
import { CragCard } from "@/components/routes/CragCard";
import { SectorCard } from "@/components/routes/SectorCard";
import { AreaCard } from "@/components/routes/AreaCard";
import { MapWidget } from "@/components/routes/MapWidget";
import { useAccessControl } from "@/hooks/useAccessControl";
import { rattlesnakeRoutes } from "@/data/rattlesnakeRoutes";
import { ClimbingRoute } from "@/types/routes";
import { useAuth } from "@/contexts/AuthContext";

export default function Routes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { hasAccess, accessLoading } = useAccessControl('public');
  const [selectedCrag, setSelectedCrag] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [filteredRoutes, setFilteredRoutes] = useState<ClimbingRoute[]>(rattlesnakeRoutes);

  console.log('🏔️ Routes page loaded:', {
    userId: user?.id,
    userEmail: user?.email,
    hasAccess,
    accessLoading,
    route: location.pathname
  });

  // Show loading state while checking access
  if (accessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading routes...</div>
      </div>
    );
  }

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
      setExpandedAreas(new Set());
    } else if (selectedCrag) {
      setSelectedCrag(null);
    } else {
      navigate('/');
    }
  };

  const handleRouteClick = (routeId: string) => {
    console.log('🎯 Navigating to route:', { routeId, userId: user?.id });
    navigate(`/routes/${routeId}`);
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
    // Don't reset selections when filters change - keep user on same page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <PageHeader
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          onBack={handleBack}
        />

        <div className="space-y-4">
          {!selectedCrag && (
            <CragCard
              name="Rattlesnake Point"
              location="Milton, Ontario"
              onClick={() => setSelectedCrag('Rattlesnake Point')}
            />
          )}

          {selectedCrag && !selectedSector && (
            <>
              <MapWidget />
              <EnhancedRouteFilters 
                routes={rattlesnakeRoutes} 
                onFiltersChange={handleFiltersChange}
              />
              {sectors.map((sector) => (
                <SectorCard
                  key={sector}
                  name={sector}
                  routeCount={filteredRoutes.filter(route => route.sector === sector).length}
                  onClick={() => setSelectedSector(sector)}
                />
              ))}
            </>
          )}

          {selectedSector && (
            Object.entries(routesByArea).map(([area, routes]) => (
              <AreaCard
                key={area}
                area={area}
                routes={routes}
                isExpanded={expandedAreas.has(area)}
                onToggle={() => toggleArea(area)}
                onRouteClick={handleRouteClick}
              />
            ))
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}
