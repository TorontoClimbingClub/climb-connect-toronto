
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CommunityMember {
  id: string;
  full_name: string;
  phone: string | null;
  climbing_description: string | null;
  is_carpool_driver: boolean;
  passenger_capacity: number;
  equipment_count?: number;
  events_count?: number;
}

export function useCommunity() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCommunityMembers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (error) throw error;

      // Get additional stats for each member
      const membersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get equipment count
          const { count: equipmentCount } = await supabase
            .from('user_equipment')
            .select('*', { count: 'exact' })
            .eq('user_id', profile.id);

          // Get events count
          const { count: eventsCount } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact' })
            .eq('user_id', profile.id);

          return {
            ...profile,
            equipment_count: equipmentCount || 0,
            events_count: eventsCount || 0,
          };
        })
      );

      setMembers(membersWithStats);
    } catch (error) {
      console.error('Error fetching community members:', error);
      toast({
        title: "Error",
        description: "Failed to load community members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    
    fetchCommunityMembers();

    return () => {
      abortController.abort();
    };
  }, []);

  return {
    members,
    loading,
    refreshMembers: fetchCommunityMembers
  };
}
