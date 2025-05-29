
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge, UserBadge } from "@/types/badges";

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const createDefaultBadges = async () => {
    const defaultBadges = [
      { name: 'Event Newcomer', description: 'Attended your first TCC event', icon: 'Award', color: '#10B981' },
      { name: 'Regular Climber', description: 'Attended 5 TCC events', icon: 'Mountain', color: '#3B82F6' },
      { name: 'Dedicated Member', description: 'Attended 10 TCC events', icon: 'Trophy', color: '#8B5CF6' },
      { name: 'Event Enthusiast', description: 'Attended 20 TCC events', icon: 'Crown', color: '#F59E0B' },
      { name: 'TCC Legend', description: 'Attended 50+ TCC events', icon: 'Star', color: '#EF4444' }
    ];

    for (const badge of defaultBadges) {
      try {
        await supabase
          .from('badges')
          .upsert(badge, { onConflict: 'name' });
      } catch (error) {
        console.log('Badge may already exist:', badge.name);
      }
    }
  };

  const fetchBadges = async () => {
    try {
      // First try to create default badges
      await createDefaultBadges();
      
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
