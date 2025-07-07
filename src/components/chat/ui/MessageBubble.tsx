import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { BaseMessage } from '../types';

interface MessageBubbleProps {
  message: BaseMessage;
  isOwnMessage: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  showUsername?: boolean;
  canDelete?: boolean;
  onDelete?: (messageId: string) => void;
  formatTimestamp?: (timestamp: string) => string;
  className?: string;
}

export function MessageBubble({
  message,
  isOwnMessage,
  showAvatar = true,
  showTimestamp = true,
  showUsername = true,
  canDelete = false,
  onDelete,
  formatTimestamp,
  className = ''
}: MessageBubbleProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(message.id);
    }
  };

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

  return (
    <div
      className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''} ${className}`}
      data-message-id={message.id}
    >
      {showAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.profiles?.avatar_url} />
          <AvatarFallback>
            {message.profiles?.display_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
        {(showUsername || showTimestamp || canDelete) && (
          <div className="flex items-center gap-2 mb-1">
            {showUsername && (
              <span className="text-sm font-medium">
                {message.profiles?.display_name || 'Unknown User'}
              </span>
            )}
            {showTimestamp && (
              <span className="text-xs text-gray-500">
                {formatTimestamp ? formatTimestamp(message.created_at) : defaultFormatTimestamp(message.created_at)}
              </span>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Delete message"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        
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
}