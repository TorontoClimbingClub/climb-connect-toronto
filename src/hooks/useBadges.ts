
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

      // ENHANCED LOGIC: Remove badges that are no longer earned FIRST
      for (const badge of eventBadges) {
        const badgeIndex = badgeNames.indexOf(badge.name);
        const requiredCount = badgeThresholds[badgeIndex];
        
        if (totalAttendanceCount < requiredCount) {
          console.log(`🗑️ [BADGES] Removing badge ${badge.name} from user ${userId} (has ${totalAttendanceCount}, needs ${requiredCount})`);
          const { error } = await supabase
            .from('user_badges')
            .delete()
            .eq('user_id', userId)
            .eq('badge_id', badge.id);
          
          if (error) {
            console.error('❌ [BADGES] Error removing badge:', error);
          } else {
            console.log(`✅ [BADGES] Successfully removed badge ${badge.name} from user ${userId}`);
          }
        }
      }

      // Award badges that are now earned
      for (let i = 0; i < badgeThresholds.length; i++) {
        if (totalAttendanceCount >= badgeThresholds[i]) {
          const badge = eventBadges.find(b => b.name === badgeNames[i]);
          if (badge) {
            console.log(`🏆 [BADGES] Awarding badge ${badge.name} to user ${userId}`);
            const { error } = await supabase
              .from('user_badges')
              .upsert({ 
                user_id: userId, 
                badge_id: badge.id 
              }, { 
                onConflict: 'user_id,badge_id' 
              });
            
            if (error) {
              console.error('❌ [BADGES] Error awarding badge:', error);
            } else {
              console.log(`✅ [BADGES] Successfully awarded badge ${badge.name} to user ${userId}`);
            }
          }
        }
      }

      // Refresh user badges data
      await fetchUserBadges();
      
    } catch (error: any) {
      console.error('❌ [BADGES] Error updating user badges:', error);
    }
  };

  // Manual badge sync function for fixing existing inconsistencies
  const syncAllUserBadges = async () => {
    try {
      console.log('🔄 [BADGES] Starting manual badge sync for all users...');
      
      // Get all unique user IDs from both current and archived attendance
      const [currentUsers, archivedUsers] = await Promise.all([
        supabase
          .from('event_attendance_approvals')
          .select('user_id')
          .eq('status', 'approved'),
        (supabase as any)
          .from('archived_event_attendance')
          .select('user_id')
      ]);

      const userIds = new Set([
        ...(currentUsers.data?.map(u => u.user_id) || []),
        ...(archivedUsers.error ? [] : (archivedUsers.data?.map(u => u.user_id) || []))
      ]);

      console.log(`🔄 [BADGES] Syncing badges for ${userIds.size} users...`);

      // Update badges for each user
      for (const userId of userIds) {
        await updateUserBadges(userId);
      }

      console.log('✅ [BADGES] Manual badge sync completed');
      toast({
        title: "Success",
        description: `Badge sync completed for ${userIds.size} users`,
      });
      
    } catch (error: any) {
      console.error('❌ [BADGES] Error in manual badge sync:', error);
      toast({
        title: "Error",
        description: "Failed to sync badges",
        variant: "destructive",
      });
    }
  };

  const getUserBadges = (userId: string): UserBadge[] => {
    return userBadges.filter(ub => ub.user_id === userId);
  };

  // ENHANCED REAL-TIME SUBSCRIPTION: Handle ALL attendance changes including deletions
  useEffect(() => {
    const channel = supabase
      .channel('badges-realtime-enhanced')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to ALL events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        async (payload) => {
          console.log('🔄 [BADGES] Attendance approval changed, updating badges:', payload);
          
          // Handle INSERT and UPDATE events
          if (payload.new && typeof payload.new === 'object' && 'user_id' in payload.new && payload.new.user_id) {
            console.log('🔄 [BADGES] Processing INSERT/UPDATE for user:', payload.new.user_id);
            await updateUserBadges(payload.new.user_id as string);
          }
          
          // Handle DELETE events - this was the missing piece!
          if (payload.old && typeof payload.old === 'object' && 'user_id' in payload.old && payload.old.user_id) {
            console.log('🔄 [BADGES] Processing DELETE for user:', payload.old.user_id);
            await updateUserBadges(payload.old.user_id as string);
          }
          
          // Handle UPDATE events where user_id might have changed
          if (payload.old && payload.new && 
              typeof payload.old === 'object' && 'user_id' in payload.old && payload.old.user_id &&
              typeof payload.new === 'object' && 'user_id' in payload.new && payload.new.user_id &&
              payload.old.user_id !== payload.new.user_id) {
            console.log('🔄 [BADGES] Processing user_id change:', { 
              old: payload.old.user_id, 
              new: payload.new.user_id 
            });
            await updateUserBadges(payload.old.user_id as string);
            await updateUserBadges(payload.new.user_id as string);
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
    syncAllUserBadges, // New function for manual badge sync
    refreshBadges: () => Promise.all([fetchBadges(), fetchUserBadges()])
  };
}
