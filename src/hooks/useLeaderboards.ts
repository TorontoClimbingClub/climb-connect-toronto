
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
import { processGearData } from "./useGearLeaderboard";
import { processEventData } from "./useEventLeaderboard";

export function useLeaderboards() {
  const [topGradeClimbers, setTopGradeClimbers] = useState<LeaderboardUser[]>([]);
  const [topTradClimbers, setTopTradClimbers] = useState<LeaderboardUser[]>([]);
  const [topSportClimbers, setTopSportClimbers] = useState<LeaderboardUser[]>([]);
  const [topTopRopeClimbers, setTopTopRopeClimbers] = useState<LeaderboardUser[]>([]);
  const [topGearOwners, setTopGearOwners] = useState<LeaderboardUser[]>([]);
  const [topEventAttendees, setTopEventAttendees] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      setLoading(true);
      console.log('Starting leaderboards fetch...');

      const profilesData = await fetchPublicProfiles();

      if (!profilesData || profilesData.length === 0) {
        console.log('No profiles found with public viewing enabled');
        setLoading(false);
        return;
      }

      // Process climbing data
      const completionsData = await fetchClimbCompletions();
      if (completionsData && completionsData.length > 0) {
        const climbingResults = processClimbingData(profilesData, completionsData);
        setTopGradeClimbers(climbingResults.topGradeClimbers);
        setTopTradClimbers(climbingResults.topTradClimbers);
        setTopSportClimbers(climbingResults.topSportClimbers);
        setTopTopRopeClimbers(climbingResults.topTopRopeClimbers);
      }

      // Process gear data
      try {
        const gearData = await fetchGearData();
        if (gearData) {
          const topGear = processGearData(profilesData, gearData);
          setTopGearOwners(topGear);
        }
      } catch (error) {
        console.error('Error processing gear data:', error);
      }

      // Process event data
      try {
        const eventData = await fetchEventData();
        if (eventData) {
          const topEvents = processEventData(profilesData, eventData);
          setTopEventAttendees(topEvents);
        }
      } catch (error) {
        console.error('Error processing event data:', error);
      }

    } catch (error) {
      console.error('Error fetching leaderboards:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    topGradeClimbers,
    topTradClimbers,
    topSportClimbers,
    topTopRopeClimbers,
    topGearOwners,
    topEventAttendees,
    loading
  };
}
