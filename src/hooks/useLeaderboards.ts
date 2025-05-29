
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: string | number;
}

export function useLeaderboards() {
  const [topGradeClimbers, setTopGradeClimbers] = useState<LeaderboardUser[]>([]);
  const [topTradClimbers, setTopTradClimbers] = useState<LeaderboardUser[]>([]);
  const [topSportClimbers, setTopSportClimbers] = useState<LeaderboardUser[]>([]);
  const [topTopRopeClimbers, setTopTopRopeClimbers] = useState<LeaderboardUser[]>([]);
  const [topEventAttendees, setTopEventAttendees] = useState<LeaderboardUser[]>([]);
  const [topGearOwners, setTopGearOwners] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEventAttendees = async () => {
    try {
      // Get approved attendances first
      const { data: approvalsData, error: approvalsError } = await supabase
        .from('event_attendance_approvals')
        .select('user_id')
        .eq('status', 'approved');

      if (approvalsError) throw approvalsError;

      // Get unique user IDs and their profiles
      const userIds = [...new Set(approvalsData?.map(a => a.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Count approved attendances per user
      const userCounts = approvalsData?.reduce((acc: Record<string, any>, curr) => {
        const userId = curr.user_id;
        if (!acc[userId]) {
          const profile = profilesData?.find(p => p.id === userId);
          acc[userId] = {
            id: userId,
            full_name: profile?.full_name || 'Unknown User',
            count: 0
          };
        }
        acc[userId].count++;
        return acc;
      }, {}) || {};

      const sortedUsers = Object.values(userCounts)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5)
        .map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          metric_value: user.count
        }));

      setTopEventAttendees(sortedUsers);
    } catch (error: any) {
      console.error('Error fetching event attendees:', error);
    }
  };

  const fetchTopGradeClimbers = async () => {
    try {
      // Get completions first
      const { data: completionsData, error: completionsError } = await supabase
        .from('climb_completions')
        .select('user_id, route_id');

      if (completionsError) throw completionsError;

      // Get routes and profiles separately
      const routeIds = [...new Set(completionsData?.map(c => c.route_id) || [])];
      const userIds = [...new Set(completionsData?.map(c => c.user_id) || [])];

      const [{ data: routesData }, { data: profilesData }] = await Promise.all([
        supabase.from('routes').select('id, grade, style').in('id', routeIds),
        supabase.from('profiles').select('id, full_name').in('id', userIds)
      ]);

      const gradeOrder = [
        '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9',
        '5.10a', '5.10b', '5.10c', '5.10d',
        '5.11a', '5.11b', '5.11c', '5.11d',
        '5.12a', '5.12b', '5.12c', '5.12d',
        '5.13a', '5.13b', '5.13c', '5.13d',
        '5.14a', '5.14b', '5.14c', '5.14d',
        '5.15a', '5.15b', '5.15c', '5.15d'
      ];

      const userHighestGrades = completionsData?.reduce((acc: Record<string, any>, curr) => {
        const userId = curr.user_id;
        const route = routesData?.find(r => r.id === curr.route_id);
        const profile = profilesData?.find(p => p.id === userId);
        
        if (!route || !profile) return acc;
        
        const grade = route.grade;
        const currentIndex = gradeOrder.indexOf(grade);
        
        if (currentIndex === -1) return acc;

        if (!acc[userId] || gradeOrder.indexOf(acc[userId].grade) < currentIndex) {
          acc[userId] = {
            id: userId,
            full_name: profile.full_name,
            grade: grade,
            gradeIndex: currentIndex
          };
        }
        return acc;
      }, {}) || {};

      const sortedUsers = Object.values(userHighestGrades)
        .sort((a: any, b: any) => b.gradeIndex - a.gradeIndex)
        .slice(0, 5)
        .map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          metric_value: user.grade
        }));

      setTopGradeClimbers(sortedUsers);
    } catch (error: any) {
      console.error('Error fetching top grade climbers:', error);
    }
  };

  const fetchTopStyleClimbers = async (style: string, setter: (users: LeaderboardUser[]) => void) => {
    try {
      // Get completions first
      const { data: completionsData, error: completionsError } = await supabase
        .from('climb_completions')
        .select('user_id, route_id');

      if (completionsError) throw completionsError;

      // Get routes of specific style and profiles separately
      const routeIds = [...new Set(completionsData?.map(c => c.route_id) || [])];
      const userIds = [...new Set(completionsData?.map(c => c.user_id) || [])];

      const [{ data: routesData }, { data: profilesData }] = await Promise.all([
        supabase.from('routes').select('id, style').eq('style', style).in('id', routeIds),
        supabase.from('profiles').select('id, full_name').in('id', userIds)
      ]);

      const styleRouteIds = new Set(routesData?.map(r => r.id) || []);

      const userCounts = completionsData?.reduce((acc: Record<string, any>, curr) => {
        if (!styleRouteIds.has(curr.route_id)) return acc;
        
        const userId = curr.user_id;
        const profile = profilesData?.find(p => p.id === userId);
        
        if (!profile) return acc;
        
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            full_name: profile.full_name,
            count: 0
          };
        }
        acc[userId].count++;
        return acc;
      }, {}) || {};

      const sortedUsers = Object.values(userCounts)
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5)
        .map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          metric_value: user.count
        }));

      setter(sortedUsers);
    } catch (error: any) {
      console.error(`Error fetching top ${style} climbers:`, error);
    }
  };

  const fetchTopGearOwners = async () => {
    try {
      // Get equipment data first
      const { data: equipmentData, error: equipmentError } = await supabase
        .from('user_equipment')
        .select('user_id, quantity');

      if (equipmentError) throw equipmentError;

      // Get profiles separately
      const userIds = [...new Set(equipmentData?.map(e => e.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const userCounts = equipmentData?.reduce((acc: Record<string, any>, curr) => {
        const userId = curr.user_id;
        const profile = profilesData?.find(p => p.id === userId);
        
        if (!profile) return acc;
        
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            full_name: profile.full_name,
            totalQuantity: 0
          };
        }
        acc[userId].totalQuantity += curr.quantity || 0;
        return acc;
      }, {}) || {};

      const sortedUsers = Object.values(userCounts)
        .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5)
        .map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          metric_value: user.totalQuantity
        }));

      setTopGearOwners(sortedUsers);
    } catch (error: any) {
      console.error('Error fetching top gear owners:', error);
    }
  };

  useEffect(() => {
    const fetchAllLeaderboards = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchTopGradeClimbers(),
          fetchTopStyleClimbers('Trad', setTopTradClimbers),
          fetchTopStyleClimbers('Sport', setTopSportClimbers),
          fetchTopStyleClimbers('Top Rope', setTopTopRopeClimbers),
          fetchEventAttendees(),
          fetchTopGearOwners()
        ]);
      } catch (error: any) {
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
