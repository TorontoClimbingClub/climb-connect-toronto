
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useBadgeCalculation() {
  const { toast } = useToast();

  const recalculateUserBadges = async (userId: string, onRefresh?: () => Promise<void>) => {
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
      if (onRefresh) {
        await onRefresh();
      }
      
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

  const syncAllUserBadges = async (onRefresh?: () => Promise<void>) => {
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
        
        await recalculateUserBadges(userId, onRefresh);
        
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

  return {
    recalculateUserBadges,
    syncAllUserBadges
  };
}
