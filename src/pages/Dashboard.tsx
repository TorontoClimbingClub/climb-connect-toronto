import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { supabase } from '@/integrations/supabase/client';
import {
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Hash
} from 'lucide-react';



export default function Dashboard() {
  const { user } = useAuth();
  const { stats, upcomingEvents, activeChats, isLoading } = useDashboard();
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'joined'>('all');

  React.useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
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
      setIsAdmin(false);
    }
  };


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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };


  const getChatIcon = (type: 'event' | 'group' | 'club') => {
    switch (type) {
      case 'event':
        return Calendar;
      case 'group':
        return Users;
      case 'club':
        return Hash;
      default:
        return MessageSquare;
    }
  };

  // Filter events based on selected filter
  const filteredEvents = upcomingEvents.filter(event => {
    if (eventFilter === 'joined') {
      return event.is_participant;
    }
    return true; // 'all' shows all events
  });





  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

        {/* Admin Statistics */}
        {isAdmin && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Admin Statistics</h2>
            </div>
            <div className="desktop-grid-4 md:desktop-grid-2 lg:desktop-grid-4">
          <Card className="desktop-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total events created
              </p>
            </CardContent>
          </Card>

          <Card className="desktop-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalGroups || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active climbing groups
              </p>
            </CardContent>
          </Card>

          <Card className="desktop-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMessages || 0}</div>
              <p className="text-xs text-muted-foreground">
                Community messages
              </p>
            </CardContent>
          </Card>

          <Card className="desktop-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Members</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered members
              </p>
            </CardContent>
          </Card>
            </div>
          </>
        )}

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
            </div>
            <Select value={eventFilter} onValueChange={(value: 'all' | 'joined') => setEventFilter(value)}>
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
              {filteredEvents && filteredEvents.length > 0 ? (
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

        {/* Most Active Chats */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Community Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeChats && activeChats.length > 0 ? (
                activeChats.map((chat) => {
                  const Icon = getChatIcon(chat.type);
                  return (
                    <Link
                      key={`${chat.type}-${chat.id}`}
                      to={chat.href}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer hover:border-green-300"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{chat.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              <span>{chat.messageCount} messages</span>
                            </span>
                            {chat.lastActivity && (
                              <span className="text-xs">•</span>
                            )}
                            {chat.lastActivity && (
                              <span className="text-xs">
                                {formatTimeAgo(chat.lastActivity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {chat.type === 'club' ? 'Club Talk' : chat.type}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No active chats yet</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center mt-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/club-talk">Start Club Discussion</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/events">Join Event Chat</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}