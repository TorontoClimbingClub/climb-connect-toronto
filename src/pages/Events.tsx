
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  max_participants: number;
  created_by: string;
  created_at: string;
  participant_count: number;
  is_participant: boolean;
  profiles: {
    display_name: string;
  };
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    max_participants: '',
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          location,
          event_date,
          max_participants,
          created_by,
          created_at,
          profiles!created_by (
            display_name
          )
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;

      // Get participant counts and check if current user is participating
      const eventsWithCounts = await Promise.all(
        (data || []).map(async (event) => {
          const { count } = await supabase
            .from('event_participants')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          const { data: participation } = await supabase
            .from('event_participants')
            .select('user_id')
            .eq('event_id', event.id)
            .eq('user_id', user?.id)
            .single();

          return {
            ...event,
            participant_count: count || 0,
            is_participant: !!participation,
          };
        })
      );

      setEvents(eventsWithCounts);
    } catch (error: any) {
      console.error('Error loading events:', error);
      
      // Check if it's a table not found error (migration not applied)
      if (error?.message?.includes('relation "public.events" does not exist')) {
        toast({
          title: "Database Setup Required",
          description: "The events table hasn't been created yet. Please run the database migrations.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to load events: ${error?.message || 'Unknown error'}`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            event_date: formData.event_date,
            max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
            created_by: user.id,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Event created!",
        description: "Your climbing event has been created successfully.",
      });

      setFormData({
        title: '',
        description: '',
        location: '',
        event_date: '',
        max_participants: '',
      });
      setIsCreateOpen(false);
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    }
  };

  const toggleParticipation = async (eventId: string, isParticipating: boolean) => {
    if (!user) return;

    try {
      if (isParticipating) {
        const { error } = await supabase
          .from('event_participants')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Left event",
          description: "You've left the climbing event.",
        });
      } else {
        const { error } = await supabase
          .from('event_participants')
          .insert([
            {
              event_id: eventId,
              user_id: user.id,
            },
          ]);

        if (error) throw error;

        toast({
          title: "Joined event!",
          description: "You've joined the climbing event.",
        });
      }

      loadEvents();
    } catch (error) {
      console.error('Error toggling participation:', error);
      toast({
        title: "Error",
        description: "Failed to update participation.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadEvents();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Climbing Events</h1>
        </div>
        <Card className="text-center p-8">
          <CardContent>
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-500">Please sign in to view and join climbing events.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Climbing Events</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Climbing Events</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={createEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_date">Date & Time</Label>
                <Input
                  id="event_date"
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max Participants (optional)</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Create Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500">Create the first climbing event for the community!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  {event.is_participant && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Joined
                    </Badge>
                  )}
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
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {event.participant_count}{event.max_participants ? `/${event.max_participants}` : ''} participants
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={event.is_participant ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleParticipation(event.id, event.is_participant)}
                    disabled={!event.is_participant && event.max_participants && event.participant_count >= event.max_participants}
                  >
                    {event.is_participant ? 'Leave' : 'Join'}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
