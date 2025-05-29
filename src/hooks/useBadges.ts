
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge, UserBadge } from "@/types/badges";

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setBadges(data || []);
    } catch (error: any) {
      console.error('Error fetching badges:', error);
      toast({
        title: "Error",
        description: "Failed to load badges",
        variant: "destructive",
      });
    }
  };

  const fetchUserBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setUserBadges(data || []);
    } catch (error: any) {
      console.error('Error fetching user badges:', error);
      toast({
        title: "Error",
        description: "Failed to load user badges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserBadges = (userId: string): UserBadge[] => {
    return userBadges.filter(ub => ub.user_id === userId);
  };

  useEffect(() => {
    Promise.all([fetchBadges(), fetchUserBadges()]);
  }, []);

  return {
    badges,
    userBadges,
    loading,
    getUserBadges,
    refreshBadges: () => Promise.all([fetchBadges(), fetchUserBadges()])
  };
}
