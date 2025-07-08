import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Mountain, TreePine, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";

interface TopicChat {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  member_count?: number;
  is_member?: boolean;
  has_unread?: boolean;
  avatar_url?: string;
}

const topicChats: TopicChat[] = [
  {
    id: 'toronto-climbing-club-main',
    name: 'Toronto Climbing Club Main Chat',
    description: 'General discussion about climbing in Toronto, meetups, and community updates',
    icon: Mountain,
    avatar_url: null
  },
  {
    id: 'outdoors-chat',
    name: 'Outdoors Chat',
    description: 'Discuss outdoor climbing spots, routes, conditions, and outdoor adventures',
    icon: TreePine,
    avatar_url: null
  },
  {
    id: 'bouldering-chat',
    name: 'Bouldering',
    description: 'Everything about bouldering - problems, techniques, and indoor bouldering gyms',
    icon: Zap,
    avatar_url: null
  }
];

export default function Community() {
  const [chats, setChats] = useState<TopicChat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadTopicChats();
  }, [user]);

  const loadTopicChats = async () => {
    try {
      if (!user) {
        setChats(topicChats);
        setLoading(false);
        return;
      }

      // Check if these groups exist and get membership info
      const updatedChats = await Promise.all(
        topicChats.map(async (chat) => {
          // Try to find the group by name
          const { data: groupData } = await supabase
            .from('groups')
            .select(`
              id,
              name,
              description,
              avatar_url,
              group_members!inner (
                user_id,
                last_read_at
              )
            `)
            .eq('name', chat.name)
            .eq('group_members.user_id', user.id)
            .single();

          if (groupData) {
            // Get member count
            const { count: memberCount } = await supabase
              .from('group_members')
              .select('*', { count: 'exact', head: true })
              .eq('group_id', groupData.id);

            // Get latest message for unread detection
            const { data: latestMessage } = await supabase
              .from('group_messages')
              .select('created_at')
              .eq('group_id', groupData.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            let hasUnread = false;
            if (latestMessage && groupData.group_members[0]) {
              const lastReadAt = groupData.group_members[0].last_read_at;
              if (!lastReadAt || new Date(latestMessage.created_at) > new Date(lastReadAt)) {
                hasUnread = true;
              }
            }

            return {
              ...chat,
              id: groupData.id,
              member_count: memberCount || 0,
              is_member: true,
              has_unread: hasUnread,
              avatar_url: groupData.avatar_url
            };
          } else {
            // Check if group exists but user is not a member
            const { data: nonMemberGroup } = await supabase
              .from('groups')
              .select('id, member_count:group_members(count)')
              .eq('name', chat.name)
              .single();

            if (nonMemberGroup) {
              const { count: memberCount } = await supabase
                .from('group_members')
                .select('*', { count: 'exact', head: true })
                .eq('group_id', nonMemberGroup.id);

              return {
                ...chat,
                id: nonMemberGroup.id,
                member_count: memberCount || 0,
                is_member: false,
                has_unread: false
              };
            }

            return {
              ...chat,
              member_count: 0,
              is_member: false,
              has_unread: false
            };
          }
        })
      );

      setChats(updatedChats);
    } catch (error) {
      console.error('Error loading topic chats:', error);
      toast({
        title: 'Error loading chats',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      setChats(topicChats);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChat = async (chatId: string, chatName: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to join topic chats.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({ group_id: chatId, user_id: user.id });

      if (error) throw error;

      toast({
        title: 'Joined chat successfully!',
        description: `You can now participate in ${chatName}.`
      });

      loadTopicChats();
    } catch (error) {
      console.error('Error joining chat:', error);
      toast({
        title: 'Error joining chat',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const navigateToChat = (chatId: string, chatName: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access chats.',
        variant: 'destructive'
      });
      return;
    }

    navigate(`/groups/${chatId}/chat`, { state: { groupName: chatName } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading community chats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Crag Talk</h1>
        <p className="text-gray-600">
          Join topic-based discussions with the Toronto climbing community
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {chats.map((chat) => {
          const IconComponent = chat.icon;
          return (
            <Card
              key={chat.id}
              className={`hover:shadow-lg transition-all duration-300 ${
                chat.has_unread
                  ? 'ring-2 ring-orange-400 shadow-orange-200 shadow-lg'
                  : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {chat.avatar_url ? (
                        <AvatarImage src={chat.avatar_url} />
                      ) : (
                        <AvatarFallback className="bg-green-100">
                          <IconComponent className="h-6 w-6 text-green-600" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {chat.name}
                        {chat.has_unread && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                      </CardTitle>
                      {chat.is_member && (
                        <Badge variant="secondary" className="mt-1">
                          Member
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{chat.description}</CardDescription>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{chat.member_count || 0} members</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {chat.is_member ? (
                    <Button
                      className="w-full"
                      onClick={() => navigateToChat(chat.id, chat.name)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Open Chat
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleJoinChat(chat.id, chat.name)}
                    >
                      Join Chat
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}