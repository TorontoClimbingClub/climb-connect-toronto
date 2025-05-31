import { errorLogger } from "./errorLogger";

interface CommunityHealthMetrics {
  pageViews: number;
  successfulLoads: number;
  failedLoads: number;
  averageLoadTime: number;
  lastHealthCheck: Date;
  memberCount: number;
  searchUsage: number;
}

class CommunityHealthMonitor {
  private metrics: CommunityHealthMetrics = {
    pageViews: 0,
    successfulLoads: 0,
    failedLoads: 0,
    averageLoadTime: 0,
    lastHealthCheck: new Date(),
    memberCount: 0,
    searchUsage: 0
  };

  private loadTimes: number[] = [];

  recordPageView() {
    this.metrics.pageViews++;
    this.logMetrics('page_view');
  }

  recordSuccessfulLoad(loadTime: number, memberCount: number) {
    this.metrics.successfulLoads++;
    this.metrics.memberCount = memberCount;
    this.loadTimes.push(loadTime);
    
    // Keep only last 10 load times for average calculation
    if (this.loadTimes.length > 10) {
      this.loadTimes.shift();
    }
    
    this.metrics.averageLoadTime = this.loadTimes.reduce((a, b) => a + b, 0) / this.loadTimes.length;
    this.metrics.lastHealthCheck = new Date();
    
    this.logMetrics('successful_load', { loadTime, memberCount });
  }

  recordFailedLoad(error: string) {
    this.metrics.failedLoads++;
    this.metrics.lastHealthCheck = new Date();
    
    this.logMetrics('failed_load', { error });
  }

  recordSearchUsage(searchTerm: string, resultCount: number) {
    this.metrics.searchUsage++;
    this.logMetrics('search_usage', { searchTerm, resultCount });
  }

  getHealthStatus() {
    const totalLoads = this.metrics.successfulLoads + this.metrics.failedLoads;
    const successRate = totalLoads > 0 ? (this.metrics.successfulLoads / totalLoads) * 100 : 100;
    
    return {
      ...this.metrics,
      successRate,
      isHealthy: successRate > 80 && this.metrics.averageLoadTime < 5000, // 5 second threshold
      needsAttention: successRate < 60 || this.metrics.averageLoadTime > 10000
    };
  }

  private logMetrics(event: string, details?: any) {
    errorLogger.log({
      message: `Community health: ${event}`,
      route: '/community',
      type: 'general_error',
      details: JSON.stringify({
        event,
        metrics: this.metrics,
        ...details
      }),
      source: 'community_health_monitor'
    });
  }

  // Reset metrics (useful for testing or maintenance)
  reset() {
    this.metrics = {
      pageViews: 0,
      successfulLoads: 0,
      failedLoads: 0,
      averageLoadTime: 0,
      lastHealthCheck: new Date(),
      memberCount: 0,
      searchUsage: 0
    };
    this.loadTimes = [];
  }
}

export const communityHealthMonitor = new CommunityHealthMonitor();
