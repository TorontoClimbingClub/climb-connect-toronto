
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

  const updateUserBadges = async (userId: string) => {
    try {
      console.log('🏆 [BADGES] Updating badges for user:', userId);
      
      // Get current approved attendance count including archived data
      const [currentAttendance, archivedAttendance] = await Promise.all([
        supabase
          .from('event_attendance_approvals')
          .select('user_id, status, event_id')
          .eq('user_id', userId)
          .eq('status', 'approved'),
        // Use type assertion for the new table since it's not in generated types yet
        (supabase as any)
          .from('archived_event_attendance')
          .select('user_id, event_id')
          .eq('user_id', userId)
      ]);

      const currentCount = currentAttendance.data?.length || 0;
      const archivedCount = archivedAttendance.error ? 0 : (archivedAttendance.data?.length || 0);
      const totalAttendanceCount = currentCount + archivedCount;
      
      console.log('🏆 [BADGES] Attendance counts:', { currentCount, archivedCount, totalAttendanceCount });

      const badgeThresholds = [1, 5, 10, 20, 50];
      const badgeNames = ['Event Newcomer', 'Regular Climber', 'Dedicated Member', 'Event Enthusiast', 'TCC Legend'];

      // Get all event-related badges
      const { data: eventBadges } = await supabase
        .from('badges')
        .select('*')
        .in('name', badgeNames);

      if (!eventBadges) return;

      // Remove badges that are no longer earned
      for (const badge of eventBadges) {
        const badgeIndex = badgeNames.indexOf(badge.name);
        const requiredCount = badgeThresholds[badgeIndex];
        
        if (totalAttendanceCount < requiredCount) {
          console.log(`🗑️ [BADGES] Removing badge ${badge.name} from user ${userId} (has ${totalAttendanceCount}, needs ${requiredCount})`);
          await supabase
            .from('user_badges')
            .delete()
            .eq('user_id', userId)
            .eq('badge_id', badge.id);
        }
      }

      // Award badges that are now earned
      for (let i = 0; i < badgeThresholds.length; i++) {
        if (totalAttendanceCount >= badgeThresholds[i]) {
          const badge = eventBadges.find(b => b.name === badgeNames[i]);
          if (badge) {
            console.log(`🏆 [BADGES] Awarding badge ${badge.name} to user ${userId}`);
            await supabase
              .from('user_badges')
              .upsert({ 
                user_id: userId, 
                badge_id: badge.id 
              }, { 
                onConflict: 'user_id,badge_id' 
              });
          }
        }
      }

      // Refresh user badges data
      await fetchUserBadges();
      
    } catch (error: any) {
      console.error('Error updating user badges:', error);
    }
  };

  const getUserBadges = (userId: string): UserBadge[] => {
    return userBadges.filter(ub => ub.user_id === userId);
  };

  // Set up real-time subscription to update badges when attendance changes
  useEffect(() => {
    const channel = supabase
      .channel('badges-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        async (payload) => {
          console.log('🔄 [BADGES] Attendance approval updated, updating badges:', payload);
          if (payload.new?.user_id) {
            await updateUserBadges(payload.new.user_id);
          }
          if (payload.old?.user_id && payload.old.user_id !== payload.new?.user_id) {
            await updateUserBadges(payload.old.user_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    Promise.all([fetchBadges(), fetchUserBadges()]);
  }, []);

  return {
    badges,
    userBadges,
    loading,
    getUserBadges,
    updateUserBadges,
    refreshBadges: () => Promise.all([fetchBadges(), fetchUserBadges()])
  };
}
