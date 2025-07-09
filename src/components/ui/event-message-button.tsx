import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatEventMessageContent } from '@/utils/eventMessageUtils';
import { useNavigate } from 'react-router-dom';

interface EventMessageButtonProps {
  content: string;
  isOwnMessage: boolean;
}

export const EventMessageButton: React.FC<EventMessageButtonProps> = ({
  content,
  isOwnMessage
}) => {
  const navigate = useNavigate();
  const { title, details, eventId } = formatEventMessageContent(content);

  const handleEventClick = () => {
    if (eventId) {
      navigate(`/events/${eventId}/chat`);
    }
  };

  return (
    <Card 
      className={`max-w-[85%] cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
        isOwnMessage 
          ? 'border-green-200 bg-green-50 hover:border-green-300' 
          : 'border-blue-200 bg-blue-50 hover:border-blue-300'
      }`}
      onClick={handleEventClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Calendar className={`h-5 w-5 ${
              isOwnMessage ? 'text-green-600' : 'text-blue-600'
            }`} />
            <span className={`font-semibold text-sm ${
              isOwnMessage ? 'text-green-900' : 'text-blue-900'
            }`}>
              Event Created
            </span>
          </div>
          <ArrowRight className={`h-4 w-4 ${
            isOwnMessage ? 'text-green-500' : 'text-blue-500'
          }`} />
        </div>
        
        <div className="space-y-2">
          <h4 className={`font-medium text-base ${
            isOwnMessage ? 'text-green-900' : 'text-blue-900'
          }`}>
            {title}
          </h4>
          
          <div className={`text-sm whitespace-pre-line ${
            isOwnMessage ? 'text-green-800' : 'text-blue-800'
          }`}>
            {details.replace('🎯 New Event Created: "' + title + '"', '').trim()}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`mt-3 w-full border-2 ${
              isOwnMessage 
                ? 'border-green-300 text-green-700 hover:bg-green-100' 
                : 'border-blue-300 text-blue-700 hover:bg-blue-100'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick();
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Join Event Chat
          </Button>
        </div>
      </div>
    </Card>
  );
};