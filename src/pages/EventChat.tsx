import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, CalendarDays, MapPin, Users, X } from 'lucide-react';
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
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (viewportRef.current) {
      const scrollContainer = viewportRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, []);

  // Check if user is admin
  const checkAdminStatus = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  }, [user]);

  // Delete message function for admins
  const deleteMessage = async (messageId: string) => {
    if (!isAdmin) return;
    
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('event_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      // Remove message from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if user is participant
  const checkParticipation = async () => {
    if (!user || !eventId) return;

    try {
      const { data } = await supabase
        .from('event_participants')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      setIsParticipant(!!data);
    } catch (error) {
      console.error('Error checking participation:', error);
      setIsParticipant(false);
    }
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
          profiles(display_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      setMessagesLoaded(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    } catch (error) {
      console.error('Error loading messages:', error);
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
          profiles(display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setNewMessage('');
      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };




  // Check admin status when user changes
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user, checkAdminStatus]);

  // Initialize component data
  const initializeChat = async () => {
    if (!eventId || !user) return;

    try {
      // Run all initialization tasks in parallel
      await Promise.all([
        checkParticipation(),
        loadEvent(),
        loadMessages()
      ]);
      
      // Only set loading to false after all data is loaded
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing chat:', error);
      setIsLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!eventId || !user) return;

    initializeChat();

    const channel = supabase
      .channel(`event-messages-realtime-${eventId}`)
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
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'event_messages',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          console.log('Event message deleted:', payload.old);
          setMessages(current => current.filter(msg => msg.id !== payload.old.id));
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

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col chat-container bg-white">
        {/* Header Skeleton */}
        <div className="border-b p-3 sm:p-4 bg-white flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="hidden sm:flex space-x-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="sm:hidden">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-2 sm:space-x-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className={`h-8 bg-gray-200 rounded animate-pulse ${
                    i % 2 === 0 ? 'w-3/4' : 'w-1/2'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Input Skeleton */}
        <div className="border-t p-3 sm:p-4 bg-white flex-shrink-0">
          <div className="flex space-x-2">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
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

  return (
    <div className="h-full w-full flex flex-col chat-container bg-white">
      {/* Header */}
      <div className="border-b p-3 sm:p-4 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigate('/events');
              }}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold truncate">{event?.title}</h1>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600 mt-1">
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
              {/* Mobile event info - condensed */}
              <div className="sm:hidden text-xs text-gray-600 mt-1">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {event?.participant_count} • {event && format(new Date(event.event_date), 'MMM d')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={viewportRef} className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
        <div className="space-y-3 sm:space-y-4">
          {!messagesLoaded ? (
            // Loading state for messages
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-2 sm:space-x-3">
                  <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className={`h-8 bg-gray-200 rounded animate-pulse ${
                      i % 2 === 0 ? 'w-3/4' : 'w-1/2'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.user_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 sm:space-x-3 ${
                    isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarImage src={message.profiles?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {message.profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col min-w-0 flex-1 ${
                      isOwnMessage ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {message.profiles?.display_name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {format(new Date(message.created_at), 'p')}
                      </span>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMessage(message.id)}
                          className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete message (Admin)"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[85%] sm:max-w-md break-words ${
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
      </div>

      {/* Input - Fixed to bottom */}
      <div className="border-t p-3 sm:p-4 bg-white flex-shrink-0 sticky bottom-0">
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
            autoComplete="off"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-green-600 hover:bg-green-700 flex-shrink-0"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}