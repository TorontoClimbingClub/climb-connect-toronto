
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/hooks/useMessages';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
}

export function MessageItem({ message, isOwn }: MessageItemProps) {
  return (
    <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={message.profiles?.avatar_url} />
        <AvatarFallback>
          {message.profiles?.display_name?.[0] || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className={`flex-1 ${isOwn ? 'text-right' : ''}`}>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-sm font-medium text-gray-900">
            {message.profiles?.display_name || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        <div
          className={`inline-block px-4 py-2 rounded-lg max-w-xs sm:max-w-md lg:max-w-lg break-words ${
            isOwn
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-900 border border-gray-200'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
