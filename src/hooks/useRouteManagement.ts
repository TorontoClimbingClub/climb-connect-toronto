
import { useState, useEffect } from 'react';
import { ClimbingRoute } from '@/types/routes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRouteManagement = () => {
  const [routes, setRoutes] = useState<ClimbingRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch routes from the database
  const fetchRoutes = async () => {
    try {
      console.log('🔄 Fetching routes from database...');
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ Error fetching routes:', error);
        throw error;
      }

      console.log('✅ Routes fetched successfully:', data?.length);
      
      // Transform database results to match ClimbingRoute interface
      const transformedRoutes: ClimbingRoute[] = (data || []).map(route => ({
        id: route.id,
        name: route.name,
        grade: route.grade,
        style: route.style as 'Trad' | 'Sport' | 'Top Rope',
        area: route.area,
        sector: route.sector,
      }));
      
      setRoutes(transformedRoutes);
    } catch (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: "Error",
        description: "Failed to load routes from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRoutes();
  }, []);

  const updateRoute = async (routeId: string, routeData: Partial<ClimbingRoute>) => {
    console.log('🔄 Updating route in database:', { routeId, routeData });
    
    try {
      const { data, error } = await supabase
        .from('routes')
        .update(routeData)
        .eq('id', routeId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating route:', error);
        throw error;
      }

      console.log('✅ Route updated in database:', data);
      
      // Update local state with transformed data
      setRoutes(prevRoutes => 
        prevRoutes.map(route => 
          route.id === routeId ? { 
            ...route, 
            ...routeData 
          } : route
        )
      );

      toast({
        title: "Route Updated",
        description: `${routeData.name || 'Route'} has been updated successfully`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating route:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update the route in database",
        variant: "destructive",
      });
      return false;
    }
  };

  const addRoute = async (routeData: ClimbingRoute) => {
    console.log('➕ Adding route to database:', routeData);
    
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert([routeData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding route:', error);
        throw error;
      }

      console.log('✅ Route added to database:', data);
      
      // Transform and update local state
      const transformedRoute: ClimbingRoute = {
        id: data.id,
        name: data.name,
        grade: data.grade,
        style: data.style as 'Trad' | 'Sport' | 'Top Rope',
        area: data.area,
        sector: data.sector,
      };
      
      setRoutes(prevRoutes => [...prevRoutes, transformedRoute]);

      toast({
        title: "Route Added",
        description: `${routeData.name} has been added successfully`,
      });
    } catch (error) {
      console.error('Error adding route:', error);
      toast({
        title: "Add Failed",
        description: "Failed to add the route to database",
        variant: "destructive",
      });
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
        console.error('❌ Error deleting route:', error);
        throw error;
      }

      console.log('✅ Route deleted from database');
      
      // Update local state
      setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== routeId));

      toast({
        title: "Route Deleted",
        description: "Route has been deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the route from database",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    routes,
    loading,
    updateRoute,
    addRoute,
    deleteRoute,
    refetchRoutes: fetchRoutes,
  };
};
