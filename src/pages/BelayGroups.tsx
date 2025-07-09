import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Clock, Search, UserCheck, Globe, Lock, Loader2, Trash2 } from 'lucide-react';
import { BelayGroup, ClimbingType, BelayGroupPrivacy, CLIMBING_TYPE_LABELS, CLIMBING_TYPE_ICONS } from '@/types/belayGroup';
import { formatSessionDate, getTimeUntilSession, canJoinBelayGroup } from '@/utils/belayGroupUtils';

export default function BelayGroups() {
  const [belayGroups, setBelayGroups] = useState<BelayGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<BelayGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [climbingTypeFilter, setClimbingTypeFilter] = useState<'all' | ClimbingType>('all');
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'public' | 'private' | 'joined'>('all');
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchBelayGroups = async () => {
      try {
        // Simplified query - fetch only basic belay groups data
        const { data: groups, error: groupsError } = await supabase
          .from('belay_groups')
          .select('*')
          .gte('session_date', new Date().toISOString())
          .order('session_date', { ascending: true });

        if (groupsError) throw groupsError;

        if (!groups) {
          setBelayGroups([]);
          return;
        }

        // Fetch additional data separately to avoid RLS issues
        const groupsWithDetails = await Promise.all(
          groups.map(async (group) => {
            // Get creator info
            const { data: creator } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('id', group.creator_id)
              .single();

            // Get gym info
            const { data: gym } = await supabase
              .from('groups')
              .select('name')
              .eq('id', group.gym_id)
              .single();

            // Get participant count (simplified)
            const { count: participantCount } = await supabase
              .from('belay_group_participants')
              .select('*', { count: 'exact', head: true })
              .eq('belay_group_id', group.id);

            // Check if current user is a participant
            const { data: userParticipation } = await supabase
              .from('belay_group_participants')
              .select('user_id')
              .eq('belay_group_id', group.id)
              .eq('user_id', user.id)
              .single();

            return {
              ...group,
              creator,
              gym,
              participant_count: participantCount || 0,
              is_participant: !!userParticipation
            };
          })
        );

        setBelayGroups(groupsWithDetails);
      } catch (error) {
        console.error('Error fetching belay groups:', error);
        toast({
          title: 'Error loading belay groups',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBelayGroups();

    // Subscribe to changes (simplified to avoid RLS issues)
    const channel = supabase
      .channel('belay_groups_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'belay_groups'
        },
        () => {
          fetchBelayGroups();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Filter groups based on search and filters
  useEffect(() => {
    let filtered = belayGroups;

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.gym?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.creator?.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Climbing type filter
    if (climbingTypeFilter !== 'all') {
      filtered = filtered.filter(group => group.climbing_type === climbingTypeFilter);
    }

    // Privacy filter
    if (privacyFilter === 'public') {
      filtered = filtered.filter(group => group.privacy === 'public');
    } else if (privacyFilter === 'private') {
      filtered = filtered.filter(group => group.privacy === 'private' && group.is_participant);
    } else if (privacyFilter === 'joined') {
      filtered = filtered.filter(group => group.is_participant);
    }

    // Sort: joined groups first, then by session date
    filtered.sort((a, b) => {
      if (a.is_participant && !b.is_participant) return -1;
      if (!a.is_participant && b.is_participant) return 1;
      return new Date(a.session_date).getTime() - new Date(b.session_date).getTime();
    });

    setFilteredGroups(filtered);
  }, [belayGroups, searchTerm, climbingTypeFilter, privacyFilter]);

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;

    setJoiningGroupId(groupId);
    try {
      const { error } = await supabase
        .from('belay_group_participants')
        .insert([
          {
            belay_group_id: groupId,
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Joined belay group!',
        description: 'You can now chat with other group members.',
      });
    } catch (error) {
      console.error('Error joining belay group:', error);
      toast({
        title: 'Error joining group',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setJoiningGroupId(null);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!user) return;
    
    // Find the group to check if user is creator and only participant
    const group = belayGroups.find(g => g.id === groupId);
    if (!group) return;
    
    // Check if user is the creator
    if (group.creator_id !== user.id) {
      toast({
        title: 'Permission denied',
        description: 'Only the group creator can delete the group.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if there's only one participant (the creator)
    if (group.participant_count && group.participant_count > 1) {
      toast({
        title: 'Cannot delete group',
        description: 'You can only delete a group when you are the only participant.',
        variant: 'destructive',
      });
      return;
    }
    
    // Show confirmation dialog
    const confirmed = confirm(`Are you sure you want to delete "${group.name}"? This action cannot be undone.`);
    if (!confirmed) return;
    
    setDeletingGroupId(groupId);
    try {
      // Delete participants first (should just be the creator)
      const { error: participantsError } = await supabase
        .from('belay_group_participants')
        .delete()
        .eq('belay_group_id', groupId);
      
      if (participantsError) throw participantsError;
      
      // Delete any belay group messages
      const { error: messagesError } = await supabase
        .from('belay_group_messages')
        .delete()
        .eq('belay_group_id', groupId);
      
      if (messagesError) throw messagesError;
      
      // Delete the group itself
      const { error: groupError } = await supabase
        .from('belay_groups')
        .delete()
        .eq('id', groupId);
      
      if (groupError) throw groupError;
      
      // Remove from local state
      setBelayGroups(prev => prev.filter(g => g.id !== groupId));
      
      toast({
        title: 'Group deleted',
        description: `"${group.name}" has been successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting belay group:', error);
      toast({
        title: 'Error deleting group',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setDeletingGroupId(null);
    }
  };

  const handleOpenChat = (groupId: string) => {
    navigate(`/belay-groups/${groupId}/chat`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading belay groups...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-[10px]">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups, locations, gyms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={climbingTypeFilter} onValueChange={(value) => setClimbingTypeFilter(value as 'all' | ClimbingType)}>
                <SelectTrigger id="climbing-type-filter" className="w-[160px]">
                  <SelectValue placeholder="Climbing Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(CLIMBING_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {CLIMBING_TYPE_ICONS[key as ClimbingType]} {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={privacyFilter} onValueChange={(value) => setPrivacyFilter(value as typeof privacyFilter)}>
                <SelectTrigger id="privacy-filter" className="w-[120px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="joined">Joined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No belay groups found</h3>
            <p className="text-muted-foreground">
              {searchTerm || climbingTypeFilter !== 'all' || privacyFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create a belay group in a gym chat to get started!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const canJoin = canJoinBelayGroup(group.status, group.participant_count, group.capacity, group.session_date);
            const timeUntil = getTimeUntilSession(group.session_date);
            
            return (
              <Card key={group.id} className={`transition-all hover:shadow-lg ${group.is_participant ? 'border-green-200 bg-green-50' : ''}`}>
                {/* Mobile card layout */}
                <div className="md:hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{CLIMBING_TYPE_ICONS[group.climbing_type]}</span>
                        <div>
                          <CardTitle className="text-base">{group.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            by {group.creator?.display_name} • {group.gym?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {group.privacy === 'private' ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                        {group.is_participant && <UserCheck className="h-3 w-3 text-green-600" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{group.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatSessionDate(group.session_date, 'short')}</span>
                        <Badge variant="outline" className="text-xs">
                          {timeUntil}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{group.participant_count}/{group.capacity} climbers</span>
                        <Badge variant={group.status === 'full' ? 'destructive' : 'default'} className="text-xs">
                          {group.status === 'full' ? 'Full' : 'Available'}
                        </Badge>
                      </div>
                    </div>

                    {group.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {group.description}
                      </p>
                    )}

                    <div className="pt-2">
                      {group.is_participant ? (
                        <div className="space-y-2">
                          <Button 
                            onClick={() => handleOpenChat(group.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Open Chat
                          </Button>
                          {group.creator_id === user?.id && group.participant_count === 1 && (
                            <Button 
                              onClick={() => handleDeleteGroup(group.id)}
                              disabled={deletingGroupId === group.id}
                              variant="destructive"
                              size="sm"
                              className="w-full"
                            >
                              {deletingGroupId === group.id ? (
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3 mr-2" />
                              )}
                              Delete Group
                            </Button>
                          )}
                        </div>
                      ) : canJoin ? (
                        <Button 
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={joiningGroupId === group.id}
                          className="w-full"
                        >
                          {joiningGroupId === group.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          <Users className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                      ) : (
                        <Button disabled className="w-full">
                          {group.status === 'full' ? 'Group Full' : 'Session Ended'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>

                {/* Desktop row layout */}
                <div className="hidden md:block">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      {/* Left section - Group info */}
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-2xl">{CLIMBING_TYPE_ICONS[group.climbing_type]}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">{group.name}</h3>
                            {group.privacy === 'private' && <Lock className="h-4 w-4 text-muted-foreground" />}
                            {group.is_participant && <UserCheck className="h-4 w-4 text-green-600" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            by {group.creator?.display_name} • {group.gym?.name}
                          </p>
                          {group.description && (
                            <p className="text-sm text-muted-foreground mb-2 max-w-2xl">
                              {group.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{group.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatSessionDate(group.session_date, 'short')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{group.participant_count}/{group.capacity} climbers</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right section - Status and action */}
                      <div className="flex items-center gap-3 ml-4">
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">{timeUntil}</Badge>
                          <Badge variant={group.status === 'full' ? 'destructive' : 'default'}>
                            {group.status === 'full' ? 'Full' : 'Available'}
                          </Badge>
                        </div>
                        {group.is_participant ? (
                          <div className="flex items-center gap-2">
                            <Button 
                              onClick={() => handleOpenChat(group.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Open Chat
                            </Button>
                            {group.creator_id === user?.id && group.participant_count === 1 && (
                              <Button 
                                onClick={() => handleDeleteGroup(group.id)}
                                disabled={deletingGroupId === group.id}
                                variant="destructive"
                                size="sm"
                              >
                                {deletingGroupId === group.id ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3 mr-1" />
                                )}
                                Delete
                              </Button>
                            )}
                          </div>
                        ) : canJoin ? (
                          <Button 
                            onClick={() => handleJoinGroup(group.id)}
                            disabled={joiningGroupId === group.id}
                          >
                            {joiningGroupId === group.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            <Users className="h-4 w-4 mr-2" />
                            Join Group
                          </Button>
                        ) : (
                          <Button disabled>
                            {group.status === 'full' ? 'Group Full' : 'Session Ended'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}