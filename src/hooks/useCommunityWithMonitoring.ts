
import { useEffect, useCallback } from "react";
import { useRobustCommunityData } from "./useRobustCommunityData";
import { errorLogger } from "@/utils/errorLogger";

export function useCommunityWithMonitoring() {
  const communityData = useRobustCommunityData();

  // Performance monitoring
  const logPerformanceMetrics = useCallback(() => {
    const loadTime = Date.now() - (communityData.lastSuccessfulFetch?.getTime() || Date.now());
    
    console.log('📊 Community Performance Metrics:', {
      memberCount: communityData.members.length,
      loadTime,
      retryCount: communityData.retryCount,
      isHealthy: communityData.isHealthy,
      hasError: !!communityData.error
    });

    // Log performance metrics to error logger for tracking
    if (communityData.lastSuccessfulFetch) {
      errorLogger.log({
        message: `Community page performance: ${loadTime}ms, ${communityData.members.length} members`,
        route: '/community',
        type: 'general_error',
        details: JSON.stringify({
          loadTime,
          memberCount: communityData.members.length,
          retryCount: communityData.retryCount,
          isHealthy: communityData.isHealthy
        }),
        source: 'community_performance'
      });
    }
  }, [communityData]);

  useEffect(() => {
    communityData.mountedRef.current = true;
    
    const startTime = Date.now();
    console.log('🚀 Community hook initializing');
    
    const cleanup = communityData.fetchCommunityMembers();

    // Log initialization
    errorLogger.log({
      message: 'Community page initialized',
      route: '/community',
      type: 'general_error',
      details: `Initialization at ${new Date().toISOString()}`,
      source: 'community_init'
    });

    return () => {
      communityData.mountedRef.current = false;
      const endTime = Date.now();
      console.log(`🏁 Community hook cleanup after ${endTime - startTime}ms`);
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  // Monitor for successful loads
  useEffect(() => {
    if (communityData.lastSuccessfulFetch && !communityData.loading) {
      logPerformanceMetrics();
    }
  }, [communityData.lastSuccessfulFetch, communityData.loading, logPerformanceMetrics]);

  // Auto-retry logic for failed requests
  useEffect(() => {
    if (communityData.needsRetry && !communityData.loading) {
      const retryDelay = Math.min(1000 * Math.pow(2, communityData.retryCount), 10000);
      console.log(`⏰ Auto-retry in ${retryDelay}ms (attempt ${communityData.retryCount})`);
      
      const timer = setTimeout(() => {
        communityData.retryFetch();
      }, retryDelay);

      return () => clearTimeout(timer);
    }
  }, [communityData.needsRetry, communityData.loading, communityData.retryCount, communityData.retryFetch]);

  return {
    members: communityData.members,
    loading: communityData.loading,
    error: communityData.error,
    refreshMembers: communityData.fetchCommunityMembers,
    retryFetch: communityData.retryFetch,
    resetError: communityData.resetError,
    isHealthy: communityData.isHealthy,
    performanceMetrics: {
      memberCount: communityData.members.length,
      retryCount: communityData.retryCount,
      lastSuccessfulFetch: communityData.lastSuccessfulFetch
    }
  };
}
