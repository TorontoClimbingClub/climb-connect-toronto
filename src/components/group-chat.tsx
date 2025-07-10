import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Search, Trash2, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { EventMessageButton } from '@/components/ui/event-message-button';
import { BelayGroupMessageButton } from '@/components/ui/belay-group-message-button';
import { ChatActionsMenu } from '@/components/chat/ChatActionsMenu';
import { CreateEventModal } from '@/components/chat/CreateEventModal';
import { CreateBelayGroupModal } from '@/components/chat/CreateBelayGroupModal';
import { shouldDisplayWithoutBubble } from '@/utils/emojiUtils';
import { isEventCreationMessage } from '@/utils/eventMessageUtils';
import { isBelayGroupMessage } from '@/utils/belayGroupUtils';
import { MessageReactions } from '@/components/ui/message-reactions';

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
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateBelayGroupModal, setShowCreateBelayGroupModal] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();


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
        .from('group_messages')
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
          profiles(display_name, avatar_url)
        `)
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading group messages:', error);
        setIsLoading(false);
        return;
      }

      console.log('Loaded group messages:', data);
      setMessages(data || []);
      setMessagesLoaded(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error in loadMessages:', error);
      setIsLoading(false);
    }
  }, [groupId]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    console.log('Sending group message:', { content: newMessage, user_id: user.id, group_id: groupId });

    try {
      const { error } = await supabase
        .from('group_messages')
        .insert([
          {
            content: newMessage,
            user_id: user.id,
            group_id: groupId,
          },
        ]);

      if (error) {
        console.error('Error sending group message:', error);
        return;
      }

      console.log('Group message sent successfully');
      setNewMessage('');
      
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

  const handleFindPartners = () => {
    setShowCreateBelayGroupModal(true);
  };

  const handleLeaveGroup = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Left group',
        description: 'You have left the group.'
      });

      // Navigate back to groups page
      navigate('/groups');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: 'Error leaving group',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const handleLeaveClick = () => {
    setShowLeaveDialog(true);
  };

  const confirmLeave = () => {
    handleLeaveGroup();
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
              profiles(display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (messageWithProfile) {
            setMessages(prev => {
              // Check if message already exists to prevent duplicates
              if (prev.find(m => m.id === messageWithProfile.id)) {
                return prev;
              }
              return [...prev, messageWithProfile];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${groupId}`
        },
        (payload) => {
          console.log('Group message deleted:', payload.old);
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadMessages, groupId]);


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
      <div className="h-full w-full flex flex-col bg-white">
        {/* Header Skeleton */}
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  <div className={`h-8 bg-gray-200 rounded animate-pulse ${
                    i % 2 === 0 ? 'w-3/4' : 'w-1/2'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Input Skeleton */}
        <div className="p-4 border-t flex-shrink-0 bg-white">
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const customRenderMessage = (message: GroupMessage, isOwnMessage: boolean) => {
    const messageIndex = filteredMessages.findIndex(m => m.id === message.id);
    const prevMessage = messageIndex > 0 ? filteredMessages[messageIndex - 1] : null;
    const isThreaded = prevMessage && prevMessage.user_id === message.user_id;
    
    return (
      <div
        key={message.id}
        className={`group flex items-start ${
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
                {formatTimestamp(message.created_at)}
              </span>
            </div>
          )}
          
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              {/* Show checkbox in delete mode */}
              {isDeleteMode && (
                <input
                  type="checkbox"
                  id={`message-select-${message.id}`}
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
              ) : isBelayGroupMessage(message.content) ? (
                <BelayGroupMessageButton 
                  message={message.content}
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
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  {message.content}
                </div>
              )}
            </div>
            
            {/* Reactions component - only show if not in delete mode */}
            {!isDeleteMode && (
              <MessageReactions
                messageId={message.id}
                messageType="group"
                className="mt-1"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ChatContainer>
      <ChatHeader 
        title={groupName}
        subtitle={`${messages.length} messages`}
        onBack={() => navigate('/groups')}
      >
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
      </ChatHeader>

      <ChatMessages
        messages={filteredMessages}
        currentUserId={user?.id}
        isLoading={!messagesLoaded}
        renderMessage={customRenderMessage}
        formatTimestamp={formatTimestamp}
      />

      <ChatInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        placeholder={`Message ${groupName}...`}
        disabled={isDeleteMode}
        leftButton={
          <ChatActionsMenu 
            onCreateEvent={handleCreateEvent}
            onFindPartners={handleFindPartners}
            onLeave={handleLeaveClick}
            leaveText="Leave Group"
            isAdmin={isAdmin}
            onDeleteMessages={toggleDeleteMode}
            isDeleteMode={isDeleteMode}
            isGymChat={true}
          />
        }
      >
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
      </ChatInput>
      

      <CreateEventModal 
        open={showCreateEventModal} 
        onClose={() => setShowCreateEventModal(false)}
        groupId={groupId}
        groupName={groupName}
        chatType="group"
        chatId={groupId}
      />

      <CreateBelayGroupModal 
        open={showCreateBelayGroupModal} 
        onClose={() => setShowCreateBelayGroupModal(false)}
        gymId={groupId}
        gymName={groupName}
      />
      
      {/* Leave Group Confirmation Dialog */}
      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave {groupName}? You'll need to be re-invited to join again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLeave}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ChatContainer>
  );
}