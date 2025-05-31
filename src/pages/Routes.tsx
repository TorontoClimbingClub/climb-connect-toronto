
import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { PageHeader } from "@/components/routes/PageHeader";
import { RoutesMainContent } from "@/components/routes/RoutesMainContent";
import { RoutesPageTitle } from "@/components/routes/RoutesPageTitle";
import { RouteNavigation } from "@/components/routes/RouteNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouteManagement } from "@/hooks/useRouteManagement";
import { useRealtimeRoutes } from "@/hooks/useRealtimeRoutes";
import { useResponsiveContainer } from "@/hooks/useResponsiveContainer";
import { useRoutesPageState } from "@/hooks/useRoutesPageState";

export default function Routes() {
  const navigate = useNavigate();
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

  const {
    selectedCrag,
    setSelectedCrag,
    selectedSector,
    setSelectedSector,
    expandedAreas,
    filteredRoutes,
    setFilteredRoutes,
    isFiltersExpanded,
    setIsFiltersExpanded,
    toggleArea,
    handleBack
  } = useRoutesPageState(routes);

  const { handleRouteClick } = RouteNavigation({ 
    selectedSector, 
    selectedCrag, 
    userId: user?.id 
  });

  console.log('🏔️ Routes page loaded:', {
    userId: user?.id,
    userEmail: user?.email,
    authError,
    totalRoutes: routes.length,
    loading
  });

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

  const { title, subtitle } = RoutesPageTitle({
    selectedCrag,
    selectedSector,
    filteredRoutes,
    totalRoutes: routes
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className={`${containerClass} ${paddingClass}`}>
        <PageHeader
          title={title}
          subtitle={subtitle}
          onBack={() => handleBack(navigate)}
        />

        <RoutesMainContent
          selectedCrag={selectedCrag}
          selectedSector={selectedSector}
          filteredRoutes={filteredRoutes}
          allRoutes={routes}
          expandedAreas={expandedAreas}
          isFiltersExpanded={isFiltersExpanded}
          setSelectedCrag={setSelectedCrag}
          setSelectedSector={setSelectedSector}
          toggleArea={toggleArea}
          setIsFiltersExpanded={setIsFiltersExpanded}
          onFiltersChange={setFilteredRoutes}
          onRouteClick={handleRouteClick}
        />
      </div>
      <Navigation />
    </div>
  );
}
