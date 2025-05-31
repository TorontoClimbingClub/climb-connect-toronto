
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { EnhancedRouteFilters } from "@/components/filters/EnhancedRouteFilters";
import { PageHeader } from "@/components/routes/PageHeader";
import { CragCard } from "@/components/routes/CragCard";
import { SectorCard } from "@/components/routes/SectorCard";
import { AreaCard } from "@/components/routes/AreaCard";
import { MapWidget } from "@/components/routes/MapWidget";
import { RecentGradeSubmissions } from "@/components/routes/RecentGradeSubmissions";
import { ClimbingRoute } from "@/types/routes";
import { useAuth } from "@/contexts/AuthContext";
import { useRouteManagement } from "@/hooks/useRouteManagement";
import { useRealtimeRoutes } from "@/hooks/useRealtimeRoutes";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";

export default function Routes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { routes, loading } = useRouteManagement();
  const { containerClass, paddingClass } = useResponsiveContainer('medium');
  
  // Enable real-time updates for routes
  useRealtimeRoutes();

  // Use try-catch to handle auth context issues gracefully
  let user = null;
  let authError = false;
  
  try {
    const authData = useAuth();
    user = authData.user;
  } catch (error) {
    console.warn('Auth context not available:', error);
    authError = true;
  }

  const [selectedCrag, setSelectedCrag] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [filteredRoutes, setFilteredRoutes] = useState<ClimbingRoute[]>(routes);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  console.log('🏔️ Routes page loaded:', {
    userId: user?.id,
    userEmail: user?.email,
    route: location.pathname,
    authError,
    totalRoutes: routes.length,
    loading
  });

  // Update filtered routes when routes change
  useEffect(() => {
    setFilteredRoutes(routes);
  }, [routes]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
        <div className={`${containerClass} ${paddingClass}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E55A2B] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading routes...</p>
            </div>
          </div>
        </div>
        <Navigation />
      </div>
    );
  }

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
    
    // Pass current navigation state to route detail page
    const currentParams = new URLSearchParams();
    if (selectedSector) currentParams.set('sector', selectedSector);
    if (selectedCrag) currentParams.set('area', selectedCrag);
    
    const routeUrl = `/routes/${routeId}${currentParams.toString() ? `?${currentParams.toString()}` : ''}`;
    navigate(routeUrl);
  };

  const getPageTitle = () => {
    if (selectedSector) {
      return `${selectedCrag} - ${selectedSector}`;
    }
    if (selectedCrag) {
      // Show filtered route count when filters are active
      const hasActiveFilters = filteredRoutes.length !== routes.length;
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
      const hasActiveFilters = filteredRoutes.length !== routes.length;
      if (hasActiveFilters) {
        return `Showing filtered results - ${filteredRoutes.length} of ${routes.length} routes`;
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
      <div className={`${containerClass} ${paddingClass}`}>
        <PageHeader
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          onBack={handleBack}
        />

        <div className="space-y-4">
          {!selectedCrag && (
            <>
              <CragCard
                name="Rattlesnake Point"
                location="Milton, Ontario"
                onClick={() => setSelectedCrag('Rattlesnake Point')}
              />
              <RecentGradeSubmissions onRouteClick={handleRouteClick} />
            </>
          )}

          {selectedCrag && !selectedSector && (
            <>
              <MapWidget />
              <EnhancedRouteFilters 
                routes={routes} 
                onFiltersChange={handleFiltersChange}
                isExpanded={isFiltersExpanded}
                onExpandedChange={setIsFiltersExpanded}
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
            areas.map((area) => (
              <AreaCard
                key={area}
                area={area}
                routes={routesByArea[area] || []}
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
