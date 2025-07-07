import React, { forwardRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { BaseMessage } from '../types';
import { useAuth } from '@/hooks/useAuth';

interface MessageListProps {
  messages: BaseMessage[];
  isLoading?: boolean;
  canDelete?: (messageUserId: string) => boolean;
  onDeleteMessage?: (messageId: string) => void;
  onScroll?: () => void;
  formatTimestamp?: (timestamp: string) => string;
  emptyStateMessage?: string;
  className?: string;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({
  messages,
  isLoading = false,
  canDelete,
  onDeleteMessage,
  onScroll,
  formatTimestamp,
  emptyStateMessage = "No messages yet. Start the conversation!",
  className = ''
}, ref) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className={`flex-1 overflow-y-auto p-4 min-h-0 ${className}`} ref={ref}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex-1 overflow-y-auto p-4 min-h-0 ${className}`} 
      ref={ref}
      onScroll={onScroll}
    >
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {emptyStateMessage}
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.user_id === user?.id;
            const canDeleteMessage = canDelete ? canDelete(message.user_id) : false;
            
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                canDelete={canDeleteMessage}
                onDelete={onDeleteMessage}
                formatTimestamp={formatTimestamp}
              />
            );
          })
        )}
      </div>
    </div>
  );
});