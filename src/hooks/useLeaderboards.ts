
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

  useEffect(() => {
    const fetchAllLeaderboards = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [profilesData, completionsData, gearData, eventData] = await Promise.all([
          fetchPublicProfiles(),
          fetchClimbCompletions(),
          fetchGearData(),
          fetchEventData()
        ]);

        console.log('All data fetched successfully');

        // Process climbing leaderboards
        const climbingResults = processClimbingData(profilesData, completionsData);
        setTopGradeClimbers(climbingResults.topGradeClimbers);
        setTopTradClimbers(climbingResults.topTradClimbers);
        setTopSportClimbers(climbingResults.topSportClimbers);
        setTopTopRopeClimbers(climbingResults.topTopRopeClimbers);

        // Process event leaderboard
        const eventResults = processEventData(profilesData, eventData);
        setTopEventAttendees(eventResults);

        // Process gear leaderboard
        const gearResults = processGearData(profilesData, gearData);
        setTopGearOwners(gearResults);

      } catch (error: any) {
        console.error('Error in fetchAllLeaderboards:', error);
        toast({
          title: "Error",
          description: "Failed to load leaderboards",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllLeaderboards();
  }, [toast]);

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topEventAttendees,
    topGearOwners,
    loading
  };
}
