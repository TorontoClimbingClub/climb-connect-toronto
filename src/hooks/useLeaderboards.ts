
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

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

      // Get top gear owners
      const { data: gearData } = await supabase
        .from('user_equipment')
        .select(`
          user_id,
          quantity,
          profiles!inner(full_name, allow_profile_viewing)
        `)
        .eq('profiles.allow_profile_viewing', true);

      if (gearData) {
        const gearStats = gearData.reduce((acc: any, item) => {
          if (!acc[item.user_id]) {
            acc[item.user_id] = {
              user_id: item.user_id,
              full_name: (item.profiles as any).full_name,
              total_gear: 0
            };
          }
          acc[item.user_id].total_gear += item.quantity;
          return acc;
        }, {});

        const topGear = Object.values(gearStats)
          .sort((a: any, b: any) => b.total_gear - a.total_gear)
          .slice(0, 5)
          .map((user: any) => ({
            id: user.user_id,
            full_name: user.full_name,
            metric_value: user.total_gear
          }));

        setTopGearOwners(topGear);
      }

      // Get top event attendees
      const { data: eventData } = await supabase
        .from('event_participants')
        .select(`
          user_id,
          profiles!inner(full_name, allow_profile_viewing)
        `)
        .eq('profiles.allow_profile_viewing', true);

      if (eventData) {
        const eventStats = eventData.reduce((acc: any, participation) => {
          if (!acc[participation.user_id]) {
            acc[participation.user_id] = {
              user_id: participation.user_id,
              full_name: (participation.profiles as any).full_name,
              event_count: 0
            };
          }
          acc[participation.user_id].event_count += 1;
          return acc;
        }, {});

        const topEvents = Object.values(eventStats)
          .sort((a: any, b: any) => b.event_count - a.event_count)
          .slice(0, 5)
          .map((user: any) => ({
            id: user.user_id,
            full_name: user.full_name,
            metric_value: user.event_count
          }));

        setTopEventAttendees(topEvents);
      }

      // Get climbing completions data
      const { data: completionsData } = await supabase
        .from('climb_completions')
        .select(`
          user_id,
          route_id,
          profiles!inner(full_name, allow_profile_viewing)
        `)
        .eq('profiles.allow_profile_viewing', true);

      if (completionsData) {
        // For now, we'll create placeholder data for climbing stats
        // In a real implementation, you'd need route data with grades and types
        const climbingStats = completionsData.reduce((acc: any, completion) => {
          if (!acc[completion.user_id]) {
            acc[completion.user_id] = {
              user_id: completion.user_id,
              full_name: (completion.profiles as any).full_name,
              total_climbs: 0,
              trad_climbs: 0,
              sport_climbs: 0,
              top_rope_climbs: 0,
              highest_grade: "5.6" // Placeholder
            };
          }
          acc[completion.user_id].total_climbs += 1;
          // Distribute randomly for demo - in real app, get from route data
          if (Math.random() > 0.7) acc[completion.user_id].trad_climbs += 1;
          else if (Math.random() > 0.5) acc[completion.user_id].sport_climbs += 1;
          else acc[completion.user_id].top_rope_climbs += 1;
          return acc;
        }, {});

        // Top grade climbers (using total climbs as proxy for now)
        const topGrades = Object.values(climbingStats)
          .sort((a: any, b: any) => b.total_climbs - a.total_climbs)
          .slice(0, 5)
          .map((user: any) => ({
            id: user.user_id,
            full_name: user.full_name,
            metric_value: user.highest_grade
          }));

        // Top trad climbers
        const topTrad = Object.values(climbingStats)
          .sort((a: any, b: any) => b.trad_climbs - a.trad_climbs)
          .slice(0, 5)
          .map((user: any) => ({
            id: user.user_id,
            full_name: user.full_name,
            metric_value: user.trad_climbs
          }));

        // Top sport climbers
        const topSport = Object.values(climbingStats)
          .sort((a: any, b: any) => b.sport_climbs - a.sport_climbs)
          .slice(0, 5)
          .map((user: any) => ({
            id: user.user_id,
            full_name: user.full_name,
            metric_value: user.sport_climbs
          }));

        // Top top-rope climbers
        const topTopRope = Object.values(climbingStats)
          .sort((a: any, b: any) => b.top_rope_climbs - a.top_rope_climbs)
          .slice(0, 5)
          .map((user: any) => ({
            id: user.user_id,
            full_name: user.full_name,
            metric_value: user.top_rope_climbs
          }));

        setTopGradeClimbers(topGrades);
        setTopTradClimbers(topTrad);
        setTopSportClimbers(topSport);
        setTopTopRopeClimbers(topTopRope);
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
