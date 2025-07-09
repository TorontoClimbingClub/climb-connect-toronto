import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { UpcomingEvent } from '@/hooks/useDashboard';

interface UpcomingEventsProps {
  events: UpcomingEvent[];
  isLoading?: boolean;
  eventFilter: 'all' | 'joined';
  onFilterChange: (filter: 'all' | 'joined') => void;
}

export function UpcomingEvents({ events, isLoading, eventFilter, onFilterChange }: UpcomingEventsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEvents = events.filter(event => {
    if (eventFilter === 'joined') {
      return event.is_participant;
    }
    return true;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Events</CardTitle>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Events</CardTitle>
        </div>
        <Select value={eventFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="joined">Joined</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div 
          className={`space-y-4 ${
            filteredEvents.length > 3 
              ? 'max-h-80 overflow-y-auto pr-2 chat-scrollbar' 
              : ''
          }`}
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}/chat`}
                className={`flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                  event.is_participant 
                    ? 'border-orange-400 hover:border-orange-500' 
                    : 'hover:border-green-300'
                }`}
              >
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 min-w-0">
                    <span className="flex items-center flex-shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="whitespace-nowrap">{formatDate(event.event_date)}</span>
                    </span>
                    <span className="flex items-center min-w-0">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </span>
                    <span className="flex items-center flex-shrink-0">
                      <Users className="h-3 w-3 mr-1" />
                      <span className="whitespace-nowrap">
                        {event.participant_count}
                        {event.max_participants ? ` / ${event.max_participants}` : ''}
                      </span>
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </Link>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>
                {eventFilter === 'joined' 
                  ? 'No joined events' 
                  : 'No upcoming events'
                }
              </p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link to="/events">
                  {eventFilter === 'joined' 
                    ? 'Find events to join!' 
                    : 'Create the first one!'
                  }
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}