import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, MessageSquare, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import type { EventWithStats } from '@/hooks/useEvents';

interface EventCardProps {
  event: EventWithStats;
  onJoin?: (eventId: string) => void;
  onLeave?: (eventId: string) => void;
  isJoining?: boolean;
  isLeaving?: boolean;
  showChatButton?: boolean;
  compact?: boolean;
}

export function EventCard({
  event,
  onJoin,
  onLeave,
  isJoining = false,
  isLeaving = false,
  showChatButton = false,
  compact = false
}: EventCardProps) {
  const isActionLoading = isJoining || isLeaving;
  const isFull = event.max_participants && event.participant_count >= event.max_participants;

  if (compact) {
    return (
      <div className={`border rounded-lg cursor-pointer transition-colors p-4 ${
        event.is_participant 
          ? 'border-orange-400 hover:border-orange-500 hover:bg-gray-50' 
          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{event.title}</h3>
            <p className="text-gray-600 text-sm truncate mb-2">{event.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center gap-1 flex-shrink-0">
                <CalendarDays className="h-4 w-4" />
                <span className="whitespace-nowrap">{format(new Date(event.event_date), 'PPP p')}</span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Users className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {event.participant_count}{event.max_participants ? `/${event.max_participants}` : ''} participants
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 ml-6">
            <div className={`px-4 py-2 rounded-md text-sm font-medium pointer-events-none ${
              event.is_participant 
                ? 'bg-gray-100 text-gray-800'
                : isActionLoading
                ? 'bg-gray-100 text-gray-600'
                : isFull
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {event.is_participant ? (
                'Open Chat'
              ) : isActionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                  {isJoining ? 'Joining...' : 'Leaving...'}
                </>
              ) : isFull ? (
                'Full'
              ) : (
                'Join Event'
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`cursor-pointer transition-colors ${
      event.is_participant 
        ? 'border-orange-400 hover:border-orange-500 hover:bg-gray-50' 
        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
    }`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{event.title}</CardTitle>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 mr-2" />
            {format(new Date(event.event_date), 'PPP p')}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            <span>{event.participant_count}{event.max_participants ? `/${event.max_participants}` : ''} participants</span>
          </div>
          
          <div className={`px-3 py-1 rounded-md text-sm font-medium pointer-events-none ${
            event.is_participant 
              ? 'bg-gray-100 text-gray-800'
              : isActionLoading
              ? 'bg-gray-100 text-gray-600'
              : isFull
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {event.is_participant ? (
              'Open Chat'
            ) : isActionLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin inline" />
                {isJoining ? 'Joining...' : 'Leaving...'}
              </>
            ) : isFull ? (
              'Full'
            ) : (
              'Join Event'
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}