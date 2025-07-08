import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Search, X, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useChatViewport } from '@/hooks/useMobileViewport';

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
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

interface EnhancedRealtimeChatProps {
  roomName: string;
  username: string;
  onMessage?: (message: ChatMessage) => void;
}

export function EnhancedRealtimeChat({ roomName, username, onMessage }: EnhancedRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [joiningEventIds, setJoiningEventIds] = useState<Set<string>>(new Set());
  const viewportRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mobile viewport management
  const viewport = useChatViewport();

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
        .from('messages')
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
    console.log('Loading messages...');
    try {
      // Optimistic UI update to prevent layout shifts
      setIsLoading(false);
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          message_type,
          event_id,
          event_metadata,
          profiles(display_name, avatar_url)
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return;
      }

      console.log('Loaded messages:', data);
      setMessages(data || []);
      setMessagesLoaded(true);
      
      // Smooth scroll after data loads
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    } catch (error) {
      console.error('Error in loadMessages:', error);
    }
  }, [scrollToBottom]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    console.log('Sending message:', { content: newMessage, user_id: user.id });

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage,
            user_id: user.id,
          },
        ])
        .select(`
          id,
          content,
          created_at,
          user_id,
          message_type,
          event_id,
          event_metadata,
          profiles(display_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error sending message:', error);
        console.error('Send error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return;
      }

      console.log('Message sent successfully:', data);
      setNewMessage('');
      // Scroll to bottom after sending message
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel('community-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          console.log('New message received:', payload.new);
          
          // Fetch the complete message with profile data
          const { data: messageWithProfile } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              created_at,
              user_id,
              message_type,
              event_id,
              event_metadata,
              profiles(display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (messageWithProfile) {
            setMessages(prev => [...prev, messageWithProfile]);
            onMessage?.(messageWithProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMessages, onMessage]);

  // Check admin status when user changes
  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user, checkAdminStatus]);

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
      <div className="chat-container-with-nav w-full bg-white">
        {/* Header Skeleton */}
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white safe-top">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Messages Skeleton */}
        <div className="chat-messages p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className={`h-8 bg-gray-200 rounded animate-pulse ${
                    i % 3 === 0 ? 'w-4/5' : i % 3 === 1 ? 'w-2/3' : 'w-1/2'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Input Skeleton */}
        <div className="p-4 border-t bg-white touch-input">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container-with-nav w-full bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white safe-top">
        <div>
          <h3 className="font-semibold">Community Chat</h3>
          <p className="text-sm text-gray-500">All members • {messages.length} messages</p>
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
              setShowSearch(!showSearch);
              if (showSearch) setSearchTerm('');
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="chat-messages p-4 mobile-scroll"
        ref={viewportRef}
        style={{ 
          height: viewport.shouldUseFixedInput 
            ? `calc(${viewport.messagesHeightWithNav}px)` 
            : 'auto',
          paddingBottom: viewport.shouldUseFixedInput 
            ? `${viewport.chatInputHeight + viewport.safeAreaInsets.bottom}px` 
            : '1rem'
        }}
      >
        <div className="space-y-4">
          {!messagesLoaded ? (
            // Loading state for messages
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className={`h-8 bg-gray-200 rounded animate-pulse ${
                      i % 3 === 0 ? 'w-4/5' : i % 3 === 1 ? 'w-2/3' : 'w-1/2'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            filteredMessages.map((message) => {
            const isOwnMessage = message.user_id === user?.id;
            const isEventMessage = message.message_type === 'event';
            
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
                    // Event message with join button
                    <div className={`border-2 border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3 w-full ${
                      isOwnMessage ? 'border-blue-300' : ''
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-blue-900">
                            📅 {message.event_metadata.title}
                          </h4>
                          <p className="text-sm text-blue-700">
                            📍 {message.event_metadata.location}
                          </p>
                          <p className="text-sm text-blue-700">
                            🕒 {new Date(message.event_metadata.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-sm text-blue-600">
                            👥 Max: {message.event_metadata.max_participants} participants
                          </p>
                        </div>
                        
                        {message.event_id && !isOwnMessage && (
                          <Button
                            size="sm"
                            onClick={() => joinEvent(message.event_id!)}
                            disabled={joiningEventIds.has(message.event_id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                          >
                            {joiningEventIds.has(message.event_id) ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                                Joining...
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3" />
                                Join
                              </>
                            )}
                          </Button>
                        )}
                        
                        {isOwnMessage && (
                          <div className="text-xs text-blue-600 font-medium">
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
          })}
        </div>
      </div>

      {/* Message Input - Mobile Optimized */}
      <div 
        className={`
          p-4 border-t bg-white touch-input
          ${viewport.shouldUseFixedInput ? 'chat-input-fixed' : 'chat-input-sticky'}
        `}
        style={{
          paddingBottom: viewport.shouldUseFixedInput 
            ? `calc(1rem + ${viewport.safeAreaInsets.bottom}px)` 
            : '1rem'
        }}
      >
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 touch-input"
            style={{ fontSize: '16px' }} // Prevent iOS zoom
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="touch-optimized"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}