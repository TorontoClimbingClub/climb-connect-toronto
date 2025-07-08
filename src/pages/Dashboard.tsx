import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Calendar,
  Users,
  MessageSquare,
  TrendingUp,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  Shield
} from 'lucide-react';

interface DashboardStats {
  totalEvents: number;
  totalGroups: number;
  totalMessages: number;
  activeUsers: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  location: string;
  event_date: string;
  participant_count: number;
  max_participants?: number;
}

interface RecentMessage {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
  chat_type: string;
  chat_name: string;
}


export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalGroups: 0,
    totalMessages: 0,
    activeUsers: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
      loadDashboardData();
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
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [eventsCount, groupsCount, messagesCount, usersCount] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('groups').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalEvents: eventsCount.count || 0,
        totalGroups: groupsCount.count || 0,
        totalMessages: messagesCount.count || 0,
        activeUsers: usersCount.count || 0
      });

      // Load upcoming events
      const { data: events } = await supabase
        .from('events')
        .select(`
          id,
          title,
          location,
          event_date,
          max_participants,
          event_participants(count)
        `)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(5);

      if (events) {
        const formattedEvents: UpcomingEvent[] = events.map(event => ({
          id: event.id,
          title: event.title,
          location: event.location,
          event_date: event.event_date,
          participant_count: Array.isArray(event.event_participants) ? event.event_participants.length : 0,
          max_participants: event.max_participants
        }));
        setUpcomingEvents(formattedEvents);
      }

      // Real implementation would query recent messages from the database
      // For now, show empty state until real-time messaging is implemented
      setRecentMessages([]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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





  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.user_metadata?.display_name || user?.email}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening in the climbing community today.
            </p>
          </div>
          <Button asChild>
            <Link to="/events">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

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
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
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
              <div className="text-2xl font-bold">{stats.totalGroups}</div>
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
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
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
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
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
              <CardDescription>
                Don't miss out on these climbing opportunities
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/events">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(event.event_date)}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.participant_count}
                            {event.max_participants ? ` / ${event.max_participants}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/events/${event.id}`}>View</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No upcoming events</p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link to="/events">Create the first one!</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Community Activity</CardTitle>
              <CardDescription>
                Latest messages from across the platform
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/club-talk">
                Join Conversation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.length > 0 ? (
                recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {message.user_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {message.user_name}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {message.chat_name}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(message.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent messages</p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link to="/club-talk">Start a conversation!</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}