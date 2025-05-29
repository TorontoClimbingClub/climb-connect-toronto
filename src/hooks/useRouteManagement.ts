
import { useState, useEffect } from 'react';
import { ClimbingRoute } from '@/types/routes';
import { rattlesnakeRoutes } from '@/data/rattlesnakeRoutes';

// Create a global store for routes that persists changes
let globalRoutes: ClimbingRoute[] = [...rattlesnakeRoutes];
const routeChangeListeners: Array<(routes: ClimbingRoute[]) => void> = [];

const notifyRouteChange = () => {
  routeChangeListeners.forEach(listener => listener([...globalRoutes]));
};

export const useRouteManagement = () => {
  const [routes, setRoutes] = useState<ClimbingRoute[]>(globalRoutes);

  useEffect(() => {
    const listener = (updatedRoutes: ClimbingRoute[]) => {
      setRoutes(updatedRoutes);
    };
    
    routeChangeListeners.push(listener);
    
    return () => {
      const index = routeChangeListeners.indexOf(listener);
      if (index > -1) {
        routeChangeListeners.splice(index, 1);
      }
    };
  }, []);

  const updateRoute = (routeId: string, routeData: Partial<ClimbingRoute>) => {
    console.log('🔄 Updating route globally:', { routeId, routeData });
    
    const routeIndex = globalRoutes.findIndex(r => r.id === routeId);
    if (routeIndex !== -1) {
      globalRoutes[routeIndex] = { ...globalRoutes[routeIndex], ...routeData };
      console.log('✅ Route updated in global store:', globalRoutes[routeIndex]);
      notifyRouteChange();
      return true;
    }
    return false;
  };

  const addRoute = (routeData: ClimbingRoute) => {
    console.log('➕ Adding route globally:', routeData);
    globalRoutes.push(routeData);
    notifyRouteChange();
  };

  const deleteRoute = (routeId: string) => {
    console.log('🗑️ Deleting route globally:', routeId);
    const initialLength = globalRoutes.length;
    globalRoutes = globalRoutes.filter(r => r.id !== routeId);
    if (globalRoutes.length < initialLength) {
      notifyRouteChange();
      return true;
    }
    return false;
  };

  return {
    routes,
    updateRoute,
    addRoute,
    deleteRoute,
  };
};
