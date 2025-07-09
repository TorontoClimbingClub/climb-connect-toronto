import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Send, ArrowLeft, CalendarDays, MapPin, Users, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { ChatActionsMenu } from '@/components/chat/ChatActionsMenu';
import { CreateEventModal } from '@/components/chat/CreateEventModal';
import { EmojiPickerComponent } from '@/components/ui/emoji-picker';
import { EventMessageButton } from '@/components/ui/event-message-button';
import { shouldDisplayWithoutBubble } from '@/utils/emojiUtils';
import { isEventCreationMessage } from '@/utils/eventMessageUtils';

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
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [joiningEvent, setJoiningEvent] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isEventDetailsExpanded, setIsEventDetailsExpanded] = useState(false);
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

  // Toggle delete mode
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedMessages(new Set());
  };

  // Toggle event details expansion
  const toggleEventDetails = () => {
    setIsEventDetailsExpanded(!isEventDetailsExpanded);
  };

  // Toggle message selection
  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  // Delete selected messages
  const deleteSelectedMessages = async () => {
    if (!isAdmin || selectedMessages.size === 0) return;
    
    const messageCount = selectedMessages.size;
    const confirmText = messageCount === 1 ? 
      'Are you sure you want to delete this message? This action cannot be undone.' :
      `Are you sure you want to delete ${messageCount} messages? This action cannot be undone.`;
    
    if (!confirm(confirmText)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('event_messages')
        .delete()
        .in('id', Array.from(selectedMessages));

      if (error) throw error;

      // Remove messages from local state
      setMessages(prev => prev.filter(msg => !selectedMessages.has(msg.id)));
      setSelectedMessages(new Set());
      setIsDeleteMode(false);
      
      toast({
        title: "Success",
        description: `${messageCount} message${messageCount === 1 ? '' : 's'} deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting messages:', error);
      toast({
        title: "Error",
        description: "Failed to delete messages. Please try again.",
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

  // Join event function
  const handleJoinEvent = async () => {
    if (!user || !eventId || joiningEvent) return;

    setJoiningEvent(true);
    try {
      const { error } = await supabase
        .from('event_participants')
        .insert([{
          event_id: eventId,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Joined Event!",
        description: "You have successfully joined the event.",
      });

      // Refresh participant status and event data
      await Promise.all([
        checkParticipation(),
        loadEvent()
      ]);

    } catch (error) {
      console.error('Error joining event:', error);
      toast({
        title: "Error",
        description: "Failed to join event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoiningEvent(false);
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
      const { error } = await supabase
        .from('event_messages')
        .insert([
          {
            content: newMessage,
            user_id: user.id,
            event_id: eventId,
          },
        ]);

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

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleCreateEvent = () => {
    setShowCreateEventModal(true);
  };

  const handleLeaveEvent = async () => {
    if (!user || !eventId) return;

    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Left event',
        description: 'You have left the event.'
      });

      // Navigate back to events page
      navigate('/events');
    } catch (error) {
      console.error('Error leaving event:', error);
      toast({
        title: 'Error leaving event',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const handleLeaveClick = () => {
    setShowLeaveDialog(true);
  };

  const confirmLeave = () => {
    handleLeaveEvent();
    setShowLeaveDialog(false);
  };

  const cancelLeave = () => {
    setShowLeaveDialog(false);
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
      <div className="flex items-center justify-center h-full">
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
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 chat-scrollbar">
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
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Join Event</h3>
          <p className="text-gray-500 mb-4">Join this event to access the chat and participate.</p>
          <div className="space-y-3">
            <Button 
              onClick={handleJoinEvent} 
              disabled={joiningEvent}
              className="w-full"
            >
              {joiningEvent ? 'Joining...' : 'Join Event'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/events')}
              className="w-full"
            >
              Back to Events
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <div className="border-b p-3 sm:p-4 bg-white flex-shrink-0 relative z-20">
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
              {/* Mobile event info - expandable */}
              <div className="sm:hidden text-xs text-gray-600 mt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {event?.participant_count} • {event && format(new Date(event.event_date), 'MMM d')}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleEventDetails}
                    className="h-6 w-6 p-0 hover:bg-gray-100 transition-transform duration-200"
                  >
                    {isEventDetailsExpanded ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Event Details Overlay - Mobile Only */}
      <div 
        className={`sm:hidden absolute top-full left-0 right-0 z-30 bg-white border-b shadow-lg transition-all duration-300 ease-out ${
          isEventDetailsExpanded 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {event && (
          <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-3">
              {/* Event Description */}
              {event.description && (
                <div className="animate-fade-in">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
                </div>
              )}
              
              {/* Event Details Grid */}
              <div className="space-y-2 animate-fade-in">
                <h4 className="font-medium text-gray-900 text-sm">Event Details</h4>
                
                {/* Date and Time */}
                <div className="flex items-start space-x-2">
                  <CalendarDays className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <div className="font-medium">{format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}</div>
                    <div className="text-gray-600">{format(new Date(event.event_date), 'h:mm a')}</div>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700 leading-relaxed">{event.location}</div>
                </div>
                
                {/* Participants */}
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{event.participant_count}</span>
                    {event.max_participants && (
                      <span className="text-gray-600">/{event.max_participants}</span>
                    )} participants
                    {event.max_participants && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out" 
                          style={{ 
                            width: `${Math.min((event.participant_count / event.max_participants) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={viewportRef} className="flex-1 overflow-y-auto p-3 sm:p-4 chat-scrollbar">
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
            messages.map((message, index) => {
              const isOwnMessage = message.user_id === user?.id;
              const prevMessage = messages[index - 1];
              const isThreaded = prevMessage && prevMessage.user_id === message.user_id;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-start ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  } ${isThreaded ? 'mt-0.5' : 'mt-4'} ${
                    isDeleteMode ? 'cursor-pointer hover:bg-gray-50' : ''
                  } ${selectedMessages.has(message.id) ? 'bg-red-50' : ''}`}
                  onClick={() => isDeleteMode && toggleMessageSelection(message.id)}
                >
                  {/* Avatar - only show for other users' messages */}
                  {!isOwnMessage && (
                    <div className="flex flex-col items-center mr-3">
                      {!isThreaded ? (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={message.profiles?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {message.profiles?.display_name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                    </div>
                  )}
                  
                  <div className={`flex flex-col max-w-[75%] ${
                    isOwnMessage ? 'items-end' : 'items-start'
                  }`}>
                    {/* Show name and timestamp only for first message in sequence */}
                    {!isThreaded && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {message.profiles?.display_name || 'Unknown User'}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {format(new Date(message.created_at), 'p')}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {/* Show checkbox in delete mode */}
                      {isDeleteMode && (
                        <input
                          type="checkbox"
                          checked={selectedMessages.has(message.id)}
                          onChange={() => toggleMessageSelection(message.id)}
                          className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      
                      {isEventCreationMessage(message.content) ? (
                        <EventMessageButton 
                          content={message.content}
                          isOwnMessage={isOwnMessage}
                        />
                      ) : shouldDisplayWithoutBubble(message.content) ? (
                        <div className="text-2xl sm:text-3xl">
                          {message.content}
                        </div>
                      ) : (
                        <div
                          className={`px-3 py-2 rounded-2xl break-words ${
                            isOwnMessage
                              ? 'bg-green-600 text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          {message.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-3 sm:p-4 bg-white flex-shrink-0">
        {isDeleteMode && selectedMessages.size > 0 && (
          <div className="mb-3 p-2 bg-red-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-red-700">
              {selectedMessages.size} message{selectedMessages.size === 1 ? '' : 's'} selected
            </span>
            <Button
              onClick={deleteSelectedMessages}
              size="sm"
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected</span>
            </Button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <ChatActionsMenu 
            onCreateEvent={handleCreateEvent}
            onLeave={isParticipant ? handleLeaveClick : undefined}
            leaveText="Leave Event"
            isAdmin={isAdmin}
            onDeleteMessages={toggleDeleteMode}
            isDeleteMode={isDeleteMode}
          />
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="pr-12"
              autoComplete="off"
              disabled={isDeleteMode}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
            </div>
          </div>
          <Button 
            type="submit" 
            size="icon" 
            className="bg-green-600 hover:bg-green-700 flex-shrink-0"
            disabled={!newMessage.trim() || isDeleteMode}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <CreateEventModal 
        open={showCreateEventModal} 
        onClose={() => setShowCreateEventModal(false)}
        groupName={event?.title}
        chatType="event"
        chatId={eventId}
      />
      
      {/* Leave Event Confirmation Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave {event?.title}? You can rejoin later if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLeave}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              Leave Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}