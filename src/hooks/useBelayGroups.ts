import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BelayService } from '@/services/BelayService';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { BelayGroup } from '@/types/belayGroup';

export function useBelayGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: belayGroups = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['belay-groups', user?.id],
    queryFn: async () => {
      const groups = await BelayService.getBelayGroups();
      
      // Fetch additional details for each group
      const groupsWithDetails = await Promise.all(
        groups.map(async (group) => {
          try {
            return await BelayService.getBelayGroupWithDetails(group.id);
          } catch (error) {
            console.error('Error fetching group details:', error);
            return {
              ...group,
              creator: null,
              gym: null,
              participant_count: 0,
              is_participant: false
            };
          }
        })
      );

      // Check if current user is a participant for each group
      const groupsWithParticipation = await Promise.all(
        groupsWithDetails.map(async (group) => {
          if (!user) return { ...group, is_participant: false };
          
          try {
            const participants = await BelayService.getBelayGroupParticipants(group.id);
            const isParticipant = participants?.some(p => p.user_id === user.id) || false;
            return { ...group, is_participant: isParticipant };
          } catch (error) {
            return { ...group, is_participant: false };
          }
        })
      );

      return groupsWithParticipation;
    },
    enabled: !!user,
    staleTime: 30000,
  });

  const joinGroupMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      BelayService.joinBelayGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['belay-groups'] });
      toast({ title: 'Joined belay group!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error joining group',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      BelayService.leaveBelayGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['belay-groups'] });
      toast({ title: 'Left belay group' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error leaving group',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      BelayService.deleteBelayGroup(groupId, userId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: ['belay-groups'] });
      // Also remove from local state for immediate UI update
      queryClient.setQueryData(['belay-groups', user?.id], (old: any[]) => 
        old?.filter(g => g.id !== groupId) || []
      );
      toast({ title: 'Group deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting group',
        description: error.message,
        variant: 'destructive',
      });
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

  const deleteGroup = (groupId: string) => {
    if (!user) return;
    deleteGroupMutation.mutate({ groupId, userId: user.id });
  };

  return {
    belayGroups,
    isLoading,
    error,
    joinGroup,
    leaveGroup,
    deleteGroup,
    isJoining: joinGroupMutation.isPending,
    isLeaving: leaveGroupMutation.isPending,
    isDeleting: deleteGroupMutation.isPending,
    refetch,
  };
}