import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Send, ArrowLeft, Users, MapPin, Clock, UserMinus, Loader2 } from 'lucide-react';
import { BelayGroup, BelayGroupMessage, CLIMBING_TYPE_ICONS } from '@/types/belayGroup';
import { formatSessionDate, getTimeUntilSession } from '@/utils/belayGroupUtils';
import { EmojiPickerComponent } from '@/components/ui/emoji-picker';
import { shouldDisplayWithoutBubble } from '@/utils/emojiUtils';

export default function BelayChat() {
  const { id: belayGroupId } = useParams<{ id: string }>();
  const [belayGroup, setBelayGroup] = useState<BelayGroup | null>(null);
  const [messages, setMessages] = useState<BelayGroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
            setMessages(prev => [...prev, messageWithProfile]);
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

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/belay-groups')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-lg">{CLIMBING_TYPE_ICONS[belayGroup.climbing_type]}</span>
              <div>
                <h1 className="font-semibold">{belayGroup.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {belayGroup.gym?.name} • {participantCount} climbers
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLeaveGroup}
            className="text-red-600 hover:text-red-700"
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Leave
          </Button>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-blue-50 border-b px-4 py-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{belayGroup.location}</span>
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <p>Start the conversation! Say hello to your climbing partners.</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.user_id === user?.id;
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isThreaded = prevMessage && 
              prevMessage.user_id === message.user_id &&
              new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 300000; // 5 minutes

            return (
              <div key={message.id} className={`flex gap-3 ${isThreaded ? 'mt-0.5' : 'mt-4'}`}>
                <div className="flex-shrink-0">
                  {!isOwnMessage && !isThreaded ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.profiles?.avatar_url} />
                      <AvatarFallback>
                        {message.profiles?.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {!isOwnMessage && !isThreaded && (
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.profiles?.display_name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message.created_at)}
                      </span>
                    </div>
                  )}

                  {shouldDisplayWithoutBubble(message.content) ? (
                    <div className="text-2xl sm:text-3xl">
                      {message.content}
                    </div>
                  ) : (
                    <div
                      className={`px-3 py-2 rounded-2xl break-words max-w-[75%] ${
                        isOwnMessage
                          ? 'bg-blue-500 text-white rounded-br-md ml-auto'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}
                    >
                      {message.content}
                    </div>
                  )}

                  {isOwnMessage && !isThreaded && (
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {formatTimestamp(message.created_at)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              placeholder={`Message ${belayGroup.name}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="pr-12"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
            </div>
          </div>
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}