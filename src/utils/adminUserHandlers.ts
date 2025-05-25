
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/admin";

export function useUserHandlers(fetchUsers: () => Promise<void>) {
  const { toast } = useToast();

  const handleUpdateUserRole = async (userId: string, newRole: 'member' | 'organizer' | 'admin') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `User role updated to ${newRole}`,
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This will permanently remove their account and they will not be able to log in. This action cannot be undone.')) {
      return;
    }

    try {
      // First delete from profiles table (this will cascade to other related tables)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Then delete the user from Supabase Auth using the database function
      // Use the raw RPC call since TypeScript types might not be updated yet
      const { error: authError } = await supabase.rpc('delete_user_account' as any, {
        user_id: userId
      });

      if (authError) {
        // If the auth deletion fails, we should still show success for the profile deletion
        // but inform the admin that the auth account may still be active
        console.error('Auth deletion error:', authError);
        toast({
          title: "Partial Success",
          description: "User profile deleted, but authentication account may still be active. Contact support if needed.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "User account and authentication access permanently deleted",
        });
      }

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (userId: string, newPassword: string) => {
    try {
      // Note: This would require service role access which we don't have with anon key
      // For now, just show a message that this feature requires additional setup
      toast({
        title: "Feature Unavailable",
        description: "Password reset requires service role configuration",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedUser.full_name,
          phone: updatedUser.phone,
          is_carpool_driver: updatedUser.is_carpool_driver,
          passenger_capacity: updatedUser.passenger_capacity,
          climbing_level: updatedUser.climbing_level,
          climbing_experience: updatedUser.climbing_experience
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "User updated successfully",
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    }
  };

  return {
    handleUpdateUserRole,
    handleDeleteUser,
    handleResetPassword,
    handleUpdateUser
  };
}
