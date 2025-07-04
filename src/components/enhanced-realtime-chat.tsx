import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Send, 
  Search, 
  Edit2, 
  Check, 
  X, 
  Smile, 
  MoreHorizontal,
  Reply
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTypingIndicators } from '@/hooks/useTypingIndicators';
import { useMessageReactions } from '@/hooks/useMessageReactions';
import { 
  highlightMentions, 
  searchMessages, 
  getUserSuggestions, 
  insertMention,
  commonEmojis,
  formatTimestamp
} from '@/utils/messageUtils';

export interface ChatMessage {
  id: string;
  content: string;
  username: string;
  avatar_url?: string;
  timestamp: string;
  user_id?: string;
  edited_at?: string;
  original_content?: string;
  mentioned_users?: string[];
}

interface RealtimeChatProps {
  roomName: string;
  username: string;
  onMessage?: (message: ChatMessage) => void;
  messages?: ChatMessage[];
  className?: string;
}

interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
}

function MessageItem({ 
  message, 
  isOwn, 
  currentUsername, 
  onEdit, 
  onStartEdit 
}: { 
  message: ChatMessage; 
  isOwn: boolean; 
  currentUsername: string;
  onEdit: (messageId: string, newContent: string) => void;
  onStartEdit: (messageId: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { reactions, toggleReaction } = useMessageReactions(message.id);

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const isMentioned = message.mentioned_users?.some(userId => 
    // This would need to be enhanced to check current user ID
    true // Simplified for now
  );

  return (
    <div
      className={`flex items-start space-x-3 ${
        isOwn ? 'flex-row-reverse space-x-reverse' : ''
      } ${isMentioned ? 'bg-blue-50 -mx-2 px-2 py-1 rounded-lg' : ''}`}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={message.avatar_url} />
        <AvatarFallback>
          {message.username?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 max-w-xs ${isOwn ? 'text-right' : ''}`}>
        <div className="flex items-center space-x-2 mb-1">
          <span className={`text-sm font-medium ${
            isOwn ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {isOwn ? 'You' : message.username}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.edited_at && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
        </div>
        
        <div className="group relative">
          <div
            className={`rounded-lg px-3 py-2 ${
              isOwn
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-sm resize-none min-h-[60px]"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm whitespace-pre-wrap break-words">
                {highlightMentions(message.content, currentUsername)}
              </div>
            )}
          </div>
          
          {/* Message actions - DISABLED until migration applied */}
          {false && !isEditing && (
            <div className={`absolute -top-2 ${isOwn ? 'left-0' : 'right-0'} opacity-0 group-hover:opacity-100 transition-opacity`}>
              <div className="flex items-center space-x-1 bg-white border rounded-lg shadow-sm px-2 py-1">
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Smile className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {commonEmojis.map((emoji) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-lg"
                          onClick={() => {
                            toggleReaction(emoji);
                            setShowEmojiPicker(false);
                          }}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                {isOwn && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Reactions - DISABLED until migration applied */}
        {false && reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {reactions.map((reaction) => (
              <Tooltip key={reaction.emoji}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs ${
                      reaction.hasReacted ? 'bg-blue-100 border-blue-300' : ''
                    }`}
                    onClick={() => toggleReaction(reaction.emoji)}
                  >
                    {reaction.emoji} {reaction.count}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{reaction.users.map(u => u.username).join(', ')}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator({ typingUsers }: { typingUsers: any[] }) {
  if (typingUsers.length === 0) return null;

  const names = typingUsers.map(u => u.username).slice(0, 3);
  const remainingCount = typingUsers.length - 3;

  return (
    <div className="flex items-center space-x-2 text-gray-500 text-sm px-4 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
      <span>
        {names.join(', ')}
        {remainingCount > 0 && ` and ${remainingCount} other${remainingCount > 1 ? 's' : ''}`}
        {typingUsers.length === 1 ? ' is' : ' are'} typing...
      </span>
    </div>
  );
}

export function EnhancedRealtimeChat({ 
  roomName, 
  username, 
  onMessage, 
  messages: initialMessages = [], 
  className = "" 
}: RealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { typingUsers, handleTyping, stopTyping } = useTypingIndicators(roomName);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [filteredMessages]);

  // Load user profiles for mentions
  useEffect(() => {
    const loadUserProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .limit(100);
      
      setUserProfiles(data || []);
    };
    
    loadUserProfiles();
  }, []);

  // Filter messages based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredMessages(searchMessages(messages, searchQuery));
    } else {
      setFilteredMessages(messages);
    }
  }, [messages, searchQuery]);

  // Load existing messages and set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        console.log('Loading messages for user:', user);
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles (
              display_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: true })
          .limit(50);

        if (error) {
          console.error('Error loading messages from database:', error);
          throw error;
        }

        console.log('Raw messages from database:', data);

        const chatMessages: ChatMessage[] = (data || []).map(msg => ({
          id: msg.id,
          content: msg.content,
          username: msg.profiles?.display_name || 'Anonymous',
          avatar_url: msg.profiles?.avatar_url || undefined,
          timestamp: msg.created_at || new Date().toISOString(),
          user_id: msg.user_id || undefined,
          edited_at: undefined, // Will be supported after migration
          original_content: undefined, // Will be supported after migration
          mentioned_users: [], // Will be supported after migration
        }));

        console.log('Processed chat messages:', chatMessages);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        alert(`Failed to load messages: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`enhanced-chat-${roomName}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const { data: newMsg } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              created_at,
              user_id,
              profiles (
                display_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (newMsg) {
            const chatMessage: ChatMessage = {
              id: newMsg.id,
              content: newMsg.content,
              username: newMsg.profiles?.display_name || 'Anonymous',
              avatar_url: newMsg.profiles?.avatar_url || undefined,
              timestamp: newMsg.created_at || new Date().toISOString(),
              user_id: newMsg.user_id || undefined,
              edited_at: undefined, // Will be supported after migration
              original_content: undefined, // Will be supported after migration
              mentioned_users: [], // Will be supported after migration
            };

            setMessages(prev => [...prev, chatMessage]);
            
            if (onMessage) {
              onMessage(chatMessage);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          const { data: updatedMsg } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              created_at,
              user_id,
              profiles (
                display_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (updatedMsg) {
            const chatMessage: ChatMessage = {
              id: updatedMsg.id,
              content: updatedMsg.content,
              username: updatedMsg.profiles?.display_name || 'Anonymous',
              avatar_url: updatedMsg.profiles?.avatar_url || undefined,
              timestamp: updatedMsg.created_at || new Date().toISOString(),
              user_id: updatedMsg.user_id || undefined,
              edited_at: undefined, // Will be supported after migration
              original_content: undefined, // Will be supported after migration
              mentioned_users: [], // Will be supported after migration
            };

            setMessages(prev => 
              prev.map(msg => msg.id === chatMessage.id ? chatMessage : msg)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, roomName, onMessage]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || isSending) return;

    console.log('Attempting to send message:', newMessage.trim());
    console.log('User:', user);

    setIsSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content: newMessage.trim(),
          user_id: user.id,
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Message sent successfully:', data);
      setNewMessage('');
      // stopTyping(); // Disabled until migration
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          content: newContent,
          edited_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Typing indicators disabled until migration
    // handleTyping();

    // Mention suggestions disabled until migration
    // const position = e.target.selectionStart;
    // setCursorPosition(position);
    // const beforeCursor = value.slice(0, position);
    // const mentionMatch = beforeCursor.match(/@(\w*)$/);
    // if (mentionMatch) {
    //   setMentionQuery(mentionMatch[1]);
    //   setShowMentionSuggestions(true);
    // } else {
    //   setShowMentionSuggestions(false);
    //   setMentionQuery('');
    // }
  };

  const handleMentionSelect = (profile: UserProfile) => {
    const { newContent, newCursorPosition } = insertMention(
      newMessage,
      cursorPosition,
      profile.display_name
    );
    
    setNewMessage(newContent);
    setShowMentionSuggestions(false);
    setMentionQuery('');
    
    // Focus and set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!showMentionSuggestions) {
        handleSendMessage();
      }
    }
  };

  const mentionSuggestions = getUserSuggestions(userProfiles, mentionQuery);

  if (isLoading) {
    return (
      <Card className={`h-[calc(100vh-12rem)] ${className}`}>
        <CardHeader>
          <CardTitle>Club Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-16 w-64" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-[calc(100vh-12rem)] ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Club Chat</span>
            <span className="text-sm font-normal text-gray-500">
              {messages.length} messages
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {showSearch && (
          <div className="mt-2">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col h-full p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>
                {searchQuery ? 'No messages found for your search.' : 'No messages yet. Start the conversation!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwn={message.user_id === user?.id}
                  currentUsername={username}
                  onEdit={handleEditMessage}
                  onStartEdit={() => {}}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        
        {/* <TypingIndicator typingUsers={typingUsers} /> - DISABLED until migration applied */}
        
        <div className="border-t p-4">
          <div className="relative">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isSending}
                  className="min-h-[40px] max-h-[120px] resize-none pr-12"
                  rows={1}
                />
                
                {/* Mention suggestions - DISABLED until migration applied */}
                {false && showMentionSuggestions && mentionSuggestions.length > 0 && (
                  <div className="absolute bottom-full left-0 mb-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2 space-y-1">
                      {mentionSuggestions.map((profile) => (
                        <Button
                          key={profile.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleMentionSelect(profile)}
                        >
                          <Avatar className="w-6 h-6 mr-2">
                            <AvatarImage src={profile.avatar_url} />
                            <AvatarFallback>
                              {profile.display_name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          {profile.display_name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                size="icon"
                className="h-10 w-10 self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}