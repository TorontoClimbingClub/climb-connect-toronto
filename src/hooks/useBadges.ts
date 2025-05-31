
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

  const recalculateUserBadges = async (userId: string) => {
    try {
      console.log(`🏆 [BADGES] Starting fresh badge recalculation for user: ${userId}`);
      
      // Step 1: Get fresh attendance count from database
      const [currentAttendance, archivedAttendance] = await Promise.all([
        supabase
          .from('event_attendance_approvals')
          .select('user_id', { count: 'exact' })
          .eq('user_id', userId)
          .eq('status', 'approved'),
        (supabase as any)
          .from('archived_event_attendance')
          .select('user_id', { count: 'exact' })
          .eq('user_id', userId)
      ]);

      const currentCount = currentAttendance.count || 0;
      const archivedCount = archivedAttendance.error ? 0 : (archivedAttendance.count || 0);
      const totalAttendanceCount = currentCount + archivedCount;
      
      console.log(`🏆 [BADGES] Fresh attendance count for user ${userId}:`, { 
        currentCount, 
        archivedCount, 
        totalAttendanceCount 
      });

      // Step 2: Get all event badge definitions
      const { data: eventBadges, error: badgeError } = await supabase
        .from('badges')
        .select('*')
        .in('name', ['Event Newcomer', 'Regular Climber', 'Dedicated Member', 'Event Enthusiast', 'TCC Legend']);

      if (badgeError) throw badgeError;
      if (!eventBadges) return;

      // Step 3: Remove ALL existing event badges for this user (clean slate approach)
      console.log(`🗑️ [BADGES] Removing all existing event badges for user ${userId}`);
      
      const eventBadgeIds = eventBadges.map(badge => badge.id);
      const { error: removeError } = await supabase
        .from('user_badges')
        .delete()
        .eq('user_id', userId)
        .in('badge_id', eventBadgeIds);
      
      if (removeError) {
        console.error('❌ [BADGES] Error removing existing badges:', removeError);
        throw removeError;
      }

      console.log(`✅ [BADGES] Successfully removed all existing event badges for user ${userId}`);

      // Step 4: Award badges based on current attendance count
      const badgeThresholds = [1, 5, 10, 20, 50];
      const badgeNames = ['Event Newcomer', 'Regular Climber', 'Dedicated Member', 'Event Enthusiast', 'TCC Legend'];
      
      const badgesToAward = [];
      
      for (let i = 0; i < badgeThresholds.length; i++) {
        if (totalAttendanceCount >= badgeThresholds[i]) {
          const badge = eventBadges.find(b => b.name === badgeNames[i]);
          if (badge) {
            badgesToAward.push({
              user_id: userId,
              badge_id: badge.id
            });
            console.log(`🏆 [BADGES] Will award badge: ${badge.name} (threshold: ${badgeThresholds[i]})`);
          }
        }
      }

      // Step 5: Award all earned badges in one operation
      if (badgesToAward.length > 0) {
        const { error: awardError } = await supabase
          .from('user_badges')
          .insert(badgesToAward);
        
        if (awardError) {
          console.error('❌ [BADGES] Error awarding badges:', awardError);
          throw awardError;
        }
        
        console.log(`✅ [BADGES] Successfully awarded ${badgesToAward.length} badges to user ${userId}`);
      } else {
        console.log(`📝 [BADGES] No badges to award for user ${userId} (attendance: ${totalAttendanceCount})`);
      }

      // Step 6: Refresh user badges data
      await fetchUserBadges();
      
      console.log(`✅ [BADGES] Badge recalculation completed for user ${userId}`);
      
    } catch (error: any) {
      console.error(`❌ [BADGES] Error in badge recalculation for user ${userId}:`, error);
      toast({
        title: "Badge Update Failed",
        description: "There was an issue updating badges. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  // Alias for backward compatibility
  const updateUserBadges = recalculateUserBadges;

  // Manual badge sync function for fixing existing inconsistencies
  const syncAllUserBadges = async () => {
    try {
      console.log('🔄 [BADGES] Starting comprehensive badge sync for all users...');
      
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

      // Update badges for each user with staggered processing
      const userArray = Array.from(userIds);
      for (let i = 0; i < userArray.length; i++) {
        const userId = userArray[i];
        console.log(`🔄 [BADGES] Processing user ${i + 1}/${userArray.length}: ${userId}`);
        
        await recalculateUserBadges(userId);
        
        // Add small delay to prevent overwhelming the database
        if (i < userArray.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      console.log('✅ [BADGES] Comprehensive badge sync completed');
      toast({
        title: "Success",
        description: `Badge sync completed for ${userIds.size} users`,
      });
      
    } catch (error: any) {
      console.error('❌ [BADGES] Error in comprehensive badge sync:', error);
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

  // Simplified real-time subscription - just trigger recalculation on any attendance change
  useEffect(() => {
    const channel = supabase
      .channel('badges-realtime-simplified')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to ALL events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        async (payload) => {
          console.log('🔄 [BADGES] Attendance changed, triggering badge recalculation:', payload);
          
          try {
            // Handle both new and old records to cover all event types
            const userIds = new Set<string>();
            
            if (payload.new && typeof payload.new === 'object' && 'user_id' in payload.new && payload.new.user_id) {
              userIds.add(payload.new.user_id as string);
            }
            
            if (payload.old && typeof payload.old === 'object' && 'user_id' in payload.old && payload.old.user_id) {
              userIds.add(payload.old.user_id as string);
            }
            
            // Recalculate badges for affected users
            for (const userId of userIds) {
              console.log('🔄 [BADGES] Recalculating badges for affected user:', userId);
              await recalculateUserBadges(userId);
            }
            
          } catch (error) {
            console.error('❌ [BADGES] Error in real-time badge recalculation:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('🔄 [BADGES] Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ [BADGES] Successfully subscribed to real-time badge updates');
        }
      });

    return () => {
      console.log('🔄 [BADGES] Cleaning up real-time subscription');
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
    syncAllUserBadges,
    refreshBadges: () => Promise.all([fetchBadges(), fetchUserBadges()])
  };
}
