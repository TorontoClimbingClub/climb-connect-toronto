
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Users, Plus, MessageSquare, LogOut, Loader2 } from 'lucide-react';
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
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [leaveEventId, setLeaveEventId] = useState<string | null>(null);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
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
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to load events",
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
        title: "Event created successfully!",
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
        title: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const navigateToEventChat = (eventId: string) => {
    // Navigate to event chat (read status will be updated when user actually reads messages)
    navigate(`/events/${eventId}/chat`);
  };

  const handleLeaveClick = (eventId: string) => {
    setLeaveEventId(eventId);
    setIsLeaveDialogOpen(true);
  };

  const confirmLeave = () => {
    if (leaveEventId) {
      toggleParticipation(leaveEventId, true);
      setIsLeaveDialogOpen(false);
      setLeaveEventId(null);
    }
  };

  const cancelLeave = () => {
    setIsLeaveDialogOpen(false);
    setLeaveEventId(null);
  };

  const toggleParticipation = async (eventId: string, isParticipating: boolean) => {
    if (!user || joiningEventId === eventId) return;

    // Set loading state for this specific event
    setJoiningEventId(eventId);

    try {
      if (isParticipating) {
        // Optimistically update UI for leaving event
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, is_participant: false, participant_count: Math.max(0, event.participant_count - 1) }
            : event
        ));

        const { error } = await supabase
          .from('event_participants')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);

        if (error) {
          // Rollback on error
          setEvents(prev => prev.map(event => 
            event.id === eventId 
              ? { ...event, is_participant: true, participant_count: event.participant_count + 1 }
              : event
          ));
          throw error;
        }

        toast({
          title: "Left event successfully",
        });
      } else {
        // First check if already participating
        const { data: existingParticipation, error: checkError } = await supabase
          .from('event_participants')
          .select('user_id')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 = no rows found, which is expected for new participation
          throw checkError;
        }

        if (existingParticipation) {
          // Already participating - just show message and update UI
          toast({
            title: "Already joined this event",
          });
          // Force UI update to show correct state
          loadEvents();
          return;
        }

        // Optimistically update UI for joining event
        setEvents(prev => prev.map(event => 
          event.id === eventId 
            ? { ...event, is_participant: true, participant_count: event.participant_count + 1 }
            : event
        ));

        // Actually insert the participation
        const { error: insertError } = await supabase
          .from('event_participants')
          .insert([
            {
              event_id: eventId,
              user_id: user.id,
            },
          ]);

        if (insertError) {
          // Rollback optimistic update on error
          setEvents(prev => prev.map(event => 
            event.id === eventId 
              ? { ...event, is_participant: false, participant_count: Math.max(0, event.participant_count - 1) }
              : event
          ));
          
          if (insertError.code === '23505') {
            // Unique constraint violation - already participating
            toast({
              title: "Already joined this event",
            });
            loadEvents(); // Sync UI state
            return;
          }
          throw insertError;
        }

        toast({
          title: "Joined event successfully!",
        });
      }

      // Refresh data to ensure consistency
      loadEvents();
    } catch (error: any) {
      console.error('Error toggling participation:', error);
      
      // Handle specific error cases
      let errorMessage = "Failed to update participation.";
      if (error?.code === '23505') {
        errorMessage = "You're already participating in this event.";
      } else if (error?.message?.includes('409')) {
        errorMessage = "Participation conflict - you may already be joined.";
      }
      
      toast({
        title: errorMessage,
        variant: "destructive",
      });
    } finally {
      // Clear loading state
      setJoiningEventId(null);
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
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  const myEvents = events.filter(event => event.is_participant);
  const availableEvents = events.filter(event => !event.is_participant);

  return (
    <div className="space-y-6 relative">
      {myEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">You're Attending</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myEvents.map((event) => (
              <Card 
                key={event.id} 
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {event.title}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Joined
                    </Badge>
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
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link 
                        to={`/events/${event.id}/chat`}
                        onClick={() => navigateToEventChat(event.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLeaveClick(event.id)}
                    >
                      Leave
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Events you might be interested in</h1>
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

      {availableEvents.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500">Create the first climbing event for the community!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableEvents.map((event) => (
            <Card 
              key={event.id} 
              className={`hover:shadow-lg transition-shadow ${
                event.has_unread 
                  ? 'ring-2 ring-orange-400 shadow-orange-200 shadow-lg' 
                  : ''
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {event.title}
                    {event.has_unread && (
                      <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                    )}
                  </CardTitle>
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
                {event.is_participant ? (
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <Link 
                        to={`/events/${event.id}/chat`}
                        onClick={() => navigateToEventChat(event.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLeaveClick(event.id)}
                    >
                      Leave
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => toggleParticipation(event.id, event.is_participant)}
                    disabled={
                      joiningEventId === event.id || 
                      (event.max_participants && event.participant_count >= event.max_participants)
                    }
                    className="w-full"
                  >
                    {joiningEventId === event.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      'Join'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Leave Event Confirmation Dialog */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Leave Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this event? You can rejoin at any time if there are still spots available.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLeave}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              Leave Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
