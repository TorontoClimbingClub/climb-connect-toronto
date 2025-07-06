import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface EventMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  event_id: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
  } | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  max_participants: number;
  participant_count?: number;
}

export default function EventChat() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<EventMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isParticipant, setIsParticipant] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      const scrollContainer = viewportRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, []);

  // Check if user is participant
  const checkParticipation = async () => {
    if (!user || !eventId) return;

    const { data } = await supabase
      .from('event_participants')
      .select('user_id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    setIsParticipant(!!data);
  };

  // Load event details
  const loadEvent = async () => {
    if (!eventId) return;

    try {
      const { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;

      // Get participant count
      const { count } = await supabase
        .from('event_participants')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

      setEvent({ ...eventData, participant_count: count || 0 });
    } catch (error) {
      console.error('Error loading event:', error);
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    }
  };

  // Load messages
  const loadMessages = async () => {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from('event_messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          event_id,
          profiles!inner(display_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !eventId || !isParticipant) return;

    try {
      const { data, error } = await supabase
        .from('event_messages')
        .insert([
          {
            content: newMessage,
            user_id: user.id,
            event_id: eventId,
          },
        ])
        .select(`
          id,
          content,
          created_at,
          user_id,
          event_id,
          profiles!inner(display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setNewMessage('');
      
      if (data) {
        setMessages(prev => [...prev, data]);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!eventId) return;

    checkParticipation();
    loadEvent();
    loadMessages();

    const channel = supabase
      .channel(`event_messages:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'event_messages',
          filter: `event_id=eq.${eventId}`,
        },
        async (payload) => {
          const newMsg = payload.new as EventMessage;
          
          // Fetch the profile data for the new message
          const { data: profileData } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', newMsg.user_id)
            .single();

          if (profileData) {
            newMsg.profiles = profileData;
          }

          setMessages(current => {
            // Check if message already exists
            if (current.find(m => m.id === newMsg.id)) {
              return current;
            }
            return [...current, newMsg];
          });
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, user, scrollToBottom]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <p className="text-gray-500">Please sign in to access event chat.</p>
        </Card>
      </div>
    );
  }

  if (!isParticipant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Not a Participant</h3>
          <p className="text-gray-500 mb-4">You must join this event to access the chat.</p>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/events')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{event?.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  {event && format(new Date(event.event_date), 'PPP')}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event?.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {event?.participant_count} participants
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={viewportRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.user_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.profiles?.avatar_url} />
                  <AvatarFallback>
                    {message.profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col ${
                    isOwnMessage ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.profiles?.display_name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(message.created_at), 'p')}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg max-w-md ${
                      isOwnMessage
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}