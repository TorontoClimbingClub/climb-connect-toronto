import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Search, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import { EmojiPickerComponent } from '@/components/ui/emoji-picker';
import { ChatActionsMenu } from '@/components/chat/ChatActionsMenu';
import { CreateEventModal } from '@/components/chat/CreateEventModal';
import { shouldDisplayWithoutBubble } from '@/utils/emojiUtils';

interface ClubMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    avatar_url?: string;
  } | null;
}

export default function ClubTalk() {
  const [messages, setMessages] = useState<ClubMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const viewportRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
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

      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  }, [user]);

  // Toggle delete mode
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedMessages(new Set());
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
        .from('club_messages')
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
        title: "Failed to delete messages",
        variant: "destructive",
      });
    }
  };

  // Load existing messages
  const loadMessages = useCallback(async () => {
    try {
      // Start with optimistic UI to prevent layout shifts
      setIsLoading(false);
      
      const { data, error } = await supabase
        .from('club_messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles(display_name, avatar_url)
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading club messages:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return;
      }

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
  }, []);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('club_messages')
        .insert([
          {
            content: newMessage.trim(),
            user_id: user.id,
          },
        ]);

      if (error) {
        console.error('Error sending club message:', error);
        console.error('Send error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        toast({
          title: "Failed to send message",
          description: `Error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      setNewMessage('');
      // Message will be added via real-time subscription
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleCreateEvent = () => {
    setShowCreateEventModal(true);
  };

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

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    checkAdminStatus();
    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('club-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'club_messages'
        },
        async (payload) => {
          const { data: messageWithProfile } = await supabase
            .from('club_messages')
            .select(`
              id,
              content,
              created_at,
              user_id,
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
  }, [user, checkAdminStatus, loadMessages]);



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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
          <p className="text-gray-500">Please sign in to access Club Talk.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col bg-white">
        {/* Header Skeleton */}
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white">
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Input Skeleton */}
        <div className="p-4 border-t bg-white flex-shrink-0">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white">
        <div>
          <h3 className="font-semibold">Club Talk</h3>
          <p className="text-sm text-gray-500">Toronto Climbing Club discussion • {messages.length} messages</p>
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
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 min-h-0 chat-scrollbar"
        ref={viewportRef}
      >
        <div className="space-y-4">
          {!messagesLoaded ? (
            // Loading state for messages
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className={`h-8 bg-gray-200 rounded animate-pulse ${
                      i % 2 === 0 ? 'w-3/4' : 'w-1/2'
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
            filteredMessages.map((message, index) => {
              const isOwnMessage = message.user_id === user?.id;
              const prevMessage = filteredMessages[index - 1];
              const isConsecutive = prevMessage && prevMessage.user_id === message.user_id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-1' : 'mt-4'} ${
                    isDeleteMode ? 'cursor-pointer hover:bg-gray-50' : ''
                  } ${selectedMessages.has(message.id) ? 'bg-red-50' : ''}`}
                  onClick={() => isDeleteMode && toggleMessageSelection(message.id)}
                >
                  {/* Avatar - only show for other users' messages */}
                  {!isOwnMessage && (
                    <div className="flex flex-col items-center mr-3">
                      {!isConsecutive ? (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={message.profiles?.avatar_url} />
                          <AvatarFallback>
                            {message.profiles?.display_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                    </div>
                  )}
                  
                  <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    {/* Show name and timestamp only for first message in sequence */}
                    {!isConsecutive && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.profiles?.display_name || 'Unknown User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(message.created_at)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
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
                      
                      {shouldDisplayWithoutBubble(message.content) ? (
                        <div className="text-2xl sm:text-3xl">
                          {message.content}
                        </div>
                      ) : (
                        <div
                          className={`px-3 py-2 rounded-2xl break-words ${
                            isOwnMessage
                              ? 'bg-blue-500 text-white rounded-br-md'
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

      {/* Message Input */}
      <div className="p-4 border-t bg-white flex-shrink-0 sticky bottom-0">
        {isDeleteMode && selectedMessages.size > 0 && (
          <div className="mb-3 p-2 bg-red-50 rounded-lg flex items-center justify-between max-w-4xl mx-auto">
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
        <div className="flex gap-2 max-w-4xl mx-auto">
          <ChatActionsMenu 
            onCreateEvent={handleCreateEvent} 
            isAdmin={isAdmin}
            onDeleteMessages={toggleDeleteMode}
            isDeleteMode={isDeleteMode}
          />
          <div className="flex-1 relative">
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
              className="pr-12"
              disabled={isDeleteMode}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
            </div>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isDeleteMode}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CreateEventModal 
        open={showCreateEventModal} 
        onClose={() => setShowCreateEventModal(false)}
        groupName="Club Talk"
      />
    </div>
  );
}