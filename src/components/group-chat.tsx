import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Search, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ChatActionsMenu } from '@/components/chat-actions-menu';
import { CreateEventModal } from '@/components/create-event-modal';

interface GroupMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  group_id: string;
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (viewportRef.current) {
      const scrollContainer = viewportRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
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
          profiles!inner(display_name, avatar_url)
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
          },
        ])
        .select(`
          id,
          content,
          created_at,
          user_id,
          group_id,
          profiles!inner(display_name, avatar_url)
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
  const postEventCreationMessage = async (eventTitle: string, eventDate: string) => {
    if (!user) return;

    try {
      const eventDateFormatted = new Date(eventDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });

      const eventMessage = `📅 Created event: "${eventTitle}" on ${eventDateFormatted}`;

      await supabase
        .from('group_messages')
        .insert([
          {
            content: eventMessage,
            user_id: user.id,
            group_id: groupId,
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
      
      // Update database
      await supabase
        .from('group_members')
        .update({ last_read_at: now })
        .eq('group_id', groupId)
        .eq('user_id', user.id);
      
      // Also update localStorage for backward compatibility
      const lastVisitKey = `group_last_visit_${groupId}`;
      localStorage.setItem(lastVisitKey, now);
    } catch (error) {
      console.error('Error updating read status:', error);
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
      }, 1000); // Wait 1 second before marking as read
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

  // Set up real-time subscription
  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel(`group-messages-${groupId}`)
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
              profiles!inner(display_name, avatar_url)
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
    <Card className="h-full w-full flex flex-col border-0 rounded-none bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/groups')}
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
      <div className="flex-1 overflow-y-auto p-4" ref={viewportRef} onScroll={handleScroll}>
        <div className="space-y-4">
          {filteredMessages.map((message) => {
            const isOwnMessage = message.user_id === user?.id;
            
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
                
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {message.profiles?.display_name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.created_at)}
                    </span>
                  </div>
                  
                  <div
                    className={`rounded-lg px-3 py-2 max-w-full break-words ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
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
        onEventCreated={(eventTitle, eventDate) => {
          postEventCreationMessage(eventTitle, eventDate);
        }}
      />
    </Card>
  );
}