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
      // Use the new attendance approval system for accurate event counts
      const { data, error } = await supabase
        .from('event_attendance_approvals')
        .select(`
          user_id,
          user:profiles!inner(full_name)
        `)
        .eq('status', 'approved');

      if (error) throw error;

      // Count approved attendances per user
      const userCounts = data.reduce((acc: Record<string, any>, curr) => {
        const userId = curr.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            full_name: curr.user.full_name,
            count: 0
          };
        }
        acc[userId].count++;
        return acc;
      }, {});

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
      const { data, error } = await supabase
        .from('climb_completions')
        .select(`
          user_id,
          route_id,
          user:profiles!inner(full_name),
          route:routes!inner(grade, style)
        `);

      if (error) throw error;

      const gradeOrder = [
        '5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9',
        '5.10a', '5.10b', '5.10c', '5.10d',
        '5.11a', '5.11b', '5.11c', '5.11d',
        '5.12a', '5.12b', '5.12c', '5.12d',
        '5.13a', '5.13b', '5.13c', '5.13d',
        '5.14a', '5.14b', '5.14c', '5.14d',
        '5.15a', '5.15b', '5.15c', '5.15d'
      ];

      const userHighestGrades = data.reduce((acc: Record<string, any>, curr) => {
        const userId = curr.user_id;
        const grade = curr.route.grade;
        const currentIndex = gradeOrder.indexOf(grade);
        
        if (currentIndex === -1) return acc;

        if (!acc[userId] || gradeOrder.indexOf(acc[userId].grade) < currentIndex) {
          acc[userId] = {
            id: userId,
            full_name: curr.user.full_name,
            grade: grade,
            gradeIndex: currentIndex
          };
        }
        return acc;
      }, {});

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
      const { data, error } = await supabase
        .from('climb_completions')
        .select(`
          user_id,
          user:profiles!inner(full_name),
          route:routes!inner(style)
        `)
        .eq('routes.style', style);

      if (error) throw error;

      const userCounts = data.reduce((acc: Record<string, any>, curr) => {
        const userId = curr.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            full_name: curr.user.full_name,
            count: 0
          };
        }
        acc[userId].count++;
        return acc;
      }, {});

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
      const { data, error } = await supabase
        .from('user_equipment')
        .select(`
          user_id,
          quantity,
          user:profiles!inner(full_name)
        `);

      if (error) throw error;

      const userCounts = data.reduce((acc: Record<string, any>, curr) => {
        const userId = curr.user_id;
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            full_name: curr.user.full_name,
            totalQuantity: 0
          };
        }
        acc[userId].totalQuantity += curr.quantity || 0;
        return acc;
      }, {});

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
