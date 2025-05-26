import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { User, ProfileData } from "@/types/admin";
import type { Event } from "@/types/events";

export function useAdminData() {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [canCreateEvents, setCanCreateEvents] = useState(false);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user?.id) return;
    
    try {
      const { data: role } = await supabase.rpc('get_user_role', { _user_id: user.id });
      
      if (role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        return;
      }
      
      setCanCreateEvents(true);
      setCanManageUsers(true);
      await Promise.all([fetchUsers(), fetchEvents()]);
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin access",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get user roles for each profile
      const usersWithRoles = await Promise.all(
        (profiles || []).map(async (profile: ProfileData) => {
          const { data: role } = await supabase.rpc('get_user_role', { _user_id: profile.id });
          
          return {
            id: profile.id,
            email: `${profile.full_name.toLowerCase().replace(/\s+/g, '')}@example.com`, // Placeholder since we can't access auth.users
            full_name: profile.full_name,
            phone: profile.phone,
            is_carpool_driver: profile.is_carpool_driver,
            passenger_capacity: profile.passenger_capacity,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            user_role: role || 'member',
            climbing_level: profile.climbing_level,
            climbing_experience: profile.climbing_experience
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events_with_participants')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    }
  };

  return {
    users,
    events,
    loading,
    canCreateEvents,
    canManageUsers,
    fetchUsers,
    fetchEvents
  };
}
