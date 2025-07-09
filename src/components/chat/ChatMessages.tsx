import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { shouldDisplayWithoutBubble } from '@/utils/emojiUtils';

interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name: string;
    avatar_url?: string;
  } | null;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  formatTimestamp?: (timestamp: string) => string;
  renderMessage?: (message: ChatMessage, isOwnMessage: boolean) => React.ReactNode;
  className?: string;
}

const defaultFormatTimestamp = (timestamp: string): string => {
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

export function ChatMessages({
  messages,
  currentUserId,
  isLoading = false,
  emptyMessage = "No messages yet. Start the conversation!",
  formatTimestamp = defaultFormatTimestamp,
  renderMessage,
  className = ''
}: ChatMessagesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (viewportRef.current) {
      const scrollContainer = viewportRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className={`flex-1 overflow-y-auto p-4 min-h-0 chat-scrollbar ${className}`}>
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
    );
  }

  return (
    <div className={`flex-1 overflow-y-auto p-4 min-h-0 chat-scrollbar ${className}`} ref={viewportRef}>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {emptyMessage}
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.user_id === currentUserId;
            const prevMessage = messages[index - 1];
            const isThreaded = prevMessage && prevMessage.user_id === message.user_id;
            
            if (renderMessage) {
              return renderMessage(message, isOwnMessage);
            }
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isThreaded ? 'mt-0.5' : 'mt-4'}`}
              >
                {/* Avatar - only show for other users' messages */}
                {!isOwnMessage && (
                  <div className="flex flex-col items-center mr-3">
                    {!isThreaded ? (
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
                  {!isThreaded && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.profiles?.display_name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500">
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
            );
          })
        )}
      </div>
    </div>
  );
}