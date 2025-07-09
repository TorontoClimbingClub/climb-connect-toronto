import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface GroupWithStats {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  created_by: string;
  created_at: string;
  member_count: number;
  is_member: boolean;
  profiles: {
    display_name: string;
  };
}

export function useGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: groups = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['groups', user?.id],
    queryFn: async () => {
      const data = await ApiService.getGroups();
      
      // Filter to only include gym-related groups (exclude general community topic chats)
      const gymGroups = (data || []).filter(group => {
        const groupName = group.name.toLowerCase();
        // Exclude general community chats that should be in Crag Talk
        const excludedNames = [
          'toronto climbing club main chat',
          'outdoors chat', 
          'bouldering'
        ];
        return !excludedNames.some(excluded => groupName.includes(excluded.toLowerCase()));
      });
      
      // Get member counts and check if current user is a member
      const groupsWithStats = await Promise.all(
        gymGroups.map(async (group) => {
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);

          const { data: membership } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', group.id)
            .eq('user_id', user?.id)
            .single();

          return {
            ...group,
            member_count: count || 0,
            is_member: !!membership,
          };
        })
      );

      return groupsWithStats;
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });

  const joinGroupMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      ApiService.joinGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: "Joined group successfully!" });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to join group.";
      if (error?.code === '23505') {
        errorMessage = "You're already a member of this group.";
      }
      toast({ title: errorMessage, variant: "destructive" });
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      ApiService.leaveGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: "Left group successfully" });
    },
    onError: () => {
      toast({ title: "Failed to leave group", variant: "destructive" });
    },
  });

  const joinGroup = (groupId: string) => {
    if (!user) return;
    joinGroupMutation.mutate({ groupId, userId: user.id });
  };

  const leaveGroup = (groupId: string) => {
    if (!user) return;
    leaveGroupMutation.mutate({ groupId, userId: user.id });
  };

  const myGroups = groups.filter(group => group.is_member);
  const availableGroups = groups.filter(group => !group.is_member);

  return {
    groups,
    myGroups,
    availableGroups,
    isLoading,
    error,
    joinGroup,
    leaveGroup,
    isJoining: joinGroupMutation.isPending,
    isLeaving: leaveGroupMutation.isPending,
  };
}