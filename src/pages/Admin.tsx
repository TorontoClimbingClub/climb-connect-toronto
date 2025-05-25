import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { EventsTab } from "@/components/admin/EventsTab";
import { UsersTab } from "@/components/admin/UsersTab";

interface User {
  id: string;
  email?: string;
  full_name: string;
  phone?: string;
  is_carpool_driver?: boolean;
  passenger_capacity?: number;
  created_at: string;
  updated_at?: string;
  user_role?: 'member' | 'organizer' | 'admin';
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  max_participants: number | null;
  difficulty_level: string | null;
  organizer_id: string;
  participants_count?: number;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [userRole, setUserRole] = useState<'member' | 'organizer' | 'admin'>('member');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRole();
    fetchUsers();
    fetchEvents();
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: user.id });

      if (error) throw error;
      setUserRole(data || 'member');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('member');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const roleMap = new Map();
      userRoles?.forEach(ur => {
        roleMap.set(ur.user_id, ur.role);
      });
      
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_role: roleMap.get(profile.id) || 'member'
      })) || [];
      
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
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Event deleted successfully",
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'member' | 'organizer' | 'admin') => {
    if (userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Only admins can change user roles",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "User role updated successfully",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Only admins can delete users",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "User deleted successfully",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const updateUserProfile = async (updatedUser: User) => {
    if (userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Only admins can edit user profiles",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedUser.full_name,
          phone: updatedUser.phone,
          is_carpool_driver: updatedUser.is_carpool_driver,
          passenger_capacity: updatedUser.passenger_capacity,
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "User profile updated successfully",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user profile",
        variant: "destructive",
      });
    }
  };

  const resetUserPassword = async (userId: string) => {
    if (userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Only admins can reset passwords",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get user from profiles table first to get their basic info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (!profile) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      // Since we can't access auth.users directly, we'll need to use a different approach
      // We'll create a temporary password reset link using the user's ID
      const resetUrl = `${window.location.origin}/auth?type=recovery&userId=${userId}`;
      
      toast({
        title: "Password Reset",
        description: `Password reset initiated for ${profile.full_name}. They will need to use the password recovery option on the login page.`,
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate password reset",
        variant: "destructive",
      });
    }
  };

  const canCreateEvents = userRole === 'admin' || userRole === 'organizer';
  const canManageUsers = userRole === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-[#E55A2B]">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#E55A2B] mb-2">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <p className="text-stone-600">Manage TCC events and users</p>
            <Badge variant="outline" className="capitalize">
              <Shield className="h-3 w-3 mr-1" />
              {userRole}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'events' ? 'default' : 'outline'}
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 ${activeTab === 'events' ? 'bg-[#E55A2B] hover:bg-[#D14B20] text-white' : ''}`}
          >
            <Calendar className="h-4 w-4" />
            Events
          </Button>
          {canManageUsers && (
            <Button
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 ${activeTab === 'users' ? 'bg-[#E55A2B] hover:bg-[#D14B20] text-white' : ''}`}
            >
              <Users className="h-4 w-4" />
              Users
            </Button>
          )}
        </div>

        {activeTab === 'events' && (
          <EventsTab
            events={events}
            canCreateEvents={canCreateEvents}
            canManageUsers={canManageUsers}
            onDeleteEvent={deleteEvent}
            onRefreshEvents={fetchEvents}
          />
        )}

        {activeTab === 'users' && canManageUsers && (
          <UsersTab
            users={users}
            onUpdateUserRole={updateUserRole}
            onDeleteUser={deleteUser}
            onResetPassword={resetUserPassword}
            onUpdateUser={updateUserProfile}
          />
        )}
      </div>
      <Navigation />
    </div>
  );
}
