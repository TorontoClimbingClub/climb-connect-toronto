import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";

interface Group {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  created_at: string;
  member_count?: number;
  is_member?: boolean;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveGroupId, setLeaveGroupId] = useState<string | null>(null);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, [user]);

  // Define community chat names to exclude from groups page
  const communityChats = [
    'Toronto Climbing Club Main Chat',
    'Outdoors Chat', 
    'Bouldering'
  ];

  const loadGroups = async () => {
    try {
      if (!user) {
        // If no user, just fetch basic group data excluding community chats
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .not('name', 'in', `(${communityChats.map(name => `"${name}"`).join(',')})`)
          .order('name');

        if (groupsError) throw groupsError;
        setGroups(groupsData || []);
        return;
      }

      // Get groups where user is a member, excluding community chats
      const { data: groupsWithInfo, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner (
            user_id,
            last_read_at
          )
        `)
        .eq('group_members.user_id', user.id)
        .not('name', 'in', `(${communityChats.map(name => `"${name}"`).join(',')})`)
        .order('name');

      if (error) throw error;

      // Process the data to determine unread status and member counts
      const processedGroups = await Promise.all(
        (groupsWithInfo || []).map(async (group) => {
          // Get total member count for this group
          const { count: totalMembers } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);


          return {
            id: group.id,
            name: group.name,
            description: group.description,
            avatar_url: group.avatar_url,
            created_at: group.created_at,
            member_count: totalMembers || 0,
            is_member: true, // Since we filtered by membership
          };
        })
      );

      // Also fetch groups where user is not a member, excluding community chats
      const { data: allGroups } = await supabase
        .from('groups')
        .select('*')
        .not('name', 'in', `(${communityChats.map(name => `"${name}"`).join(',')})`)
        .order('name');

      const nonMemberGroups = await Promise.all(
        (allGroups || [])
          .filter(group => !processedGroups.some(pg => pg.id === group.id))
          .map(async (group) => {
            const { count: totalMembers } = await supabase
              .from('group_members')
              .select('*', { count: 'exact', head: true })
              .eq('group_id', group.id);

            return {
              ...group,
              member_count: totalMembers || 0,
              is_member: false,
              has_unread: false,
              latest_message_time: null
            };
          })
      );

      setGroups([...processedGroups, ...nonMemberGroups]);
    } catch (error: any) {
      console.error('Error loading groups:', error);
      toast({
        title: 'Error loading groups',
        description: error?.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to join groups.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: user.id });

      if (error) throw error;

      toast({
        title: 'Joined group successfully!',
        description: 'You can now access the group chat.'
      });

      // Reload groups to update member status
      loadGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: 'Error joining group',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Left group',
        description: 'You have left the group.'
      });

      // Reload groups to update member status
      loadGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: 'Error leaving group',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const handleLeaveClick = (groupId: string) => {
    setLeaveGroupId(groupId);
    setIsLeaveDialogOpen(true);
  };

  const confirmLeave = () => {
    if (leaveGroupId) {
      handleLeaveGroup(leaveGroupId);
      setIsLeaveDialogOpen(false);
      setLeaveGroupId(null);
    }
  };

  const cancelLeave = () => {
    setIsLeaveDialogOpen(false);
    setLeaveGroupId(null);
  };

  const navigateToGroupChat = (groupId: string, groupName: string) => {
    // Preload the chat page by navigating immediately
    // This prevents any loading flicker by maintaining the current page state
    navigate(`/groups/${groupId}/chat`, { 
      state: { groupName },
      replace: false // Keep in history for back button
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gym Talk</h1>
        <p className="text-gray-600">
          Join group chats for your favorite climbing gyms in Toronto
        </p>
      </div>

      {groups.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups available</h3>
            <p className="text-gray-500">Groups will appear here once they are created.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
          <Card 
            key={group.id} 
            className="hover:shadow-lg transition-all duration-300"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={group.avatar_url || undefined} />
                    <AvatarFallback>
                      {group.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {group.name}
                    </CardTitle>
                    {group.is_member && (
                      <Badge variant="secondary" className="mt-1">
                        Member
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{group.description}</CardDescription>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{group.member_count || 0} members</span>
                </div>
              </div>

              <div className="flex gap-2">
                {group.is_member ? (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => navigateToGroupChat(group.id, group.name)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Open Chat
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleLeaveClick(group.id)}
                    >
                      Leave
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    Join Group
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Leave Group Confirmation Dialog */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this group? You'll need to be re-invited to join again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLeave}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}