import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Group {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  created_at: string;
  member_count?: number;
  is_member?: boolean;
  has_unread?: boolean;
  latest_message_time?: string;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, [user]);

  const loadGroups = async () => {
    try {
      if (!user) {
        // If no user, just fetch basic group data
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*')
          .order('name');

        if (groupsError) throw groupsError;
        setGroups(groupsData || []);
        return;
      }

      // Efficient single query to get all group info including unread status
      const { data: groupsWithInfo, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner (
            user_id,
            last_read_at,
            member_count:group_id.count()
          ),
          latest_message:group_messages (
            created_at
          )
        `)
        .eq('group_members.user_id', user.id)
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

          // Get the actual latest message
          const { data: latestMessage } = await supabase
            .from('group_messages')
            .select('created_at')
            .eq('group_id', group.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          let hasUnread = false;
          const memberInfo = group.group_members[0]; // Since we filtered by user_id, there's only one

          if (latestMessage && memberInfo) {
            const lastReadAt = memberInfo.last_read_at;
            const latestMessageTime = new Date(latestMessage.created_at);
            
            if (!lastReadAt) {
              // Never read any messages in this group
              hasUnread = true;
            } else {
              const lastReadTime = new Date(lastReadAt);
              hasUnread = latestMessageTime > lastReadTime;
            }

            // Fallback to localStorage for backward compatibility
            if (!hasUnread && !lastReadAt) {
              const lastVisitKey = `group_last_visit_${group.id}`;
              const lastVisit = localStorage.getItem(lastVisitKey);
              if (!lastVisit || latestMessageTime > new Date(lastVisit)) {
                hasUnread = true;
              }
            }
          }

          return {
            id: group.id,
            name: group.name,
            description: group.description,
            avatar_url: group.avatar_url,
            created_at: group.created_at,
            member_count: totalMembers || 0,
            is_member: true, // Since we filtered by membership
            has_unread: hasUnread,
            latest_message_time: latestMessage?.created_at || null
          };
        })
      );

      // Also fetch groups where user is not a member
      const { data: allGroups } = await supabase
        .from('groups')
        .select('*')
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
    } catch (error) {
      console.error('Error loading groups:', error);
      toast({
        title: 'Error loading groups',
        description: 'Please try again later.',
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

  const navigateToGroupChat = (groupId: string, groupName: string) => {
    // Mark group as visited
    const lastVisitKey = `group_last_visit_${groupId}`;
    localStorage.setItem(lastVisitKey, new Date().toISOString());
    
    // Navigate to group chat
    navigate(`/groups/${groupId}/chat`, { state: { groupName } });
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
        <h1 className="text-3xl font-bold mb-2">Climbing Groups</h1>
        <p className="text-gray-600">
          Join group chats for your favorite climbing gyms in Toronto
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card 
            key={group.id} 
            className={`hover:shadow-lg transition-all duration-300 ${
              group.has_unread 
                ? 'ring-2 ring-orange-400 shadow-orange-200 shadow-lg' 
                : ''
            }`}
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
                    <CardTitle className="text-lg flex items-center gap-2">
                      {group.name}
                      {group.has_unread && (
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      )}
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
                      onClick={() => handleLeaveGroup(group.id)}
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
    </div>
  );
}