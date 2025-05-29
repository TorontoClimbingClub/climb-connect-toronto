
import { useState, useEffect } from 'react';
import { ClimbingRoute } from '@/types/routes';
import { supabase } from '@/integrations/supabase/client';

export const useRouteManagement = () => {
  const [routes, setRoutes] = useState<ClimbingRoute[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch routes from database
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching routes:', error);
        return;
      }

      // Transform database data to match ClimbingRoute interface
      const transformedRoutes: ClimbingRoute[] = data.map(route => ({
        id: route.id,
        name: route.name,
        grade: route.grade,
        style: route.style as 'Trad' | 'Sport' | 'Top Rope',
        area: route.area,
        sector: route.sector
      }));

      setRoutes(transformedRoutes);
      console.log('✅ Routes fetched from database:', transformedRoutes.length);
    } catch (error) {
      console.error('Error in fetchRoutes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize routes on mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const updateRoute = async (routeId: string, routeData: Partial<ClimbingRoute>) => {
    console.log('🔄 Updating route in database:', { routeId, routeData });
    
    try {
      const { error } = await supabase
        .from('routes')
        .update({
          name: routeData.name,
          grade: routeData.grade,
          style: routeData.style,
          area: routeData.area,
          sector: routeData.sector
        })
        .eq('id', routeId);

      if (error) {
        console.error('Error updating route:', error);
        return false;
      }

      // Update local state
      setRoutes(prev => prev.map(route => 
        route.id === routeId ? { ...route, ...routeData } : route
      ));

      console.log('✅ Route updated successfully in database');
      return true;
    } catch (error) {
      console.error('Error in updateRoute:', error);
      return false;
    }
  };

  const addRoute = async (routeData: ClimbingRoute) => {
    console.log('➕ Adding route to database:', routeData);
    
    try {
      const { error } = await supabase
        .from('routes')
        .insert({
          id: routeData.id,
          name: routeData.name,
          grade: routeData.grade,
          style: routeData.style,
          area: routeData.area,
          sector: routeData.sector
        });

      if (error) {
        console.error('Error adding route:', error);
        return false;
      }

      // Update local state
      setRoutes(prev => [...prev, routeData]);
      console.log('✅ Route added successfully to database');
      return true;
    } catch (error) {
      console.error('Error in addRoute:', error);
      return false;
    }
  };

  const deleteRoute = async (routeId: string) => {
    console.log('🗑️ Deleting route from database:', routeId);
    
    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', routeId);

      if (error) {
        console.error('Error deleting route:', error);
        return false;
      }

      // Update local state
      setRoutes(prev => prev.filter(route => route.id !== routeId));
      console.log('✅ Route deleted successfully from database');
      return true;
    } catch (error) {
      console.error('Error in deleteRoute:', error);
      return false;
    }
  };

  return {
    routes,
    loading,
    updateRoute,
    addRoute,
    deleteRoute,
    refreshRoutes: fetchRoutes
  };
};
