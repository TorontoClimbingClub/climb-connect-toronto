import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, MapPin, Clock, UserMinus, Loader2 } from 'lucide-react';
import { BelayGroup, BelayGroupMessage, CLIMBING_TYPE_ICONS } from '@/types/belayGroup';
import { formatSessionDate, getTimeUntilSession } from '@/utils/belayGroupUtils';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { BelayDetailsDropdown } from '@/components/chat/ChatDetailsDropdown';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';

export default function BelayChat() {
  const { id: belayGroupId } = useParams<{ id: string }>();
  const [belayGroup, setBelayGroup] = useState<BelayGroup | null>(null);
  const [messages, setMessages] = useState<BelayGroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!belayGroupId || !user) return;

    const fetchBelayGroupData = async () => {
      try {
        // Fetch belay group details
        const { data: groupData, error: groupError } = await supabase
          .from('belay_groups')
          .select(`
            *,
            creator:profiles!creator_id(display_name, avatar_url),
            gym:groups!gym_id(name),
            participants:belay_group_participants(
              user_id,
              profiles(display_name, avatar_url)
            )
          `)
          .eq('id', belayGroupId)
          .single();

        if (groupError) throw groupError;

        setBelayGroup(groupData);
        setParticipantCount(groupData.participants?.length || 0);
        setIsParticipant(groupData.participants?.some(p => p.user_id === user.id) || false);

        // Fetch messages if user is a participant
        if (groupData.participants?.some(p => p.user_id === user.id)) {
          const { data: messagesData, error: messagesError } = await supabase
            .from('belay_group_messages')
            .select(`
              *,
              profiles(display_name, avatar_url)
            `)
            .eq('belay_group_id', belayGroupId)
            .order('created_at', { ascending: true });

          if (messagesError) throw messagesError;

          setMessages(messagesData || []);
        }
      } catch (error) {
        console.error('Error fetching belay group data:', error);
        toast({
          title: 'Error loading belay group',
          description: 'Please try again later.',
          variant: 'destructive',
        });
        navigate('/belay-groups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBelayGroupData();

    // Subscribe to message changes
    const messageChannel = supabase
      .channel(`belay_group_messages_${belayGroupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'belay_group_messages',
          filter: `belay_group_id=eq.${belayGroupId}`
        },
        async (payload) => {
          // Fetch the message with profile data
          const { data: messageWithProfile } = await supabase
            .from('belay_group_messages')
            .select(`
              *,
              profiles(display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (messageWithProfile) {
            setMessages(prev => {
              const updatedMessages = [...prev, messageWithProfile];
              
              // Force scroll to bottom after adding new message
              setTimeout(() => {
                const messageContainer = document.querySelector('.chat-scrollbar');
                if (messageContainer) {
                  messageContainer.scrollTop = messageContainer.scrollHeight;
                }
              }, 50);
              
              return updatedMessages;
            });
          }
        }
      )
      .subscribe();

    // Subscribe to participant changes
    const participantChannel = supabase
      .channel(`belay_group_participants_${belayGroupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'belay_group_participants',
          filter: `belay_group_id=eq.${belayGroupId}`
        },
        () => {
          fetchBelayGroupData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(participantChannel);
    };
  }, [belayGroupId, user, toast, navigate]);


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !belayGroupId || !isParticipant) return;

    try {
      const { error } = await supabase
        .from('belay_group_messages')
        .insert([
          {
            belay_group_id: belayGroupId,
            user_id: user.id,
            content: newMessage.trim(),
          },
        ]);

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleLeaveGroup = async () => {
    if (!user || !belayGroupId) return;

    try {
      const { error } = await supabase
        .from('belay_group_participants')
        .delete()
        .eq('belay_group_id', belayGroupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Left belay group',
        description: 'You have left the belay group.',
      });

      navigate('/belay-groups');
    } catch (error) {
      console.error('Error leaving belay group:', error);
      toast({
        title: 'Error leaving group',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };


  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading belay group...</span>
        </div>
      </div>
    );
  }

  if (!belayGroup) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Belay group not found</h2>
          <Button onClick={() => navigate('/belay-groups')}>
            Back to Belay Groups
          </Button>
        </div>
      </div>
    );
  }

  if (!isParticipant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-muted-foreground mb-4">
              You need to join this belay group to access the chat.
            </p>
            <Button onClick={() => navigate('/belay-groups')}>
              Back to Belay Groups
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timeUntil = getTimeUntilSession(belayGroup.session_date);
  const isExpired = new Date(belayGroup.session_date) < new Date();

  return (
    <ChatContainer>
      <ChatHeader
        title={belayGroup.name}
        subtitle={`${belayGroup.gym?.name} • ${participantCount} climbers`}
        onBack={() => navigate('/belay-groups')}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{CLIMBING_TYPE_ICONS[belayGroup.climbing_type]}</span>
        </div>
      </ChatHeader>

      {/* Belay Session Details Dropdown */}
      <BelayDetailsDropdown
        summary={
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{participantCount} climbers</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatSessionDate(belayGroup.session_date, 'short')}</span>
              {!isExpired && (
                <Badge variant="outline" className="text-xs ml-1">
                  {timeUntil}
                </Badge>
              )}
            </div>
          </div>
        }
      >
        {/* Session Description */}
        {belayGroup.description && (
          <div className="animate-fade-in">
            <h4 className="font-medium text-gray-900 text-sm mb-1">Description</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{belayGroup.description}</p>
          </div>
        )}
        
        {/* Session Details Grid */}
        <div className="space-y-2 animate-fade-in">
          <h4 className="font-medium text-gray-900 text-sm">Session Details</h4>
          
          {/* Date and Time */}
          <div className="flex items-start space-x-2">
            <Clock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <div className="font-medium">{formatSessionDate(belayGroup.session_date, 'long')}</div>
              <div className="text-gray-600">
                {!isExpired ? `${timeUntil}` : 'Session has ended'}
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700 leading-relaxed">{belayGroup.location}</div>
          </div>
          
          {/* Gym Information */}
          {belayGroup.gym && (
            <div className="flex items-start space-x-2">
              <div className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0 flex items-center justify-center">
                🏔️
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">{belayGroup.gym.name}</div>
            </div>
          )}
          
          {/* Participants */}
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
            <div className="text-sm text-gray-700">
              <span className="font-medium">{participantCount}</span> climbers joined
            </div>
          </div>
          
          {/* Climbing Type */}
          <div className="flex items-center space-x-2">
            <span className="text-lg">{CLIMBING_TYPE_ICONS[belayGroup.climbing_type]}</span>
            <div className="text-sm text-gray-700">
              <span className="font-medium capitalize">{belayGroup.climbing_type}</span> climbing
            </div>
          </div>
        </div>
      </BelayDetailsDropdown>

      <ChatMessages
        messages={messages}
        currentUserId={user?.id}
        isLoading={false}
        emptyMessage="Start the conversation! Say hello to your climbing partners."
        formatTimestamp={formatTimestamp}
      />

      <ChatInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        placeholder={`Message ${belayGroup.name}...`}
        leftButton={
          <Button
            variant="outline"
            size="icon"
            onClick={handleLeaveGroup}
            className="text-red-600 hover:text-red-700"
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        }
      />
    </ChatContainer>
  );
}