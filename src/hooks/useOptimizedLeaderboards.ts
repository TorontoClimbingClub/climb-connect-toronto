
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { processClimbingData } from "@/hooks/useClimbingLeaderboards";
import { processGearData } from "@/hooks/useGearLeaderboard";
import { processEventData } from "@/hooks/useEventLeaderboard";
import {
  fetchPublicProfiles,
  fetchClimbCompletions,
  fetchGearData,
  fetchEventData,
  type LeaderboardUser
} from "@/hooks/useLeaderboardData";

interface LeaderboardCache {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const leaderboardCache = new Map<string, LeaderboardCache>();

export function useOptimizedLeaderboards() {
  const [topGradeClimbers, setTopGradeClimbers] = useState<LeaderboardUser[]>([]);
  const [topTradClimbers, setTopTradClimbers] = useState<LeaderboardUser[]>([]);
  const [topSportClimbers, setTopSportClimbers] = useState<LeaderboardUser[]>([]);
  const [topTopRopeClimbers, setTopTopRopeClimbers] = useState<LeaderboardUser[]>([]);
  const [topGearOwners, setTopGearOwners] = useState<LeaderboardUser[]>([]);
  const [topEventAttendees, setTopEventAttendees] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCachedData = (key: string) => {
    const cached = leaderboardCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`📦 [CACHE HIT] Using cached data for ${key}`);
      return cached.data;
    }
    return null;
  };

  const setCachedData = (key: string, data: any) => {
    leaderboardCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: CACHE_TTL
    });
  };

  const fetchWithCache = async (key: string, fetchFn: () => Promise<any>) => {
    const cached = getCachedData(key);
    if (cached) return cached;

    try {
      const data = await fetchFn();
      setCachedData(key, data);
      return data;
    } catch (error) {
      console.error(`❌ [FETCH ERROR] Failed to fetch ${key}:`, error);
      throw error;
    }
  };

  const fetchAllLeaderboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [OPTIMIZED LEADERBOARD] Starting optimized data fetch...');

      // Fetch all data with caching
      const [profilesData, completionsData, gearData, eventData] = await Promise.all([
        fetchWithCache('profiles', fetchPublicProfiles),
        fetchWithCache('completions', fetchClimbCompletions),
        fetchWithCache('gear', fetchGearData),
        fetchWithCache('events', fetchEventData)
      ]);

      console.log('✅ [OPTIMIZED LEADERBOARD] All data fetched successfully');

      // Process all leaderboard data
      const climbingResults = processClimbingData(profilesData, completionsData);
      const gearOwners = processGearData(profilesData, gearData);
      const eventAttendees = processEventData(profilesData, eventData);

      // Update all leaderboard states
      setTopGradeClimbers(climbingResults.topGradeClimbers);
      setTopTradClimbers(climbingResults.topTradClimbers);
      setTopSportClimbers(climbingResults.topSportClimbers);
      setTopTopRopeClimbers(climbingResults.topTopRopeClimbers);
      setTopGearOwners(gearOwners);
      setTopEventAttendees(eventAttendees);

    } catch (error: any) {
      console.error('❌ [OPTIMIZED LEADERBOARD] Error fetching leaderboard data:', error);
      setError(error.message || 'Failed to load leaderboard data');
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearCache = useCallback(() => {
    leaderboardCache.clear();
    console.log('🗑️ [CACHE] Cache cleared');
  }, []);

  const refreshLeaderboards = useCallback(async () => {
    clearCache();
    await fetchAllLeaderboardData();
  }, [clearCache, fetchAllLeaderboardData]);

  useEffect(() => {
    fetchAllLeaderboardData();
  }, [fetchAllLeaderboardData]);

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topGearOwners,
    topEventAttendees,
    loading,
    error,
    refreshLeaderboards,
    clearCache
  };
}
