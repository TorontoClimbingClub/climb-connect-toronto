import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Search, ArrowLeft, X, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ChatActionsMenu } from '@/components/chat-actions-menu';
import { CreateEventModal } from '@/components/create-event-modal';

interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  group_id: string;
  message_type?: string;
  event_id?: string;
  event_metadata?: {
    title: string;
    date: string;
    location: string;
    max_participants: number;
  };
  profiles: {
    display_name: string;
    avatar_url?: string;
  } | null;
}

interface GroupChatProps {
  groupId: string;
  groupName: string;
}

export function GroupChat({ groupId, groupName }: GroupChatProps) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [joiningEventIds, setJoiningEventIds] = useState<Set<string>>(new Set());
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (viewportRef.current) {
      const scrollContainer = viewportRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

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
        .from('group_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      // Remove message from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  // Join event function
  const joinEvent = async (eventId: string) => {
    if (!user || joiningEventIds.has(eventId)) return;

    // Add to joining state
    setJoiningEventIds(prev => new Set([...prev, eventId]));

    try {
      // Check if already participating
      const { data: existingParticipation, error: checkError } = await supabase
        .from('event_participants')
        .select('user_id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingParticipation) {
        toast({
          title: "Already joined!",
          description: "You're already participating in this event.",
        });
        return;
      }

      // Insert participation
      const { error: insertError } = await supabase
        .from('event_participants')
        .insert([
          {
            event_id: eventId,
            user_id: user.id,
          },
        ]);

      if (insertError) throw insertError;

      toast({
        title: "Joined event!",
        description: "You've successfully joined the event.",
      });
    } catch (error) {
      console.error('Error joining event:', error);
      toast({
        title: "Failed to join event",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      // Remove from joining state
      setJoiningEventIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  // Load existing messages
  const loadMessages = useCallback(async () => {
    console.log('Loading group messages for:', groupId);
    try {
      const { data, error } = await supabase
        .from('group_messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          group_id,
          message_type,
          event_id,
          event_metadata,
          profiles(display_name, avatar_url)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading group messages:', error);
        return;
      }

      console.log('Loaded group messages:', data);
      setMessages(data || []);
      // Scroll to bottom after messages load
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error in loadMessages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    console.log('Sending group message:', { content: newMessage, user_id: user.id, group_id: groupId });

    try {
      const { data, error } = await supabase
        .from('group_messages')
        .insert([
          {
            content: newMessage,
            user_id: user.id,
            group_id: groupId,
            client_message_id: generateClientMessageId(), // Prevent duplicates
          },
        ])
        .select(`
          id,
          content,
          created_at,
          user_id,
          group_id,
          profiles(display_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error sending group message:', error);
        return;
      }

      console.log('Group message sent successfully:', data);
      setNewMessage('');
      
      // Mark messages as read when user sends a message
      updateReadStatus();
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  // Function to post event creation message to chat
  const postEventCreationMessage = async (eventTitle: string, eventDate: string, eventId: string, location: string, maxParticipants: number) => {
    if (!user) return;

    try {
      const eventDateFormatted = new Date(eventDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });

      // Create interactive event message instead of plain text
      await supabase
        .from('group_messages')
        .insert([
          {
            content: `📅 Created event: "${eventTitle}"`, // Shorter text, details in metadata
            user_id: user.id,
            group_id: groupId,
            message_type: 'event',
            event_id: eventId,
            event_metadata: {
              title: eventTitle,
              date: eventDateFormatted,
              location: location,
              max_participants: maxParticipants
            }
          },
        ]);
    } catch (error) {
      console.error('Error posting event creation message:', error);
    }
  };

  // Function to update read status in database
  const updateReadStatus = useCallback(async () => {
    if (!user || !groupId) return;
    
    try {
      const now = new Date().toISOString();
      
      // Update database with error checking
      const { error } = await supabase
        .from('group_members')
        .update({ last_read_at: now })
        .eq('group_id', groupId)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Database update error:', error);
        // Still update localStorage as fallback
      }
      
      // Always update localStorage for backward compatibility
      const lastVisitKey = `group_last_visit_${groupId}`;
      localStorage.setItem(lastVisitKey, now);
    } catch (error) {
      console.error('Error updating read status:', error);
      // Ensure localStorage is updated even if database fails
      try {
        const lastVisitKey = `group_last_visit_${groupId}`;
        localStorage.setItem(lastVisitKey, new Date().toISOString());
      } catch (storageError) {
        console.error('localStorage fallback failed:', storageError);
      }
    }
  }, [user, groupId]);

  // Debounced scroll handler to prevent excessive database calls
  const handleScroll = useCallback(() => {
    if (!viewportRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
    
    if (isAtBottom) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce the update to avoid excessive calls
      scrollTimeoutRef.current = setTimeout(() => {
        updateReadStatus();
        scrollTimeoutRef.current = null;
      }, 500); // Wait 500ms before marking as read
    }
  }, [updateReadStatus]);

  // Mark as read when component unmounts (user leaves chat)
  useEffect(() => {
    return () => {
      // Clear any pending scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Mark as read when leaving
      updateReadStatus();
    };
  }, [updateReadStatus]);

  // Check admin status when user changes
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user, checkAdminStatus]);

  // Set up real-time subscription
  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel(`group-messages-realtime-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`
        },
        async (payload) => {
          console.log('New group message received:', payload.new);
          
          // Fetch the complete message with profile data
          const { data: messageWithProfile } = await supabase
            .from('group_messages')
            .select(`
              id,
              content,
              created_at,
              user_id,
              group_id,
              message_type,
              event_id,
              event_metadata,
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMessages, groupId]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Filter messages based on search
  const filteredMessages = messages.filter(message =>
    !searchTerm || 
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.profiles?.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-gray-500">Loading group chat...</div>
      </Card>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              // Update read status immediately when navigating back
              await updateReadStatus();
              navigate('/groups');
            }}
            className="p-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h3 className="font-semibold">{groupName}</h3>
            <p className="text-sm text-gray-500">{messages.length} messages</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showSearch && (
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (showSearch) {
                setSearchTerm('');
                setShowSearch(false);
              } else {
                setShowSearch(true);
              }
            }}
          >
            {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0" ref={viewportRef} onScroll={handleScroll}>
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            filteredMessages.map((message) => {
              const isOwnMessage = message.user_id === user?.id;
              const isEventMessage = message.message_type === 'event' && message.event_metadata;
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.profiles?.avatar_url} />
                    <AvatarFallback>
                      {message.profiles?.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} ${isEventMessage ? 'max-w-[85%]' : 'max-w-[70%]'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.profiles?.display_name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(message.created_at)}
                      </span>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMessage(message.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete message (Admin)"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    {isEventMessage && message.event_metadata ? (
                      // Compact event message with minimal join button
                      <div className={`border border-blue-200 rounded-lg px-3 py-2 bg-blue-50 w-full ${
                        isOwnMessage ? 'bg-blue-100 border-blue-300' : ''
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="font-medium text-blue-900 text-sm truncate">
                                📅 {message.event_metadata.title}
                              </span>
                            </div>
                            <div className="text-xs text-blue-700 space-x-3">
                              <span>📍 {message.event_metadata.location}</span>
                              <span>🕒 {message.event_metadata.date}</span>
                              <span>👥 {message.event_metadata.max_participants}</span>
                            </div>
                          </div>
                          
                          {message.event_id && !isOwnMessage && (
                            <Button
                              size="sm"
                              onClick={() => joinEvent(message.event_id!)}
                              disabled={joiningEventIds.has(message.event_id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2 text-xs flex-shrink-0"
                            >
                              {joiningEventIds.has(message.event_id) ? (
                                <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent" />
                              ) : (
                                <UserPlus className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          
                          {isOwnMessage && (
                            <div className="text-xs text-blue-600 font-medium flex-shrink-0">
                              Your event
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Regular text message
                      <div
                        className={`rounded-lg px-3 py-2 max-w-full break-words ${
                          isOwnMessage
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Message Input - Fixed to bottom */}
      <div className="p-4 border-t flex-shrink-0 bg-white sticky bottom-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ChatActionsMenu 
              onCreateEvent={() => setIsEventModalOpen(true)}
            />
            <Input
              placeholder={`Message ${groupName}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Event Creation Modal */}
      <CreateEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        groupName={groupName}
        onEventCreated={(eventTitle, eventDate, eventId, location, maxParticipants) => {
          postEventCreationMessage(eventTitle, eventDate, eventId, location, maxParticipants);
        }}
      />
    </div>
  );
}