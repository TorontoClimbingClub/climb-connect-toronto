
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

  const updateUserBadges = async (userId: string, retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      console.log(`🏆 [BADGES] Updating badges for user: ${userId} (attempt ${retryCount + 1})`);
      
      // Get current approved attendance count including archived data
      const [currentAttendance, archivedAttendance] = await Promise.all([
        supabase
          .from('event_attendance_approvals')
          .select('user_id, status, event_id')
          .eq('user_id', userId)
          .eq('status', 'approved'),
        // Use type assertion for archived attendance
        (supabase as any)
          .from('archived_event_attendance')
          .select('user_id, event_id')
          .eq('user_id', userId)
      ]);

      const currentCount = currentAttendance.data?.length || 0;
      const archivedCount = archivedAttendance.error ? 0 : (archivedAttendance.data?.length || 0);
      const totalAttendanceCount = currentCount + archivedCount;
      
      console.log(`🏆 [BADGES] User ${userId} attendance counts:`, { 
        currentCount, 
        archivedCount, 
        totalAttendanceCount 
      });

      const badgeThresholds = [1, 5, 10, 20, 50];
      const badgeNames = ['Event Newcomer', 'Regular Climber', 'Dedicated Member', 'Event Enthusiast', 'TCC Legend'];

      // Get all event-related badges
      const { data: eventBadges, error: badgeError } = await supabase
        .from('badges')
        .select('*')
        .in('name', badgeNames);

      if (badgeError) throw badgeError;
      if (!eventBadges) return;

      // CRITICAL FIX: Remove unearned badges FIRST
      console.log(`🗑️ [BADGES] Checking for badges to remove for user ${userId}`);
      
      for (const badge of eventBadges) {
        const badgeIndex = badgeNames.indexOf(badge.name);
        const requiredCount = badgeThresholds[badgeIndex];
        
        if (totalAttendanceCount < requiredCount) {
          console.log(`🗑️ [BADGES] Removing badge ${badge.name} from user ${userId} (has ${totalAttendanceCount}, needs ${requiredCount})`);
          
          const { error: removeError } = await supabase
            .from('user_badges')
            .delete()
            .eq('user_id', userId)
            .eq('badge_id', badge.id);
          
          if (removeError) {
            console.error('❌ [BADGES] Error removing badge:', removeError);
            throw removeError;
          } else {
            console.log(`✅ [BADGES] Successfully removed badge ${badge.name} from user ${userId}`);
          }
        }
      }

      // Award badges that are now earned
      console.log(`🏆 [BADGES] Checking for badges to award for user ${userId}`);
      
      for (let i = 0; i < badgeThresholds.length; i++) {
        if (totalAttendanceCount >= badgeThresholds[i]) {
          const badge = eventBadges.find(b => b.name === badgeNames[i]);
          if (badge) {
            console.log(`🏆 [BADGES] Awarding badge ${badge.name} to user ${userId}`);
            
            const { error: awardError } = await supabase
              .from('user_badges')
              .upsert({ 
                user_id: userId, 
                badge_id: badge.id 
              }, { 
                onConflict: 'user_id,badge_id' 
              });
            
            if (awardError) {
              console.error('❌ [BADGES] Error awarding badge:', awardError);
              throw awardError;
            } else {
              console.log(`✅ [BADGES] Successfully awarded badge ${badge.name} to user ${userId}`);
            }
          }
        }
      }

      // Refresh user badges data
      await fetchUserBadges();
      
      console.log(`✅ [BADGES] Badge update completed for user ${userId}`);
      
    } catch (error: any) {
      console.error(`❌ [BADGES] Error updating user badges (attempt ${retryCount + 1}):`, error);
      
      // Retry logic with exponential backoff
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`🔄 [BADGES] Retrying badge update for user ${userId} in ${delay}ms`);
        
        setTimeout(() => {
          updateUserBadges(userId, retryCount + 1);
        }, delay);
      } else {
        console.error(`❌ [BADGES] Max retries exceeded for user ${userId}`);
        toast({
          title: "Badge Update Failed",
          description: "There was an issue updating badges. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    }
  };

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
        
        await updateUserBadges(userId);
        
        // Add small delay to prevent overwhelming the database
        if (i < userArray.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
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

  // Enhanced real-time subscription with better error handling
  useEffect(() => {
    const channel = supabase
      .channel('badges-realtime-enhanced-v2')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to ALL events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'event_attendance_approvals'
        },
        async (payload) => {
          console.log('🔄 [BADGES] Attendance approval changed, updating badges:', payload);
          
          try {
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
          } catch (error) {
            console.error('❌ [BADGES] Error in real-time badge update:', error);
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
