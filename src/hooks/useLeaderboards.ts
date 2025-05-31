
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchPublicProfiles, 
  fetchClimbCompletions, 
  fetchGearData, 
  fetchEventData,
  type LeaderboardUser 
} from "./useLeaderboardData";
import { processClimbingData } from "./useClimbingLeaderboards";
import { processEventData } from "./useEventLeaderboard";
import { processGearData } from "./useGearLeaderboard";

export function useLeaderboards() {
  const [topGradeClimbers, setTopGradeClimbers] = useState<LeaderboardUser[]>([]);
  const [topTradClimbers, setTopTradClimbers] = useState<LeaderboardUser[]>([]);
  const [topSportClimbers, setTopSportClimbers] = useState<LeaderboardUser[]>([]);
  const [topTopRopeClimbers, setTopTopRopeClimbers] = useState<LeaderboardUser[]>([]);
  const [topEventAttendees, setTopEventAttendees] = useState<LeaderboardUser[]>([]);
  const [topGearOwners, setTopGearOwners] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllLeaderboards = async () => {
    console.log('🚀 [LEADERBOARD MAIN] Starting fetchAllLeaderboards...');
    setLoading(true);
    
    try {
      console.log('⏱️ [LEADERBOARD MAIN] Fetching all data in parallel...');
      
      // Fetch all data in parallel
      const [profilesData, completionsData, gearData, eventData] = await Promise.all([
        fetchPublicProfiles(),
        fetchClimbCompletions(),
        fetchGearData(),
        fetchEventData()
      ]);

      console.log('✅ [LEADERBOARD MAIN] All data fetched successfully:', {
        profiles: profilesData.length,
        completions: completionsData.length,
        gear: gearData.length,
        events: eventData.length
      });

      // Process climbing leaderboards
      console.log('⚙️ [LEADERBOARD MAIN] Processing climbing leaderboards...');
      const climbingResults = processClimbingData(profilesData, completionsData);
      setTopGradeClimbers(climbingResults.topGradeClimbers);
      setTopTradClimbers(climbingResults.topTradClimbers);
      setTopSportClimbers(climbingResults.topSportClimbers);
      setTopTopRopeClimbers(climbingResults.topTopRopeClimbers);

      // Process event leaderboard
      console.log('⚙️ [LEADERBOARD MAIN] Processing event leaderboard...');
      const eventResults = processEventData(profilesData, eventData);
      setTopEventAttendees(eventResults);

      // Process gear leaderboard
      console.log('⚙️ [LEADERBOARD MAIN] Processing gear leaderboard...');
      const gearResults = processGearData(profilesData, gearData);
      setTopGearOwners(gearResults);

      console.log('🎉 [LEADERBOARD MAIN] All leaderboards processed successfully');
      console.log('📊 [LEADERBOARD SUMMARY] Final results:', {
        topGradeClimbers: climbingResults.topGradeClimbers.length,
        topTradClimbers: climbingResults.topTradClimbers.length,
        topSportClimbers: climbingResults.topSportClimbers.length,
        topTopRopeClimbers: climbingResults.topTopRopeClimbers.length,
        topEventAttendees: eventResults.length,
        topGearOwners: gearResults.length
      });

    } catch (error: any) {
      console.error('💥 [LEADERBOARD CRITICAL] Error in fetchAllLeaderboards:', error);
      console.error('💥 [LEADERBOARD CRITICAL] Error stack:', error.stack);
      toast({
        title: "Error",
        description: "Failed to load leaderboards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 [LEADERBOARD MAIN] fetchAllLeaderboards completed');
    }
  };

  useEffect(() => {
    fetchAllLeaderboards();
  }, []);

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topEventAttendees,
    topGearOwners,
    loading,
    refreshLeaderboards: fetchAllLeaderboards
  };
}
