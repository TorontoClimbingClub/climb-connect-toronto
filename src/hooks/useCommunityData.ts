
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CommunityMember } from "@/types/community";

export function useCommunityData() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunityMembers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('👥 [COMMUNITY] Fetching community members with enhanced stats...');

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (profilesError) throw profilesError;

      // Fetch equipment counts
      const { data: equipmentCounts, error: equipmentError } = await supabase
        .from('user_equipment')
        .select('user_id, quantity');

      if (equipmentError) throw equipmentError;

      // Fetch current approved attendance
      const { data: currentAttendance, error: attendanceError } = await supabase
        .from('event_attendance_approvals')
        .select('user_id')
        .eq('status', 'approved');

      if (attendanceError) throw attendanceError;

      // Try to fetch archived attendance
      let archivedAttendance: any[] = [];
      try {
        const { data: archived } = await (supabase as any)
          .from('archived_event_attendance')
          .select('user_id');
        archivedAttendance = archived || [];
      } catch (error) {
        console.log('👥 [COMMUNITY] No archived attendance data available');
      }

      // Calculate equipment counts per user
      const equipmentCountsByUser = equipmentCounts?.reduce((acc: any, item) => {
        acc[item.user_id] = (acc[item.user_id] || 0) + (item.quantity || 0);
        return acc;
      }, {}) || {};

      // Calculate total events count per user (current + archived)
      const allAttendance = [...(currentAttendance || []), ...archivedAttendance];
      const eventsCountsByUser = allAttendance.reduce((acc: any, item) => {
        acc[item.user_id] = (acc[item.user_id] || 0) + 1;
        return acc;
      }, {});

      // Map profiles with enhanced stats
      const enhancedMembers: CommunityMember[] = (profiles || []).map(profile => ({
        ...profile,
        equipment_count: equipmentCountsByUser[profile.id] || 0,
        events_count: eventsCountsByUser[profile.id] || 0,
        climbing_experience: profile.climbing_experience || []
      }));

      console.log('👥 [COMMUNITY] Enhanced members loaded:', {
        total: enhancedMembers.length,
        withEquipment: Object.keys(equipmentCountsByUser).length,
        withEvents: Object.keys(eventsCountsByUser).length
      });

      setMembers(enhancedMembers);

    } catch (error: any) {
      console.error('❌ [COMMUNITY] Error fetching community members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    members,
    loading,
    fetchCommunityMembers
  };
}
